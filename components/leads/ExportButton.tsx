"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Download, FileSpreadsheet } from "lucide-react";

interface ExportButtonProps {
  selectedIds: number[];
  filters: {
    leadScore: string;
    websiteStatus: string;
    taxonomyCode: string;
  };
}

export function ExportButton({ selectedIds, filters }: ExportButtonProps) {
  const handleExport = (type: "selected" | "filtered" | "all" | "hot") => {
    const params = new URLSearchParams();

    if (type === "hot") {
      window.location.href = "/api/leads/export-hot";
      return;
    }

    if (type === "selected" && selectedIds.length > 0) {
      params.set("ids", selectedIds.join(","));
    } else if (type === "filtered") {
      if (filters.leadScore && filters.leadScore !== "all")
        params.set("leadScore", filters.leadScore);
      if (filters.websiteStatus && filters.websiteStatus !== "all")
        params.set("websiteStatus", filters.websiteStatus);
      if (filters.taxonomyCode && filters.taxonomyCode !== "all")
        params.set("taxonomyCode", filters.taxonomyCode);
    }

    window.location.href = `/api/leads/export?${params.toString()}`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border border-taupe/20 bg-soft-white px-3 py-1.5 text-sm text-taupe transition-colors hover:bg-cream hover:text-charcoal focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Download className="h-3.5 w-3.5" />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-taupe/20">
        {selectedIds.length > 0 && (
          <DropdownMenuItem onClick={() => handleExport("selected")}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Export Selected ({selectedIds.length})
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => handleExport("filtered")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Filtered
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("all")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export All
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("hot")}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Export Hot Leads (VA Format)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
