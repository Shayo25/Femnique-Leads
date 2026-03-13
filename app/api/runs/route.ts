import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  const [runs, total] = await Promise.all([
    prisma.scrapeRun.findMany({
      orderBy: { runDate: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.scrapeRun.count(),
  ]);

  return NextResponse.json({
    runs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
