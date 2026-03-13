import { NextResponse } from "next/server";
import { runWebsiteChecks } from "@/lib/website-checker";
import { scoreAllLeads } from "@/lib/lead-scorer";

export async function POST() {
  try {
    const websiteResult = await runWebsiteChecks();
    const scoreResult = await scoreAllLeads();

    return NextResponse.json({
      websiteChecks: websiteResult,
      scoring: scoreResult,
    });
  } catch (error) {
    console.error("Website check error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Website check failed" },
      { status: 500 }
    );
  }
}
