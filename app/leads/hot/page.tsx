"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { Download, Flame } from "lucide-react";

interface Lead {
  id: number;
  npiNumber: string;
  organizationName: string;
  authorizedFirstName: string | null;
  authorizedLastName: string | null;
  authorizedTitle: string | null;
  authorizedPhone: string | null;
  phone: string | null;
  fax: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string;
  zip: string | null;
  taxonomyCode: string;
  taxonomyDescription: string;
  enumerationDate: string;
  daysSinceRegistration: number | null;
  websiteStatus: string;
  websiteUrl: string | null;
  websiteDetails: string | null;
  leadScore: string;
  ghlPushed: boolean;
  notes: string | null;
  createdAt: string;
}

export default function HotLeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      leadScore: "Hot",
      sortBy,
      sortOrder,
    });

    const res = await fetch(`/api/leads?${params.toString()}`);
    const data = await res.json();
    setLeads(data.leads);
    setTotal(data.total);
    setTotalPages(data.totalPages);
  }, [page, sortBy, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 bg-soft-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
              <Flame className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold text-charcoal">
                {total} Hot Leads
              </p>
              <p className="text-xs text-taupe">
                New practices without websites — ready for outreach
              </p>
            </div>
          </div>
          <Button
            onClick={() => {
              window.location.href = "/api/leads/export-hot";
            }}
            className="gap-2 bg-warm-gold text-white hover:bg-warm-gold/90"
            size="sm"
          >
            <Download className="h-3.5 w-3.5" />
            Export for VA
          </Button>
        </div>
      </Card>

      <LeadsTable
        leads={leads}
        total={total}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        onRefresh={fetchLeads}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}
