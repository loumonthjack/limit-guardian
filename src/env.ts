import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .union([
      z.literal("localhost"),
      z.literal("development"),
      z.literal("testing"),
      z.literal("production"),
    ])
    .default("localhost"),
  PORT: z.coerce.number().default(7123),
  QUEUE_PORT: z.coerce.number().default(7124),
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  GMAIL_USER: z.string().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
});

const env = envSchema.parse(process.env);

export default env;
