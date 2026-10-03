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
    
  GITHUB_WEBHOOK_SECRET: z.string().min(1),
  DISCORD_WEBHOOK_SECRET: z.url(),
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