"use client";

import { Card } from "@/components/ui/card";

interface ChartData {
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  unscoredLeads: number;
}

export function LeadScoreChart({ data }: { data: ChartData | null }) {
  if (!data) return null;

  const total =
    data.hotLeads + data.warmLeads + data.coldLeads + data.unscoredLeads;
  if (total === 0) {
    return (
      <Card className="border-0 bg-soft-white p-6 shadow-sm">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          Lead Score Distribution
        </h3>
        <p className="mt-6 text-center text-sm text-taupe">
          No leads scored yet
        </p>
      </Card>
    );
  }

  const segments = [
    {
      label: "Hot",
      value: data.hotLeads,
      color: "bg-success",
      textColor: "text-success",
    },
    {
      label: "Warm",
      value: data.warmLeads,
      color: "bg-warning",
      textColor: "text-warning",
    },
    {
      label: "Cold",
      value: data.coldLeads,
      color: "bg-muted-brand",
      textColor: "text-muted-brand",
    },
    {
      label: "Unscored",
      value: data.unscoredLeads,
      color: "bg-taupe/30",
      textColor: "text-taupe",
    },
  ].filter((s) => s.value > 0);

  return (
    <Card className="border-0 bg-soft-white p-6 shadow-sm">
      <h3 className="font-heading text-lg font-semibold text-charcoal">
        Lead Score Distribution
      </h3>

      <div className="mt-6 flex h-3 overflow-hidden rounded-full bg-cream">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`${seg.color} transition-all duration-500`}
            style={{ width: `${(seg.value / total) * 100}%` }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-4">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-2">
            <div className={`h-2.5 w-2.5 rounded-full ${seg.color}`} />
            <span className="text-xs text-taupe">{seg.label}</span>
            <span className={`text-xs font-medium ${seg.textColor}`}>
              {seg.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
