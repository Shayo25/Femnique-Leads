import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadIds } = body as { leadIds: number[] };

    if (!leadIds || !Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { error: "leadIds array is required" },
        { status: 400 }
      );
    }

    const webhookSetting = await prisma.setting.findUnique({
      where: { key: "ghlWebhookUrl" },
    });

    if (!webhookSetting?.value) {
      return NextResponse.json(
        { error: "GHL webhook URL not configured. Set it in Settings." },
        { status: 400 }
      );
    }

    const leads = await prisma.lead.findMany({
      where: { id: { in: leadIds } },
    });

    const results = [];
    for (const lead of leads) {
      try {
        const response = await fetch(webhookSetting.value, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: lead.authorizedFirstName || "",
            lastName: lead.authorizedLastName || "",
            name: `${lead.authorizedFirstName || ""} ${lead.authorizedLastName || ""}`.trim(),
            phone: lead.phone || lead.authorizedPhone || "",
            companyName: lead.organizationName,
            address1: lead.addressLine1 || "",
            city: lead.city || "",
            state: lead.state,
            postalCode: lead.zip || "",
            source: "NPI Pipeline",
            tags: [`npi-${lead.leadScore.toLowerCase()}`, lead.taxonomyDescription],
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          await prisma.lead.update({
            where: { id: lead.id },
            data: { ghlPushed: true, ghlPushedAt: new Date() },
          });
          results.push({ id: lead.id, status: "success" });
        } else {
          results.push({
            id: lead.id,
            status: "failed",
            error: `HTTP ${response.status}`,
          });
        }
      } catch (error) {
        results.push({
          id: lead.id,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Push failed" },
      { status: 500 }
    );
  }
}
