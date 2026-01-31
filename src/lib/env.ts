import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  // Mail API (EKDSend)
  ANDOFFER_MAIL_API_KEY: z.string().optional(),
  ANDOFFER_DEFAULT_FROM: z
    .string()
    .email()
    .optional()
    .default("noreply@offer.andgroupco.com"),

  // Assets API
  ASSETS_API_KEY: z.string().min(1, "ASSETS_API_KEY is required"),
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

// Lazy initialization to avoid build-time validation errors
// Environment variables are only validated at runtime when accessed
let _env: AppEnv | undefined;

export const env: AppEnv = new Proxy({} as AppEnv, {
  get(_, prop: string) {
    if (!_env) {
      _env = envSchema.parse({
        DATABASE_URL: process.env.DATABASE_URL,
        ANDOFFER_MAIL_API_KEY: process.env.ANDOFFER_MAIL_API_KEY,
        ANDOFFER_DEFAULT_FROM: process.env.ANDOFFER_DEFAULT_FROM || undefined,
        ASSETS_API_KEY: process.env.ASSETS_API_KEY,
        ASSETS_API_SECRET: process.env.ASSETS_API_SECRET,
        ASSETS_BASE_URL: process.env.ASSETS_BASE_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        AUTH_SECRET: process.env.AUTH_SECRET,
        ANDOFFER_JWT_SECRET: process.env.ANDOFFER_JWT_SECRET,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      });
    }
    return _env[prop as keyof AppEnv];
  },
});
