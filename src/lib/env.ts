import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().optional(),

  // Mail API (EKDSend)
  ANDOFFER_MAIL_API_KEY: z.string().optional(),
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

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.warn(
      "⚠️ Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    // Return defaults instead of throwing
    return envSchema.parse({});
  }

  return parsed.data;
}

export const env = getEnv();
