"use client";

import { useState } from "react";
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
import { LeadDetail } from "./LeadDetail";
import {
  formatDate,
  formatPhone,
  getScoreColor,
  getWebsiteStatusLabel,
  getWebsiteStatusColor,
} from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Eye,
} from "lucide-react";

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

interface LeadsTableProps {
  leads: Lead[] | null;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy: string;
  sortOrder: string;
  onSortChange: (field: string) => void;
  onRefresh: () => void;
  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;
}

export function LeadsTable({
  leads,
  total,
  page,
  totalPages,
  onPageChange,
  sortBy,
  sortOrder: _sortOrder,
  onSortChange,
  onRefresh,
  selectedIds,
  onSelectionChange,
}: LeadsTableProps) {
  void _sortOrder;
  const [detailLead, setDetailLead] = useState<Lead | null>(null);

  if (!leads) {
    return (
      <div className="space-y-3">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="font-heading text-lg text-charcoal">No leads found</p>
        <p className="mt-1 text-sm text-taupe">
          Try adjusting your filters or run a new scrape.
        </p>
      </div>
    );
  }

  const toggleSelect = (id: number) => {
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter((sid) => sid !== id)
        : [...selectedIds, id]
    );
  };

  const toggleAll = () => {
    if (selectedIds.length === leads.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(leads.map((l) => l.id));
    }
  };

  const SortHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableHead
      onClick={() => onSortChange(field)}
      className="cursor-pointer select-none text-xs font-medium uppercase tracking-wider text-taupe hover:text-charcoal"
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown
          className={`h-3 w-3 ${sortBy === field ? "text-warm-gold" : "text-taupe/40"}`}
        />
      </span>
    </TableHead>
  );

  return (
    <>
      <div className="rounded-xl border border-taupe/10 bg-soft-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-taupe/10 hover:bg-transparent">
              <TableHead className="w-10">
                <input
                  type="checkbox"
                  checked={
                    leads.length > 0 && selectedIds.length === leads.length
                  }
                  onChange={toggleAll}
                  className="rounded border-taupe/30 accent-warm-gold"
                />
              </TableHead>
              <SortHeader field="organizationName">Practice</SortHeader>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Contact
              </TableHead>
              <SortHeader field="city">City</SortHeader>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Specialty
              </TableHead>
              <SortHeader field="enumerationDate">NPI Date</SortHeader>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Days
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Website
              </TableHead>
              <SortHeader field="leadScore">Score</SortHeader>
              <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => {
              const contactName = [
                lead.authorizedFirstName,
                lead.authorizedLastName,
              ]
                .filter(Boolean)
                .join(" ");

              return (
                <TableRow
                  key={lead.id}
                  className="border-taupe/5 transition-colors hover:bg-cream/30"
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="rounded border-taupe/30 accent-warm-gold"
                    />
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate font-medium text-charcoal">
                    {lead.organizationName}
                  </TableCell>
                  <TableCell className="text-sm">
                    <div className="text-charcoal">
                      {contactName || "—"}
                    </div>
                    <div className="font-mono-brand text-xs text-muted-brand">
                      {formatPhone(lead.phone || lead.authorizedPhone)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-taupe">
                    {lead.city || "—"}
                  </TableCell>
                  <TableCell className="text-sm text-taupe">
                    {lead.taxonomyDescription}
                  </TableCell>
                  <TableCell className="font-mono-brand text-xs text-taupe">
                    {formatDate(lead.enumerationDate)}
                  </TableCell>
                  <TableCell className="font-mono-brand text-xs text-taupe">
                    {lead.daysSinceRegistration ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium ${getWebsiteStatusColor(lead.websiteStatus)}`}
                    >
                      {getWebsiteStatusLabel(lead.websiteStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-medium ${getScoreColor(lead.leadScore)}`}
                    >
                      {lead.leadScore}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDetailLead(lead)}
                      className="h-7 w-7 p-0 text-taupe hover:text-charcoal"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-taupe">
          Showing {(page - 1) * 25 + 1}–{Math.min(page * 25, total)} of{" "}
          {total} leads
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="border-taupe/20 text-taupe hover:text-charcoal"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-xs text-taupe">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="border-taupe/20 text-taupe hover:text-charcoal"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <LeadDetail
        lead={detailLead}
        open={!!detailLead}
        onClose={() => setDetailLead(null)}
        onUpdate={() => {
          setDetailLead(null);
          onRefresh();
        }}
      />
    </>
  );
}
