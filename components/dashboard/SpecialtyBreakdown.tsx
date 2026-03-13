"use client";

import { Card } from "@/components/ui/card";

interface TaxonomyItem {
  name: string;
  count: number;
}

export function SpecialtyBreakdown({ data }: { data: TaxonomyItem[] | null }) {
  if (!data || data.length === 0) {
    return (
      <Card className="border-0 bg-soft-white p-6 shadow-sm">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          Leads by Specialty
        </h3>
        <p className="mt-6 text-center text-sm text-taupe">
          No specialty data available
        </p>
      </Card>
    );
  }

  const max = Math.max(...data.map((d) => d.count));

  return (
    <Card className="border-0 bg-soft-white p-6 shadow-sm">
      <h3 className="font-heading text-lg font-semibold text-charcoal">
        Leads by Specialty
      </h3>

      <div className="mt-5 space-y-3">
        {data.map((item) => (
          <div key={item.name} className="group">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-taupe group-hover:text-charcoal transition-colors">
                {item.name}
              </span>
              <span className="font-mono-brand text-xs font-medium text-charcoal">
                {item.count}
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream">
              <div
                className="h-full rounded-full bg-warm-gold/60 transition-all duration-500"
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
