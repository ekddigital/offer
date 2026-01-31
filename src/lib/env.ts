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

  // Check if we're in a build environment with no env vars (like Vercel without configured variables)
  const envKeys = Object.keys(process.env);
  const hasAndofferVars = envKeys.some((key) => key.startsWith("ANDOFFER_"));
  const hasRequiredVars = Boolean(
    process.env.ANDOFFER_MAIL_API_KEY || process.env.DATABASE_URL,
  );

  // If we're not in development and have no environment variables, use build defaults
  if (!hasAndofferVars && !hasRequiredVars) {
    console.warn(
      "⚠️ No environment variables detected during build. Using safe defaults.",
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

  // Try to parse the environment variables
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    // If parsing fails but we're in a build environment, use safe defaults
    if (process.env.VERCEL || process.env.CI || !hasRequiredVars) {
      console.warn(
        "⚠️ Environment validation failed during build. Using safe defaults.",
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
