import { z } from 'zod';

const envSchema = z.object({
  INFURA_API_KEY: z.string(),
});

export const env: z.infer<typeof envSchema> = envSchema.parse({
  INFURA_API_KEY: import.meta.env.VITE_INFURA_API_KEY,
});
