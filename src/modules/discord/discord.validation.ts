import { z } from "zod";

// Limits: https://discord.com/developers/docs/resources/message#embed-object-embed-limits
export const DiscordEmbed = z.object({
  title: z.string().max(256).optional(),
  description: z.string().max(4096).optional(),
  url: z.url().optional(),
  color: z.number().int().optional(),
  author: z.object({
    name: z.string().max(256),
    url: z.url().optional(),
    icon_url: z.url().optional(),
  }).optional(),
});

export const DiscordValidations = z.object({
  content: z.string().min(1).max(2000).optional(),
  embeds: z.array(DiscordEmbed).max(10).optional(),
});

export type DiscordEmbedType = z.infer<typeof DiscordEmbed>;
export type DiscordValidationsType = z.infer<typeof DiscordValidations>;
