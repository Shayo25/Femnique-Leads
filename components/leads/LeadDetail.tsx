"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  formatPhone,
  formatDate,
  getScoreColor,
  getWebsiteStatusLabel,
  getWebsiteStatusColor,
} from "@/lib/utils";
import { Save, ExternalLink } from "lucide-react";

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

export function LeadDetail({
  lead,
  open,
  onClose,
  onUpdate,
}: {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [notes, setNotes] = useState(lead?.notes || "");
  const [saving, setSaving] = useState(false);

  if (!lead) return null;

  const contactName = [lead.authorizedFirstName, lead.authorizedLastName]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [
    lead.addressLine1,
    lead.addressLine2,
    lead.city,
    `${lead.state} ${lead.zip || ""}`,
  ]
    .filter(Boolean)
    .join(", ");

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      await fetch(`/api/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      onUpdate();
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg border-taupe/20 bg-soft-white">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl text-charcoal">
            {lead.organizationName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className={`${getScoreColor(lead.leadScore)}`}
            >
              {lead.leadScore}
            </Badge>
            <Badge
              variant="outline"
              className={`${getWebsiteStatusColor(lead.websiteStatus)}`}
            >
              {getWebsiteStatusLabel(lead.websiteStatus)}
            </Badge>
            {lead.ghlPushed && (
              <Badge
                variant="outline"
                className="border-warm-gold/30 bg-warm-gold/10 text-warm-gold"
              >
                Pushed to GHL
              </Badge>
            )}
          </div>

          <Separator className="bg-taupe/10" />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase tracking-wider text-taupe">
                NPI Number
              </p>
              <p className="mt-1 font-mono-brand text-charcoal">
                {lead.npiNumber}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-taupe">
                Registered
              </p>
              <p className="mt-1 text-charcoal">
                {formatDate(lead.enumerationDate)}
                {lead.daysSinceRegistration != null && (
                  <span className="ml-1 text-xs text-taupe">
                    ({lead.daysSinceRegistration}d ago)
                  </span>
                )}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-taupe">
                Contact
              </p>
              <p className="mt-1 text-charcoal">{contactName || "—"}</p>
              {lead.authorizedTitle && (
                <p className="text-xs text-taupe">{lead.authorizedTitle}</p>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-taupe">
                Phone
              </p>
              <p className="mt-1 font-mono-brand text-charcoal">
                {formatPhone(lead.phone || lead.authorizedPhone) || "—"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs uppercase tracking-wider text-taupe">
                Address
              </p>
              <p className="mt-1 text-charcoal">{fullAddress || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-taupe">
                Specialty
              </p>
              <p className="mt-1 text-charcoal">{lead.taxonomyDescription}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-taupe">
                Taxonomy Code
              </p>
              <p className="mt-1 font-mono-brand text-charcoal">
                {lead.taxonomyCode}
              </p>
            </div>
          </div>

          {lead.websiteUrl && (
            <>
              <Separator className="bg-taupe/10" />
              <div>
                <p className="text-xs uppercase tracking-wider text-taupe">
                  Website
                </p>
                <a
                  href={lead.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-warm-gold hover:underline"
                >
                  {lead.websiteUrl}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </>
          )}

          <Separator className="bg-taupe/10" />

          <div>
            <Label className="text-xs uppercase tracking-wider text-taupe">
              Notes
            </Label>
            <Input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about this lead…"
              className="mt-1 border-taupe/20 bg-cream text-sm"
            />
            <Button
              onClick={handleSaveNotes}
              disabled={saving}
              size="sm"
              className="mt-2 gap-1.5 bg-warm-gold text-white hover:bg-warm-gold/90"
            >
              <Save className="h-3 w-3" />
              Save Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
