import { NextResponse } from "next/server";
import { runNPIScrape } from "@/lib/npi-scraper";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const lookbackDays = body.lookbackDays as number | undefined;
    const state = body.state as string | undefined;

    const result = await runNPIScrape(lookbackDays, state);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Scrape error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Scrape failed" },
      { status: 500 }
    );
  }
}
