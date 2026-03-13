"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Play, CheckCircle2, XCircle } from "lucide-react";

interface ScrapeRun {
  id: number;
  runDate: string;
  status: string;
  totalFound: number;
  newLeads: number;
  duplicates: number;
  durationSeconds: number | null;
}

export function LastScrapeCard({
  lastRun,
  onRefresh,
}: {
  lastRun: ScrapeRun | null;
  onRefresh: () => void;
}) {
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<string | null>(null);

  const handleRunScrape = async () => {
    setIsRunning(true);
    setRunResult(null);
    try {
      const res = await fetch("/api/scrape", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setRunResult(
          `Found ${data.newLeads} new leads (${data.totalFound} total, ${data.duplicates} duplicates)`
        );
        onRefresh();
      } else {
        setRunResult(data.error || "Scrape failed");
      }
    } catch {
      setRunResult("Network error — check your connection");
    } finally {
      setIsRunning(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (seconds == null) return "—";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  };

  return (
    <Card className="border-0 bg-soft-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          Last Scrape
        </h3>
        <Button
          onClick={handleRunScrape}
          disabled={isRunning}
          className="gap-2 bg-warm-gold text-white hover:bg-warm-gold/90"
          size="sm"
        >
          {isRunning ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Running…
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              Run Now
            </>
          )}
        </Button>
      </div>

      {lastRun ? (
        <div className="mt-4 space-y-3">
          <div className="flex items-center gap-2">
            {lastRun.status === "completed" ? (
              <CheckCircle2 className="h-4 w-4 text-success" />
            ) : lastRun.status === "failed" ? (
              <XCircle className="h-4 w-4 text-error" />
            ) : (
              <Loader2 className="h-4 w-4 animate-spin text-warm-gold" />
            )}
            <span className="text-sm capitalize text-charcoal">
              {lastRun.status}
            </span>
            <span className="text-xs text-taupe">
              {new Date(lastRun.runDate).toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-cream p-3 text-center">
              <p className="font-heading text-xl font-semibold text-charcoal">
                {lastRun.totalFound}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-taupe">
                Found
              </p>
            </div>
            <div className="rounded-lg bg-cream p-3 text-center">
              <p className="font-heading text-xl font-semibold text-success">
                {lastRun.newLeads}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-taupe">
                New
              </p>
            </div>
            <div className="rounded-lg bg-cream p-3 text-center">
              <p className="font-heading text-xl font-semibold text-taupe">
                {formatDuration(lastRun.durationSeconds)}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-taupe">
                Duration
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-taupe">
          No scrape runs yet. Click &ldquo;Run Now&rdquo; to start.
        </p>
      )}

      {runResult && (
        <div className="mt-3 rounded-lg bg-cream p-3 text-xs text-charcoal animate-fade-in">
          {runResult}
        </div>
      )}
    </Card>
  );
}
