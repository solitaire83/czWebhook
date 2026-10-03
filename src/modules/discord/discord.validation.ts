import { z } from "zod";

export const DiscordValidations = z.object({
  content: z.string().min(1).max(2000),
});

export type DiscordValidationsType = z.infer<typeof DiscordValidations>;