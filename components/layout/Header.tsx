"use client";

import { usePathname } from "next/navigation";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Dashboard",
    subtitle: "Overview of your NPI lead pipeline",
  },
  "/leads": {
    title: "All Leads",
    subtitle: "Search, filter, and manage your leads",
  },
  "/leads/hot": {
    title: "Hot Leads",
    subtitle: "High-priority prospects ready for outreach",
  },
  "/runs": {
    title: "Pipeline Runs",
    subtitle: "History of scrape and enrichment runs",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Configure pipeline behavior and integrations",
  },
};

export function Header() {
  const pathname = usePathname();
  const page = pageTitles[pathname] || pageTitles["/"];

  return (
    <header className="border-b border-taupe/10 bg-soft-white/60 backdrop-blur-sm">
      <div className="flex h-20 items-center justify-between px-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-charcoal">
            {page.title}
          </h1>
          <p className="mt-0.5 text-sm text-taupe">{page.subtitle}</p>
        </div>
      </div>
    </header>
  );
}
