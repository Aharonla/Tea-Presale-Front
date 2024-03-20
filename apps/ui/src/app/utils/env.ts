import { z } from "zod";

const envSchema = z.object({
  API_URL: z.string(),
  WALLET_CONNECT_PROJECT_ID: z.string(),
});

export const env: z.infer<typeof envSchema> = envSchema.parse({
  API_URL: import.meta.env.VITE_PUBLIC_API_URL,
  WALLET_CONNECT_PROJECT_ID: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
});
