import { CoolifyEvent } from "./coolify.validation.ts";
import { SendDiscordEmbed } from "../discord/discord.service.ts";
import { DiscordEmbedType } from "../discord/discord.validation.ts";
import { safeEqual } from "../../core/funcs/signature.ts";
import { COLORS } from "../../interface/discord.interface.ts";
import config from "../../utils/config.ts";

export function verifyCoolifyToken(token: string): boolean {
    return safeEqual(config.COOLIFY_WEBHOOK_SECRET, token);
}

export async function handleCoolify(payload: CoolifyEvent) {
    let embed: DiscordEmbedType | null = null;

    switch (payload.event) {
        case "deployment_success":
        case "deployment_failed": embed = deploymentEmbed(payload); break;
        case "test": embed = testEmbed(payload); break;
    }

    if (embed) await SendDiscordEmbed(embed);
}

function testEmbed(payload: CoolifyEvent): DiscordEmbedType {
    return {
        title: `[coolify] ${payload.message}`,
        color: COLORS.info,
    };
}

function deploymentEmbed(payload: CoolifyEvent): DiscordEmbedType {
    const status = payload.success ? "success" : "failure";
    const name = payload.application_name ?? "coolify";
    const environment = payload.environment ? ` on ${payload.environment}` : "";

    return {
        title: `[${name}] Deployment ${status}${environment}`,
        color: payload.success ? COLORS.success : COLORS.failure,
    };
}
