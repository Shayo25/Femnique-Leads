"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TAXONOMY_CODES } from "@/lib/config";
import { Search } from "lucide-react";

interface FiltersProps {
  search: string;
  onSearchChange: (val: string) => void;
  leadScore: string;
  onLeadScoreChange: (val: string) => void;
  websiteStatus: string;
  onWebsiteStatusChange: (val: string) => void;
  taxonomyCode: string;
  onTaxonomyCodeChange: (val: string) => void;
}

export function LeadFilters({
  search,
  onSearchChange,
  leadScore,
  onLeadScoreChange,
  websiteStatus,
  onWebsiteStatusChange,
  taxonomyCode,
  onTaxonomyCodeChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-taupe" />
        <Input
          placeholder="Search practice, city, or contact…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-taupe/20 bg-soft-white pl-10 text-sm focus-visible:ring-warm-gold"
        />
      </div>

      <Select
        value={leadScore}
        onValueChange={(val) => onLeadScoreChange(val ?? "all")}
      >
        <SelectTrigger className="w-[140px] border-taupe/20 bg-soft-white text-sm">
          <SelectValue placeholder="All Scores" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Scores</SelectItem>
          <SelectItem value="Hot">Hot</SelectItem>
          <SelectItem value="Warm">Warm</SelectItem>
          <SelectItem value="Cold">Cold</SelectItem>
          <SelectItem value="Unscored">Unscored</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={websiteStatus}
        onValueChange={(val) => onWebsiteStatusChange(val ?? "all")}
      >
        <SelectTrigger className="w-[160px] border-taupe/20 bg-soft-white text-sm">
          <SelectValue placeholder="Website Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="NO_WEBSITE">No Website</SelectItem>
          <SelectItem value="TEMPLATE_SITE">Template Site</SelectItem>
          <SelectItem value="HAS_WEBSITE">Has Website</SelectItem>
          <SelectItem value="UNCHECKED">Unchecked</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={taxonomyCode}
        onValueChange={(val) => onTaxonomyCodeChange(val ?? "all")}
      >
        <SelectTrigger className="w-[200px] border-taupe/20 bg-soft-white text-sm">
          <SelectValue placeholder="All Specialties" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Specialties</SelectItem>
          {TAXONOMY_CODES.map((t) => (
            <SelectItem key={t.code} value={t.code}>
              {t.description}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
