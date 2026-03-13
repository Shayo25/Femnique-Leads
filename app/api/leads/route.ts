import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { LEADS_PER_PAGE } from "@/lib/config";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(
    searchParams.get("limit") || String(LEADS_PER_PAGE),
    10
  );
  const search = searchParams.get("search") || "";
  const leadScore = searchParams.get("leadScore") || "";
  const websiteStatus = searchParams.get("websiteStatus") || "";
  const taxonomyCode = searchParams.get("taxonomyCode") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = (searchParams.get("sortOrder") || "desc") as
    | "asc"
    | "desc";
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { organizationName: { contains: search } },
      { city: { contains: search } },
      { authorizedFirstName: { contains: search } },
      { authorizedLastName: { contains: search } },
      { npiNumber: { contains: search } },
    ];
  }

  if (leadScore) {
    where.leadScore = leadScore;
  }

  if (websiteStatus) {
    where.websiteStatus = websiteStatus;
  }

  if (taxonomyCode) {
    where.taxonomyCode = taxonomyCode;
  }

  if (dateFrom || dateTo) {
    where.enumerationDate = {};
    if (dateFrom)
      (where.enumerationDate as Record<string, string>).gte = dateFrom;
    if (dateTo) (where.enumerationDate as Record<string, string>).lte = dateTo;
  }

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where: where as never,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.lead.count({ where: where as never }),
  ]);

  return NextResponse.json({
    leads,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
