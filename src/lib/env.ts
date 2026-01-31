import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().optional(),

  // Mail API (EKDSend)
  ANDOFFER_MAIL_API_KEY: z.string().min(1, "Mail API key is required"),
  ANDOFFER_DEFAULT_FROM: z
    .string()
    .email()
    .default("noreply@offer.andgroupco.com"),

  // Assets API
  ASSETS_API_KEY: z.string().optional(),
  ASSETS_API_SECRET: z.string().optional(),
  ASSETS_BASE_URL: z
    .string()
    .url()
    .default("https://www.assets.andgroupco.com"),

  // Auth
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().optional(),
  AUTH_SECRET: z.string().optional(),
  ANDOFFER_JWT_SECRET: z.string().optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export type AppEnv = z.infer<typeof envSchema>;

/** Validated environment variables - only runs on server */
function getEnv(): AppEnv {
  // Skip validation on client side
  if (typeof window !== "undefined") {
    return {} as AppEnv;
  }

  // During build time, if no env vars are loaded, return defaults
  const hasEnvVars = Object.keys(process.env).some(
    (key) =>
      key.startsWith("ANDOFFER_") ||
      ["DATABASE_URL", "NEXTAUTH_URL", "AUTH_SECRET"].includes(key),
  );

  if (!hasEnvVars && process.env.NODE_ENV !== "development") {
    console.warn(
      "⚠️ No environment variables detected during build. Using defaults.",
    );
    return {
      DATABASE_URL: undefined,
      ANDOFFER_MAIL_API_KEY: "ek_build_placeholder",
      ANDOFFER_DEFAULT_FROM: "noreply@offer.andgroupco.com",
      ASSETS_API_KEY: undefined,
      ASSETS_API_SECRET: undefined,
      ASSETS_BASE_URL: "https://www.assets.andgroupco.com",
      NEXTAUTH_URL: undefined,
      NEXTAUTH_SECRET: undefined,
      AUTH_SECRET: undefined,
      ANDOFFER_JWT_SECRET: undefined,
      STRIPE_SECRET_KEY: undefined,
      STRIPE_WEBHOOK_SECRET: undefined,
    };
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "❌ Invalid environment variables:",
      parsed.error.flatten().fieldErrors,
    );
    throw new Error(
      "Environment validation failed. Please check your .env file.",
    );
  }

  return parsed.data;
}

export const env = getEnv();
