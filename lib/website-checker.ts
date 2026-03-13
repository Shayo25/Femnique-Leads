import { prisma } from "@/lib/db";
import {
  DUCKDUCKGO_HTML_URL,
  DIRECTORY_DOMAINS,
  TEMPLATE_SITE_INDICATORS,
  WEBSITE_CHECK_DELAY_MS,
} from "@/lib/config";
import { sleep } from "@/lib/utils";

function extractURLsFromHTML(html: string): string[] {
  const urls: string[] = [];
  const linkRegex = /href="(https?:\/\/[^"]+)"/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    try {
      const url = new URL(match[1]);
      if (
        !url.hostname.includes("duckduckgo.com") &&
        !url.hostname.includes("duck.com")
      ) {
        urls.push(match[1]);
      }
    } catch {
      // skip invalid URLs
    }
  }
  return urls;
}

function isDirectorySite(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return DIRECTORY_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return true;
  }
}

function isTemplateSite(url: string): boolean {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    const fullUrl = url.toLowerCase();
    return TEMPLATE_SITE_INDICATORS.some(
      (indicator) =>
        hostname.includes(indicator) || fullUrl.includes(indicator)
    );
  } catch {
    return false;
  }
}

async function searchDuckDuckGo(query: string): Promise<string[]> {
  try {
    const response = await fetch(DUCKDUCKGO_HTML_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      body: `q=${encodeURIComponent(query)}`,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      console.error(`DuckDuckGo search failed: ${response.status}`);
      return [];
    }

    const html = await response.text();
    return extractURLsFromHTML(html);
  } catch (error) {
    console.error("DuckDuckGo search error:", error);
    return [];
  }
}

export async function checkWebsiteForLead(leadId: number) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return;

  const query = `"${lead.organizationName}" ${lead.city || ""} ${lead.taxonomyDescription}`;
  const urls = await searchDuckDuckGo(query);

  const relevantUrls = urls.filter((url) => !isDirectorySite(url));

  let websiteStatus = "NO_WEBSITE";
  let websiteUrl: string | null = null;
  let websiteDetails: string | null = null;

  for (const url of relevantUrls) {
    if (isTemplateSite(url)) {
      websiteStatus = "TEMPLATE_SITE";
      websiteUrl = url;
      websiteDetails = "Template/builder site detected";
      break;
    } else {
      websiteStatus = "HAS_WEBSITE";
      websiteUrl = url;
      websiteDetails = "Custom website found";
      break;
    }
  }

  await prisma.lead.update({
    where: { id: leadId },
    data: { websiteStatus, websiteUrl, websiteDetails },
  });

  return { id: leadId, websiteStatus, websiteUrl };
}

export async function runWebsiteChecks() {
  const uncheckedLeads = await prisma.lead.findMany({
    where: { websiteStatus: "UNCHECKED" },
    orderBy: { createdAt: "desc" },
  });

  const results = [];
  for (let i = 0; i < uncheckedLeads.length; i++) {
    const lead = uncheckedLeads[i];
    try {
      const result = await checkWebsiteForLead(lead.id);
      results.push(result);
    } catch (error) {
      console.error(`Website check failed for lead ${lead.id}:`, error);
      results.push({ id: lead.id, websiteStatus: "UNCHECKED", error: true });
    }

    if (i < uncheckedLeads.length - 1) {
      await sleep(WEBSITE_CHECK_DELAY_MS);
    }
  }

  return { checked: results.length, results };
}
