import cron, { ScheduledTask } from "node-cron";
import { prisma } from "@/lib/db";

let scheduledTask: ScheduledTask | null = null;

async function runScheduledScrape() {
  console.log(`[Scheduler] Starting scheduled scrape at ${new Date().toISOString()}`);
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/scrape`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const result = await response.json();
    console.log("[Scheduler] Scrape completed:", result);

    const checkResponse = await fetch(`${baseUrl}/api/check-websites`, {
      method: "POST",
    });
    const checkResult = await checkResponse.json();
    console.log("[Scheduler] Website checks completed:", checkResult);
  } catch (error) {
    console.error("[Scheduler] Scheduled scrape failed:", error);
  }
}

export async function initScheduler() {
  try {
    const settings = await prisma.setting.findMany();
    const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

    const autoSchedule = settingsMap["autoSchedule"] === "true";
    const scheduleTime = settingsMap["autoScheduleTime"] || "06:00";

    if (scheduledTask) {
      scheduledTask.stop();
      scheduledTask = null;
    }

    if (autoSchedule) {
      const [hours, minutes] = scheduleTime.split(":");
      const cronExpression = `${minutes} ${hours} * * *`;

      if (cron.validate(cronExpression)) {
        scheduledTask = cron.schedule(cronExpression, runScheduledScrape, {
          timezone: "America/Chicago",
        });
        console.log(
          `[Scheduler] Scheduled daily scrape at ${scheduleTime} CT (cron: ${cronExpression})`
        );
      } else {
        console.error(`[Scheduler] Invalid cron expression: ${cronExpression}`);
      }
    } else {
      console.log("[Scheduler] Auto-scheduling is disabled");
    }
  } catch (error) {
    console.error("[Scheduler] Failed to initialize scheduler:", error);
  }
}

export async function updateScheduler() {
  await initScheduler();
}
