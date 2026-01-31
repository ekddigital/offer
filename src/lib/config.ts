import { db } from "@/lib/db";

// Default site configuration keys
export const CONFIG_KEYS = {
  WHATSAPP_LINK: "whatsapp_group_link",
  WHATSAPP_ENABLED: "whatsapp_enabled",
  SITE_NAME: "site_name",
  SUPPORT_EMAIL: "support_email",
  SUPPORT_PHONE: "support_phone",
} as const;

export type ConfigKey = (typeof CONFIG_KEYS)[keyof typeof CONFIG_KEYS];

// Get a single config value
export async function getConfig(key: ConfigKey): Promise<string | null> {
  const config = await db.siteConfig.findUnique({ where: { key } });
  return config?.value ?? null;
}

// Get multiple config values
export async function getConfigs(
  keys: ConfigKey[],
): Promise<Record<string, string | null>> {
  const configs = await db.siteConfig.findMany({
    where: { key: { in: keys } },
  });

  const result: Record<string, string | null> = {};
  for (const k of keys) {
    result[k] =
      configs.find(
        (c: { key: string; value: string; label: string | null }) =>
          c.key === k,
      )?.value ?? null;
  }
  return result;
}

// Set a config value (upsert)
export async function setConfig(
  key: ConfigKey,
  value: string,
  label?: string,
): Promise<void> {
  await db.siteConfig.upsert({
    where: { key },
    update: { value },
    create: { key, value, label },
  });
}

// Get all configs
export async function getAllConfigs() {
  return db.siteConfig.findMany({ orderBy: { key: "asc" } });
}
