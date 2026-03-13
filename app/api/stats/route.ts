import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [
    totalLeads,
    hotLeads,
    warmLeads,
    coldLeads,
    unscoredLeads,
    newThisWeek,
    lastScrapeRun,
    taxonomyBreakdown,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { leadScore: "Hot" } }),
    prisma.lead.count({ where: { leadScore: "Warm" } }),
    prisma.lead.count({ where: { leadScore: "Cold" } }),
    prisma.lead.count({ where: { leadScore: "Unscored" } }),
    prisma.lead.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.scrapeRun.findFirst({ orderBy: { runDate: "desc" } }),
    prisma.lead.groupBy({
      by: ["taxonomyDescription"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  return NextResponse.json({
    totalLeads,
    hotLeads,
    warmLeads,
    coldLeads,
    unscoredLeads,
    newThisWeek,
    lastScrapeRun,
    taxonomyBreakdown: taxonomyBreakdown.map((t) => ({
      name: t.taxonomyDescription,
      count: t._count.id,
    })),
  });
}
