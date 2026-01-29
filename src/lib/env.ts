import "server-only";

import { z } from "zod";

const envSchema = z.object({
  EKDSEND_API_KEY: z.string().min(1, "EKDSEND_API_KEY is required"),
  EKDSEND_BASE_URL: z
    .string()
    .url()
    .default("https://es.ekddigital.com/api/v1"),
  EKDSEND_DEFAULT_FROM: z.string().email().optional(),

  ASSETS_API_KEY: z.string().min(1, "ASSETS_API_KEY is required"),
  ASSETS_BASE_URL: z
    .string()
    .url()
    .default("https://www.assets.andgroupco.com"),
  ASSETS_CLIENT_ID: z.string().default("andgroupco"),
  ASSETS_PROJECT_NAME: z.string().default("andoffer"),
});

export type AppEnv = z.infer<typeof envSchema>;

export const env = envSchema.parse({
  EKDSEND_API_KEY: process.env.EKDSEND_API_KEY,
  EKDSEND_BASE_URL: process.env.EKDSEND_BASE_URL,
  EKDSEND_DEFAULT_FROM: process.env.EKDSEND_DEFAULT_FROM,
  ASSETS_API_KEY: process.env.ASSETS_API_KEY,
  ASSETS_BASE_URL: process.env.ASSETS_BASE_URL,
  ASSETS_CLIENT_ID: process.env.ASSETS_CLIENT_ID,
  ASSETS_PROJECT_NAME: process.env.ASSETS_PROJECT_NAME,
});
