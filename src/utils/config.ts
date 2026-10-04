import { z } from "zod";
import { config } from "dotenv";

config();

const schema = z.object({
  NODE_ENV: z
    .enum(["development", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .max(65535)
    .default(3000),

  LOGGER: z.stringbool().default(true),

  GITHUB_WEBHOOK_SECRET: z.string().min(1),
  COOLIFY_WEBHOOK_SECRET: z.string().min(32), // part of the URL, must be unguessable
  DISCORD_WEBHOOK_SECRET: z.url(),

  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30),
  RATE_LIMIT_WINDOW: z.coerce.number().int().positive().default(60000), // ms
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error(
    "Invalid env variables:",
    z.prettifyError(parsed.error)
  );

  process.exit(1);
}

export default parsed.data;
