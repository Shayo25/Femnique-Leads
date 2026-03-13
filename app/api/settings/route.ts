import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { updateScheduler } from "@/lib/scheduler";

export async function GET() {
  const settings = await prisma.setting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return NextResponse.json({
    lookbackDays: settingsMap["lookbackDays"] || "30",
    targetState: settingsMap["targetState"] || "TX",
    ghlWebhookUrl: settingsMap["ghlWebhookUrl"] || "",
    autoSchedule: settingsMap["autoSchedule"] || "false",
    autoScheduleTime: settingsMap["autoScheduleTime"] || "06:00",
  });
}

export async function PUT(request: Request) {
  const body = await request.json();

  const allowedKeys = [
    "lookbackDays",
    "targetState",
    "ghlWebhookUrl",
    "autoSchedule",
    "autoScheduleTime",
  ];

  for (const key of allowedKeys) {
    if (key in body) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(body[key]) },
        create: { key, value: String(body[key]) },
      });
    }
  }

  if ("autoSchedule" in body || "autoScheduleTime" in body) {
    try {
      await updateScheduler();
    } catch (e) {
      console.error("Failed to update scheduler:", e);
    }
  }

  const settings = await prisma.setting.findMany();
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  return NextResponse.json({
    lookbackDays: settingsMap["lookbackDays"] || "30",
    targetState: settingsMap["targetState"] || "TX",
    ghlWebhookUrl: settingsMap["ghlWebhookUrl"] || "",
    autoSchedule: settingsMap["autoSchedule"] || "false",
    autoScheduleTime: settingsMap["autoScheduleTime"] || "06:00",
  });
}
