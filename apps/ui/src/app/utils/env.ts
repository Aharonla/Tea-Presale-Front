import { z } from 'zod';

const envSchema = z.object({
  API_URL: z.string()
});

export const env: z.infer<typeof envSchema> = envSchema.parse({
  API_URL: import.meta.env.VITE_PUBLIC_API_URL
});


