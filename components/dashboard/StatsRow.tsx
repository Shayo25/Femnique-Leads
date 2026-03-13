"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Flame, Sun, Sparkles } from "lucide-react";

interface StatsData {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  newThisWeek: number;
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden border-0 bg-soft-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-taupe">
            {label}
          </p>
          <p className="mt-2 font-heading text-4xl font-semibold text-charcoal">
            {value.toLocaleString()}
          </p>
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function StatsRow({ data }: { data: StatsData | null }) {
  if (!data) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-0 bg-soft-white p-6 shadow-sm">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-10 w-20" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Leads"
        value={data.totalLeads}
        icon={Users}
        color="bg-cream text-charcoal"
      />
      <StatCard
        label="Hot Leads"
        value={data.hotLeads}
        icon={Flame}
        color="bg-success/10 text-success"
      />
      <StatCard
        label="Warm Leads"
        value={data.warmLeads}
        icon={Sun}
        color="bg-warning/10 text-warning"
      />
      <StatCard
        label="New This Week"
        value={data.newThisWeek}
        icon={Sparkles}
        color="bg-warm-gold/10 text-warm-gold"
      />
    </div>
  );
}
