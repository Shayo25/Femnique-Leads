import { prisma } from "@/lib/db";

export function calculateLeadScore(
  websiteStatus: string,
  daysSinceRegistration: number | null
): string {
  if (websiteStatus === "NO_WEBSITE" && (daysSinceRegistration ?? 0) <= 30) {
    return "Hot";
  }
  if (
    websiteStatus === "TEMPLATE_SITE" ||
    (websiteStatus === "NO_WEBSITE" && (daysSinceRegistration ?? 999) > 30)
  ) {
    return "Warm";
  }
  if (websiteStatus === "HAS_WEBSITE") {
    return "Cold";
  }
  return "Unscored";
}

export async function scoreAllLeads() {
  const leads = await prisma.lead.findMany({
    where: {
      websiteStatus: { not: "UNCHECKED" },
    },
  });

  let scored = 0;
  for (const lead of leads) {
    const newScore = calculateLeadScore(
      lead.websiteStatus,
      lead.daysSinceRegistration
    );

    if (newScore !== lead.leadScore) {
      await prisma.lead.update({
        where: { id: lead.id },
        data: { leadScore: newScore },
      });
      scored++;
    }
  }

  return { totalProcessed: leads.length, updated: scored };
}

export async function scoreLead(leadId: number) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return null;

  const newScore = calculateLeadScore(
    lead.websiteStatus,
    lead.daysSinceRegistration
  );

  if (newScore !== lead.leadScore) {
    await prisma.lead.update({
      where: { id: lead.id },
      data: { leadScore: newScore },
    });
  }

  return newScore;
}
