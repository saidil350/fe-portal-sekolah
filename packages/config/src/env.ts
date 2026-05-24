import { z } from 'zod';

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:3001/api/v1'),
  NEXT_PUBLIC_WS_URL: z.string().url().default('http://localhost:3001'),
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_AUTH_COOKIE_NAME: z.string().default('portal_session'),
});

export type Env = z.infer<typeof envSchema>;

export function parseEnv(processEnv: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(processEnv);
  
  if (!result.success) {
    // eslint-disable-next-line no-console
    console.error('❌ Invalid environment variables:', result.error.format());
    throw new Error('Invalid environment variables');
  }
  
  return result.data;
}
