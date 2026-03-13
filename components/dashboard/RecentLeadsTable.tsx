"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatDate,
  formatPhone,
  getScoreColor,
  getWebsiteStatusLabel,
  getWebsiteStatusColor,
} from "@/lib/utils";

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

export function RecentLeadsTable({ leads }: { leads: Lead[] | null }) {
  if (!leads) {
    return (
      <Card className="border-0 bg-soft-white shadow-sm">
        <div className="p-6">
          <h3 className="font-heading text-lg font-semibold text-charcoal">
            Recent Leads
          </h3>
        </div>
        <div className="space-y-3 px-6 pb-6">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (leads.length === 0) {
    return (
      <Card className="border-0 bg-soft-white shadow-sm">
        <div className="p-6">
          <h3 className="font-heading text-lg font-semibold text-charcoal">
            Recent Leads
          </h3>
        </div>
        <div className="px-6 pb-12 pt-6 text-center">
          <p className="text-sm text-taupe">
            No leads yet. Run a scrape to start building your pipeline.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border-0 bg-soft-white shadow-sm">
      <div className="p-6">
        <h3 className="font-heading text-lg font-semibold text-charcoal">
          Recent Leads
        </h3>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-taupe/10 hover:bg-transparent">
            <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
              Practice
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
              Contact
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
              City
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
              Specialty
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
              NPI Date
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
              Website
            </TableHead>
            <TableHead className="text-xs font-medium uppercase tracking-wider text-taupe">
              Score
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
                className="border-taupe/5 transition-colors hover:bg-cream/50"
              >
                <TableCell className="font-medium text-charcoal">
                  {lead.organizationName}
                </TableCell>
                <TableCell className="text-sm text-taupe">
                  <div>{contactName || "—"}</div>
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
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
