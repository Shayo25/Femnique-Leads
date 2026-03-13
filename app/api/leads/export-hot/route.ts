import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateVACSV } from "@/lib/csv-export";

export async function GET() {
  const leads = await prisma.lead.findMany({
    where: { leadScore: "Hot" },
    orderBy: { createdAt: "desc" },
  });

  const csv = generateVACSV(leads);

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="femnique-hot-leads-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
