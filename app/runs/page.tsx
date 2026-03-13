"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ScrapeRun {
  id: number;
  runDate: string;
  status: string;
  totalFound: number;
  newLeads: number;
  duplicates: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  lookbackDays: number;
  durationSeconds: number | null;
  errorMessage: string | null;
}

export default function RunsPage() {
  const [runs, setRuns] = useState<ScrapeRun[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRuns = useCallback(async () => {
    const res = await fetch(`/api/runs?page=${page}`);
    const data = await res.json();
    setRuns(data.runs);
    setTotalPages(data.totalPages);
  }, [page]);

  useEffect(() => {
    fetchRuns();
  }, [fetchRuns]);

  const formatDuration = (seconds: number | null) => {
    if (seconds == null) return "—";
    if (seconds < 60) return `${Math.round(seconds)}s`;
    return `${Math.floor(seconds / 60)}m ${Math.round(seconds % 60)}s`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-success/20 bg-success/5 text-success"
          >
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="gap-1 border-error/20 bg-error/5 text-error"
          >
            <XCircle className="h-3 w-3" />
            Failed
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="gap-1 border-warm-gold/20 bg-warm-gold/5 text-warm-gold"
          >
            <Loader2 className="h-3 w-3 animate-spin" />
            Running
          </Badge>
        );
    }
  };

  if (!runs) {
    return (
      <div className="space-y-3 animate-fade-in">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (runs.length === 0) {
    return (
      <div className="animate-fade-in py-16 text-center">
        <p className="font-heading text-lg text-charcoal">
          No pipeline runs yet
        </p>
        <p className="mt-1 text-sm text-taupe">
          Go to the Dashboard and click &ldquo;Run Now&rdquo; to start your first scrape.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 bg-soft-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-taupe/10 hover:bg-transparent">
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Run Date
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Total Found
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                New Leads
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Duplicates
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Hot
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Warm
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Cold
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Lookback
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Duration
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow
                key={run.id}
                className="border-taupe/5 transition-colors hover:bg-cream/30"
              >
                <TableCell className="font-mono-brand text-xs text-charcoal">
                  {new Date(run.runDate).toLocaleString()}
                </TableCell>
                <TableCell>{getStatusBadge(run.status)}</TableCell>
                <TableCell className="font-mono-brand text-sm text-charcoal">
                  {run.totalFound}
                </TableCell>
                <TableCell className="font-mono-brand text-sm font-medium text-success">
                  {run.newLeads}
                </TableCell>
                <TableCell className="font-mono-brand text-sm text-taupe">
                  {run.duplicates}
                </TableCell>
                <TableCell className="font-mono-brand text-sm text-success">
                  {run.hotLeads}
                </TableCell>
                <TableCell className="font-mono-brand text-sm text-warning">
                  {run.warmLeads}
                </TableCell>
                <TableCell className="font-mono-brand text-sm text-muted-brand">
                  {run.coldLeads}
                </TableCell>
                <TableCell className="font-mono-brand text-xs text-taupe">
                  {run.lookbackDays}d
                </TableCell>
                <TableCell className="font-mono-brand text-xs text-taupe">
                  {formatDuration(run.durationSeconds)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page <= 1}
            className="border-taupe/20 text-taupe"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-taupe">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
            className="border-taupe/20 text-taupe"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
