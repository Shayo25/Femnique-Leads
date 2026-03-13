"use client";

import { useEffect, useState, useCallback } from "react";
import { StatsRow } from "@/components/dashboard/StatsRow";
import { LeadScoreChart } from "@/components/dashboard/LeadScoreChart";
import { RecentLeadsTable } from "@/components/dashboard/RecentLeadsTable";
import { LastScrapeCard } from "@/components/dashboard/LastScrapeCard";
import { SpecialtyBreakdown } from "@/components/dashboard/SpecialtyBreakdown";

interface Stats {
  totalLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  unscoredLeads: number;
  newThisWeek: number;
  lastScrapeRun: {
    id: number;
    runDate: string;
    status: string;
    totalFound: number;
    newLeads: number;
    duplicates: number;
    durationSeconds: number | null;
  } | null;
  taxonomyBreakdown: { name: string; count: number }[];
}

interface Lead {
  id: number;
  npiNumber: string;
  organizationName: string;
  authorizedFirstName: string | null;
  authorizedLastName: string | null;
  phone: string | null;
  authorizedPhone: string | null;
  city: string | null;
  taxonomyDescription: string;
  enumerationDate: string;
  websiteStatus: string;
  leadScore: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [statsRes, leadsRes] = await Promise.all([
        fetch("/api/stats"),
        fetch("/api/leads?limit=20&sortBy=createdAt&sortOrder=desc"),
      ]);
      const statsData = await statsRes.json();
      const leadsData = await leadsRes.json();
      setStats(statsData);
      setLeads(leadsData.leads);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8 animate-fade-in">
      <StatsRow
        data={
          stats
            ? {
                totalLeads: stats.totalLeads,
                hotLeads: stats.hotLeads,
                warmLeads: stats.warmLeads,
                newThisWeek: stats.newThisWeek,
              }
            : null
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeadScoreChart
            data={
              stats
                ? {
                    hotLeads: stats.hotLeads,
                    warmLeads: stats.warmLeads,
                    coldLeads: stats.coldLeads,
                    unscoredLeads: stats.unscoredLeads,
                  }
                : null
            }
          />
        </div>
        <LastScrapeCard
          lastRun={stats?.lastScrapeRun ?? null}
          onRefresh={fetchData}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentLeadsTable leads={leads} />
        </div>
        <SpecialtyBreakdown data={stats?.taxonomyBreakdown ?? null} />
      </div>
    </div>
  );
}
