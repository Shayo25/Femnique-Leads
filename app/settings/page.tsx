"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TAXONOMY_CODES } from "@/lib/config";
import { Save, Loader2, CheckCircle2 } from "lucide-react";

interface Settings {
  lookbackDays: string;
  targetState: string;
  ghlWebhookUrl: string;
  autoSchedule: string;
  autoScheduleTime: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>({
    lookbackDays: "30",
    targetState: "TX",
    ghlWebhookUrl: "",
    autoSchedule: "false",
    autoScheduleTime: "06:00",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      setSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8 animate-fade-in">
      <Card className="border-0 bg-soft-white p-8 shadow-sm">
        <h2 className="font-heading text-xl font-semibold text-charcoal">
          Pipeline Configuration
        </h2>
        <p className="mt-1 text-sm text-taupe">
          Adjust how the NPI scraper discovers and scores leads.
        </p>

        <Separator className="my-6 bg-taupe/10" />

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <Label className="text-xs uppercase tracking-wider text-taupe">
                Lookback Window (Days)
              </Label>
              <Input
                type="number"
                value={settings.lookbackDays}
                onChange={(e) =>
                  setSettings({ ...settings, lookbackDays: e.target.value })
                }
                className="mt-1.5 border-taupe/20 bg-cream text-sm"
                min="1"
                max="365"
              />
              <p className="mt-1 text-xs text-muted-brand">
                How far back to search for new NPI registrations
              </p>
            </div>

            <div>
              <Label className="text-xs uppercase tracking-wider text-taupe">
                Target State
              </Label>
              <Input
                type="text"
                value={settings.targetState}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    targetState: e.target.value.toUpperCase(),
                  })
                }
                className="mt-1.5 border-taupe/20 bg-cream text-sm"
                maxLength={2}
              />
              <p className="mt-1 text-xs text-muted-brand">
                Two-letter state code (e.g., TX)
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-0 bg-soft-white p-8 shadow-sm">
        <h2 className="font-heading text-xl font-semibold text-charcoal">
          Scheduling
        </h2>
        <p className="mt-1 text-sm text-taupe">
          Automate daily pipeline runs.
        </p>

        <Separator className="my-6 bg-taupe/10" />

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-sm font-medium text-charcoal">
                Auto-Schedule Daily Runs
              </Label>
              <p className="text-xs text-muted-brand">
                Automatically scrape for new leads every day
              </p>
            </div>
            <Switch
              checked={settings.autoSchedule === "true"}
              onCheckedChange={(checked) =>
                setSettings({
                  ...settings,
                  autoSchedule: checked ? "true" : "false",
                })
              }
            />
          </div>

          {settings.autoSchedule === "true" && (
            <div className="animate-fade-in">
              <Label className="text-xs uppercase tracking-wider text-taupe">
                Schedule Time
              </Label>
              <Input
                type="time"
                value={settings.autoScheduleTime}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    autoScheduleTime: e.target.value,
                  })
                }
                className="mt-1.5 w-40 border-taupe/20 bg-cream text-sm"
              />
            </div>
          )}
        </div>
      </Card>

      <Card className="border-0 bg-soft-white p-8 shadow-sm">
        <h2 className="font-heading text-xl font-semibold text-charcoal">
          GHL Integration
        </h2>
        <Badge
          variant="outline"
          className="ml-2 border-warm-gold/30 bg-warm-gold/10 text-[10px] text-warm-gold"
        >
          Phase 2
        </Badge>
        <p className="mt-1 text-sm text-taupe">
          Configure the GoHighLevel webhook for lead push.
        </p>

        <Separator className="my-6 bg-taupe/10" />

        <div>
          <Label className="text-xs uppercase tracking-wider text-taupe">
            GHL Webhook URL
          </Label>
          <Input
            type="url"
            value={settings.ghlWebhookUrl}
            onChange={(e) =>
              setSettings({ ...settings, ghlWebhookUrl: e.target.value })
            }
            placeholder="https://services.leadconnectorhq.com/hooks/..."
            className="mt-1.5 border-taupe/20 bg-cream text-sm"
          />
          <p className="mt-1 text-xs text-muted-brand">
            Leads will be pushed to this webhook when triggered
          </p>
        </div>
      </Card>

      <Card className="border-0 bg-soft-white p-8 shadow-sm">
        <h2 className="font-heading text-xl font-semibold text-charcoal">
          Target Taxonomy Codes
        </h2>
        <p className="mt-1 text-sm text-taupe">
          Wellness and aesthetics niches targeted by the pipeline.
        </p>

        <Separator className="my-6 bg-taupe/10" />

        <div className="space-y-2">
          {TAXONOMY_CODES.map((t) => (
            <div
              key={t.code}
              className="flex items-center justify-between rounded-lg bg-cream px-4 py-3"
            >
              <span className="text-sm text-charcoal">{t.description}</span>
              <span className="font-mono-brand text-xs text-taupe">
                {t.code}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex items-center justify-end gap-3 pb-8">
        {saved && (
          <span className="flex items-center gap-1 text-sm text-success animate-fade-in">
            <CheckCircle2 className="h-4 w-4" />
            Settings saved
          </span>
        )}
        <Button
          onClick={handleSave}
          disabled={saving}
          className="gap-2 bg-warm-gold text-white hover:bg-warm-gold/90"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>
    </div>
  );
}
