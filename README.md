# Femnique NPI Lead Pipeline

NPI-powered lead acquisition system for Femnique — a performance marketing agency targeting newly opened wellness and aesthetics practices in Texas.

The system scrapes federal NPI registration data, checks if new practices have a website, scores leads, and displays everything in a clean editorial dashboard.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API routes
- **Database**: SQLite via Prisma
- **Language**: TypeScript
- **Data Source**: NPPES API (free, no auth)
- **Web Presence Check**: DuckDuckGo HTML search
- **Scheduling**: node-cron for automated daily runs
- **Export**: CSV generation for GHL import

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Database Setup

```bash
cp .env.example .env
npm run db:migrate
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

## Pipeline Overview

1. **NPI Scrape** — Queries NPPES API for new NPI-2 registrations across 10 wellness/aesthetics taxonomy codes in Texas
2. **Website Check** — Searches DuckDuckGo to determine if each practice has a website, a template site, or no web presence
3. **Lead Scoring** — Automatically scores leads as Hot (no website + recent), Warm (template site or older), or Cold (has website)
4. **Export** — CSV export in GHL format or VA-ready format for outreach

## Dashboard Pages

| Page | Path | Description |
|------|------|-------------|
| Dashboard | `/` | Stats overview, score distribution, recent leads, scrape controls |
| All Leads | `/leads` | Full searchable/filterable/sortable lead table |
| Hot Leads | `/leads/hot` | Pre-filtered hot leads with VA export |
| Pipeline Runs | `/runs` | History of scrape runs |
| Settings | `/settings` | Pipeline configuration, scheduling, GHL webhook |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/scrape` | Trigger NPI scrape run |
| POST | `/api/check-websites` | Run website presence checks |
| GET | `/api/leads` | Get leads (filterable/sortable/paginated) |
| GET | `/api/leads/[id]` | Get single lead |
| PATCH | `/api/leads/[id]` | Update lead (notes, score, etc.) |
| GET | `/api/leads/export` | Export leads as CSV |
| GET | `/api/leads/export-hot` | Export hot leads (VA format) |
| GET | `/api/runs` | Get scrape run history |
| GET | `/api/stats` | Get dashboard statistics |
| GET/PUT | `/api/settings` | Get/update settings |
| POST | `/api/ghl/push` | Push leads to GHL webhook |

## Target Taxonomy Codes

| Profession | Code |
|---|---|
| Nurse Practitioner | 363L00000X |
| Esthetician / Skin Care Specialist | 171100000X |
| Massage Therapist | 225500000X |
| Chiropractor | 111N00000X |
| Dentist | 122300000X |
| Licensed Clinical Social Worker | 1041C0700X |
| Licensed Professional Counselor | 101YP2500X |
| Acupuncturist | 171000000X |
| Physical Therapist | 225100000X |
| Psychologist | 103T00000X |
