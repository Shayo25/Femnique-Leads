import { Lead } from "@prisma/client";

const GHL_COLUMNS = [
  "Name",
  "Practice Name",
  "Phone",
  "Address",
  "City",
  "State",
  "Zip",
  "Specialty",
  "Taxonomy Code",
  "NPI Number",
  "NPI Date",
  "Days Since Registration",
  "Website Status",
  "Website URL",
  "Lead Score",
];

const VA_COLUMNS = [
  "Name",
  "Practice Name",
  "Phone",
  "Address",
  "City",
  "Specialty",
  "NPI Date",
  "Lead Score",
];

function escapeCSV(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function getContactName(lead: Lead): string {
  const parts = [lead.authorizedFirstName, lead.authorizedLastName].filter(
    Boolean
  );
  return parts.join(" ");
}

function getFullAddress(lead: Lead): string {
  const parts = [lead.addressLine1, lead.addressLine2].filter(Boolean);
  return parts.join(", ");
}

export function generateGHLCSV(leads: Lead[]): string {
  const rows = leads.map((lead) => [
    getContactName(lead),
    lead.organizationName,
    lead.phone || lead.authorizedPhone || "",
    getFullAddress(lead),
    lead.city || "",
    lead.state,
    lead.zip || "",
    lead.taxonomyDescription,
    lead.taxonomyCode,
    lead.npiNumber,
    lead.enumerationDate,
    lead.daysSinceRegistration?.toString() || "",
    lead.websiteStatus,
    lead.websiteUrl || "",
    lead.leadScore,
  ]);

  const header = GHL_COLUMNS.map(escapeCSV).join(",");
  const body = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
  return `${header}\n${body}`;
}

export function generateVACSV(leads: Lead[]): string {
  const rows = leads.map((lead) => [
    getContactName(lead),
    lead.organizationName,
    lead.phone || lead.authorizedPhone || "",
    getFullAddress(lead),
    lead.city || "",
    lead.taxonomyDescription,
    lead.enumerationDate,
    lead.leadScore,
  ]);

  const header = VA_COLUMNS.map(escapeCSV).join(",");
  const body = rows.map((row) => row.map(escapeCSV).join(",")).join("\n");
  return `${header}\n${body}`;
}
