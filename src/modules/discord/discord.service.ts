import { DiscordEmbedType, DiscordValidations, DiscordValidationsType } from "./discord.validation.ts";
import config from "../../utils/config.ts";

export async function SendDiscordMessage(URL: string, MESSAGE: DiscordValidationsType) {
    const payload = DiscordValidations.parse(MESSAGE);
    const response = await fetch(URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    })

    if(!response.ok) throw new Error(`Discord Webhook failed! (${response.status})`)
}

export async function SendDiscordEmbed(EMBED: DiscordEmbedType) {
    await SendDiscordMessage(config.DISCORD_WEBHOOK_SECRET, { embeds: [EMBED] });
}
