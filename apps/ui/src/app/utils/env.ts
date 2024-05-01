import { z } from 'zod';

const envSchema = z.object({
  INFURA_RPC_URL: z.string(),
});

export const env: z.infer<typeof envSchema> = envSchema.parse({
  INFURA_RPC_URL: import.meta.env.VITE_INFURA_RPC_URL,
});
