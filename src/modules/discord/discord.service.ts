import { DiscordValidations, DiscordValidationsType } from "./discord.validation.ts";

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