"use client";

import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { ExportButton } from "@/components/leads/ExportButton";
import { Globe, Loader2 } from "lucide-react";

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

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [leadScore, setLeadScore] = useState("all");
  const [websiteStatus, setWebsiteStatus] = useState("all");
  const [taxonomyCode, setTaxonomyCode] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [checkingWebsites, setCheckingWebsites] = useState(false);

  const fetchLeads = useCallback(async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      sortBy,
      sortOrder,
    });
    if (search) params.set("search", search);
    if (leadScore && leadScore !== "all") params.set("leadScore", leadScore);
    if (websiteStatus && websiteStatus !== "all")
      params.set("websiteStatus", websiteStatus);
    if (taxonomyCode && taxonomyCode !== "all")
      params.set("taxonomyCode", taxonomyCode);

    const res = await fetch(`/api/leads?${params.toString()}`);
    const data = await res.json();
    setLeads(data.leads);
    setTotal(data.total);
    setTotalPages(data.totalPages);
  }, [page, search, leadScore, websiteStatus, taxonomyCode, sortBy, sortOrder]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  useEffect(() => {
    setPage(1);
  }, [search, leadScore, websiteStatus, taxonomyCode]);

  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };

  const handleCheckWebsites = async () => {
    setCheckingWebsites(true);
    try {
      await fetch("/api/check-websites", { method: "POST" });
      fetchLeads();
    } catch (error) {
      console.error("Website check failed:", error);
    } finally {
      setCheckingWebsites(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="border-0 bg-soft-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <LeadFilters
            search={search}
            onSearchChange={setSearch}
            leadScore={leadScore}
            onLeadScoreChange={setLeadScore}
            websiteStatus={websiteStatus}
            onWebsiteStatusChange={setWebsiteStatus}
            taxonomyCode={taxonomyCode}
            onTaxonomyCodeChange={setTaxonomyCode}
          />
          <div className="flex gap-2 shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheckWebsites}
              disabled={checkingWebsites}
              className="gap-2 border-taupe/20 text-taupe hover:text-charcoal"
            >
              {checkingWebsites ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Globe className="h-3.5 w-3.5" />
              )}
              Check Websites
            </Button>
            <ExportButton
              selectedIds={selectedIds}
              filters={{ leadScore, websiteStatus, taxonomyCode }}
            />
          </div>
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
