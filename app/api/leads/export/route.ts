import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateGHLCSV } from "@/lib/csv-export";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const leadScore = searchParams.get("leadScore") || "";
  const websiteStatus = searchParams.get("websiteStatus") || "";
  const taxonomyCode = searchParams.get("taxonomyCode") || "";
  const ids = searchParams.get("ids") || "";

  const where: Record<string, unknown> = {};

  if (ids) {
    where.id = { in: ids.split(",").map((id) => parseInt(id, 10)) };
  }
  if (leadScore) where.leadScore = leadScore;
  if (websiteStatus) where.websiteStatus = websiteStatus;
  if (taxonomyCode) where.taxonomyCode = taxonomyCode;

  const leads = await prisma.lead.findMany({
    where: where as never,
    orderBy: { createdAt: "desc" },
  });

  const csv = generateGHLCSV(leads);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="femnique-leads-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
