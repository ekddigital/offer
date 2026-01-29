"use client";

import { useEffect, useState, useTransition } from "react";

type ConfigItem = {
  key: string;
  value: string;
  label?: string;
};

const DEFAULT_CONFIGS: ConfigItem[] = [
  { key: "whatsapp_group_link", value: "", label: "WhatsApp Group Link" },
  { key: "whatsapp_enabled", value: "true", label: "WhatsApp Button Enabled" },
  { key: "site_name", value: "ANDOffer", label: "Site Name" },
  { key: "support_email", value: "", label: "Support Email" },
  { key: "support_phone", value: "", label: "Support Phone" },
];

export default function SettingsPage() {
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: ConfigItem[]) => {
        // Merge with defaults
        const merged = DEFAULT_CONFIGS.map((def) => {
          const existing = data.find((d) => d.key === def.key);
          return existing ?? def;
        });
        setConfigs(merged);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateValue = (key: string, value: string) => {
    setConfigs((prev) =>
      prev.map((c) => (c.key === key ? { ...c, value } : c)),
    );
    setSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configs),
      });
      if (res.ok) setSaved(true);
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-secondary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Site Settings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage WhatsApp, contact info, and site-wide configurations
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-lg bg-brand-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-secondary-dark disabled:opacity-50"
        >
          {isPending ? "Saving..." : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {/* WhatsApp Section */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-[#25D366]"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">WhatsApp Integration</h2>
            <p className="text-sm text-muted-foreground">
              Configure the floating WhatsApp button for customer contact
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              WhatsApp Group Invite Link
            </label>
            <input
              type="url"
              placeholder="https://chat.whatsapp.com/..."
              value={
                configs.find((c) => c.key === "whatsapp_group_link")?.value ??
                ""
              }
              onChange={(e) =>
                updateValue("whatsapp_group_link", e.target.value)
              }
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              Get this from WhatsApp → Group Settings → Invite via link
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={
                configs.find((c) => c.key === "whatsapp_enabled")?.value ===
                "true"
              }
              onClick={() => {
                const current =
                  configs.find((c) => c.key === "whatsapp_enabled")?.value ===
                  "true";
                updateValue("whatsapp_enabled", current ? "false" : "true");
              }}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                configs.find((c) => c.key === "whatsapp_enabled")?.value ===
                "true"
                  ? "bg-[#25D366]"
                  : "bg-muted"
              }`}
            >
              <span
                className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                  configs.find((c) => c.key === "whatsapp_enabled")?.value ===
                  "true"
                    ? "translate-x-5"
                    : "translate-x-0"
                }`}
              />
            </button>
            <span className="text-sm font-medium">Show WhatsApp Button</span>
          </div>
        </div>
      </section>

      {/* Contact & Branding */}
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-secondary/10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 text-brand-secondary"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold">General Settings</h2>
            <p className="text-sm text-muted-foreground">
              Site name and contact information
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Site Name
            </label>
            <input
              type="text"
              placeholder="ANDOffer"
              value={configs.find((c) => c.key === "site_name")?.value ?? ""}
              onChange={(e) => updateValue("site_name", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Support Email
            </label>
            <input
              type="email"
              placeholder="support@offer.andgroupco.com"
              value={
                configs.find((c) => c.key === "support_email")?.value ?? ""
              }
              onChange={(e) => updateValue("support_email", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">
              Support Phone
            </label>
            <input
              type="tel"
              placeholder="+1 234 567 8900"
              value={
                configs.find((c) => c.key === "support_phone")?.value ?? ""
              }
              onChange={(e) => updateValue("support_phone", e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm transition focus:border-brand-secondary focus:outline-none focus:ring-2 focus:ring-brand-secondary/20"
            />
          </div>
        </div>
      </section>

      {/* Save indicator */}
      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-brand-success/10 px-4 py-3 text-sm text-brand-success">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Settings saved successfully
        </div>
      )}
    </div>
  );
}
