export const TAXONOMY_CODES = [
  { code: "363L00000X", description: "Nurse Practitioner" },
  { code: "171100000X", description: "Esthetician / Skin Care Specialist" },
  { code: "225500000X", description: "Massage Therapist" },
  { code: "111N00000X", description: "Chiropractor" },
  { code: "122300000X", description: "Dentist" },
  { code: "1041C0700X", description: "Licensed Clinical Social Worker" },
  { code: "101YP2500X", description: "Licensed Professional Counselor" },
  { code: "171000000X", description: "Acupuncturist" },
  { code: "225100000X", description: "Physical Therapist" },
  { code: "103T00000X", description: "Psychologist" },
] as const;

export const DIRECTORY_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "linkedin.com",
  "yelp.com",
  "healthgrades.com",
  "zocdoc.com",
  "yellowpages.com",
  "vitals.com",
  "npidb.org",
  "npino.com",
  "npiprofile.com",
  "webmd.com",
  "bbb.org",
  "mapquest.com",
  "google.com",
  "twitter.com",
  "x.com",
  "tiktok.com",
  "youtube.com",
  "pinterest.com",
  "nextdoor.com",
  "angi.com",
  "thumbtack.com",
];

export const TEMPLATE_SITE_INDICATORS = [
  "wix.com",
  "wixsite.com",
  "squarespace.com",
  "weebly.com",
  "godaddy.com",
  "wordpress.com",
  "carrd.co",
  "webflow.io",
  "durable.co",
  "my.canva.site",
  "sites.google.com",
  "site123.com",
  "jimdo.com",
  "strikingly.com",
  "format.com",
];

export const NPPES_API_URL = "https://npiregistry.cms.hhs.gov/api/";
export const DUCKDUCKGO_HTML_URL = "https://html.duckduckgo.com/html/";

export const DEFAULT_LOOKBACK_DAYS = 30;
export const DEFAULT_STATE = "TX";
export const NPI_API_DELAY_MS = 1000;
export const WEBSITE_CHECK_DELAY_MS = 3000;
export const LEADS_PER_PAGE = 25;
