import { prisma } from "@/lib/db";
import { TAXONOMY_CODES, NPPES_API_URL, NPI_API_DELAY_MS } from "@/lib/config";
import { daysSince, formatPhone, sleep } from "@/lib/utils";

interface NPPESResult {
  number: string;
  basic: {
    organization_name?: string;
    authorized_official_first_name?: string;
    authorized_official_last_name?: string;
    authorized_official_title_or_position?: string;
    authorized_official_telephone_number?: string;
    enumeration_date?: string;
  };
  addresses: Array<{
    address_purpose: string;
    address_1: string;
    address_2?: string;
    city: string;
    state: string;
    postal_code: string;
    telephone_number?: string;
    fax_number?: string;
  }>;
  taxonomies: Array<{
    code: string;
    desc: string;
    primary: boolean;
  }>;
}

interface NPPESResponse {
  result_count: number;
  results: NPPESResult[];
}

const MAX_PAGES_PER_TAXONOMY = 50;
const CONSECUTIVE_EMPTY_PAGES_THRESHOLD = 3;

async function fetchNPPESPage(
  taxonomyDescription: string,
  state: string,
  skip: number
): Promise<NPPESResponse> {
  const params = new URLSearchParams({
    version: "2.1",
    enumeration_type: "NPI-2",
    state,
    taxonomy_description: taxonomyDescription,
    limit: "200",
    skip: skip.toString(),
  });

  const response = await fetch(`${NPPES_API_URL}?${params.toString()}`, {
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    throw new Error(`NPPES API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function fetchAllForTaxonomy(
  taxonomyDescription: string,
  state: string,
  lookbackDays: number
): Promise<NPPESResult[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - lookbackDays);

  const results: NPPESResult[] = [];
  let skip = 0;
  let pageCount = 0;
  let consecutiveEmptyPages = 0;

  while (pageCount < MAX_PAGES_PER_TAXONOMY) {
    try {
      const response = await fetchNPPESPage(taxonomyDescription, state, skip);

      if (!response.results || response.results.length === 0) {
        break;
      }

      let foundOnPage = 0;
      for (const result of response.results) {
        const enumDate = result.basic?.enumeration_date;
        if (enumDate) {
          const parsedDate = new Date(enumDate);
          if (parsedDate >= cutoffDate) {
            results.push(result);
            foundOnPage++;
          }
        }
      }

      if (foundOnPage === 0) {
        consecutiveEmptyPages++;
        if (consecutiveEmptyPages >= CONSECUTIVE_EMPTY_PAGES_THRESHOLD) {
          console.log(
            `[Scraper] Stopping ${taxonomyDescription} after ${consecutiveEmptyPages} consecutive pages with no recent results (page ${pageCount + 1})`
          );
          break;
        }
      } else {
        consecutiveEmptyPages = 0;
      }

      if (response.results.length < 200) {
        break;
      }

      skip += 200;
      pageCount++;
      await sleep(NPI_API_DELAY_MS);
    } catch (error) {
      console.error(
        `[Scraper] Error fetching "${taxonomyDescription}" at skip ${skip}:`,
        error
      );
      break;
    }
  }

  console.log(
    `[Scraper] ${taxonomyDescription}: found ${results.length} results within ${lookbackDays} days (scanned ${pageCount + 1} pages)`
  );
  return results;
}

function parseNPPESResult(result: NPPESResult) {
  const locationAddress = result.addresses?.find(
    (a) => a.address_purpose === "LOCATION"
  ) || result.addresses?.[0];

  const primaryTaxonomy =
    result.taxonomies?.find((t) => t.primary) || result.taxonomies?.[0];

  return {
    npiNumber: result.number,
    organizationName:
      result.basic?.organization_name || "Unknown Organization",
    authorizedFirstName:
      result.basic?.authorized_official_first_name || null,
    authorizedLastName:
      result.basic?.authorized_official_last_name || null,
    authorizedTitle:
      result.basic?.authorized_official_title_or_position || null,
    authorizedPhone: formatPhone(
      result.basic?.authorized_official_telephone_number
    ),
    phone: formatPhone(locationAddress?.telephone_number),
    fax: formatPhone(locationAddress?.fax_number),
    addressLine1: locationAddress?.address_1 || null,
    addressLine2: locationAddress?.address_2 || null,
    city: locationAddress?.city || null,
    state: locationAddress?.state || "TX",
    zip: locationAddress?.postal_code?.substring(0, 5) || null,
    taxonomyCode: primaryTaxonomy?.code || "",
    taxonomyDescription: primaryTaxonomy?.desc || "",
    enumerationDate: result.basic?.enumeration_date || "",
    daysSinceRegistration: result.basic?.enumeration_date
      ? daysSince(result.basic.enumeration_date)
      : null,
  };
}

export async function runNPIScrape(lookbackDays?: number, state?: string) {
  const settings = await prisma.setting.findMany();
  const settingsMap = Object.fromEntries(
    settings.map((s) => [s.key, s.value])
  );

  const effectiveLookback =
    lookbackDays ?? parseInt(settingsMap["lookbackDays"] || "30", 10);
  const effectiveState = state ?? settingsMap["targetState"] ?? "TX";

  const scrapeRun = await prisma.scrapeRun.create({
    data: {
      status: "running",
      lookbackDays: effectiveLookback,
    },
  });

  const startTime = Date.now();
  const batchDate = new Date().toISOString().split("T")[0];

  let totalFound = 0;
  let newLeads = 0;
  let duplicates = 0;
  const seenNPIs = new Set<string>();

  try {
    for (const taxonomy of TAXONOMY_CODES) {
      console.log(
        `[Scraper] Processing taxonomy: ${taxonomy.description} (${taxonomy.code})`
      );
      try {
        const results = await fetchAllForTaxonomy(
          taxonomy.description,
          effectiveState,
          effectiveLookback
        );

        for (const result of results) {
          if (seenNPIs.has(result.number)) {
            continue;
          }
          seenNPIs.add(result.number);
          totalFound++;

          const existing = await prisma.lead.findUnique({
            where: { npiNumber: result.number },
          });

          if (existing) {
            duplicates++;
            continue;
          }

          const parsed = parseNPPESResult(result);
          await prisma.lead.create({
            data: {
              ...parsed,
              scrapeBatch: batchDate,
            },
          });
          newLeads++;
        }

        await sleep(NPI_API_DELAY_MS);
      } catch (error) {
        console.error(
          `[Scraper] Error processing taxonomy ${taxonomy.code}:`,
          error
        );
      }
    }

    const durationSeconds = (Date.now() - startTime) / 1000;

    const hotLeads = await prisma.lead.count({
      where: { scrapeBatch: batchDate, leadScore: "Hot" },
    });
    const warmLeads = await prisma.lead.count({
      where: { scrapeBatch: batchDate, leadScore: "Warm" },
    });
    const coldLeads = await prisma.lead.count({
      where: { scrapeBatch: batchDate, leadScore: "Cold" },
    });

    await prisma.scrapeRun.update({
      where: { id: scrapeRun.id },
      data: {
        status: "completed",
        totalFound,
        newLeads,
        duplicates,
        hotLeads,
        warmLeads,
        coldLeads,
        durationSeconds,
      },
    });

    console.log(
      `[Scraper] Completed in ${Math.round(durationSeconds)}s. Found: ${totalFound}, New: ${newLeads}, Dupes: ${duplicates}`
    );

    return {
      id: scrapeRun.id,
      status: "completed",
      totalFound,
      newLeads,
      duplicates,
      durationSeconds,
    };
  } catch (error) {
    const durationSeconds = (Date.now() - startTime) / 1000;
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    await prisma.scrapeRun.update({
      where: { id: scrapeRun.id },
      data: {
        status: "failed",
        totalFound,
        newLeads,
        duplicates,
        durationSeconds,
        errorMessage,
      },
    });

    throw error;
  }
}
