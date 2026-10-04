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
    if (payload.event !== "deployment_success" && payload.event !== "deployment_failed") return;

    await SendDiscordEmbed(deploymentEmbed(payload));
}

function deploymentEmbed(payload: CoolifyEvent): DiscordEmbedType {
    const status = payload.success ? "success" : "failure";
    const name = payload.application_name ?? "coolify";
    const environment = payload.environment ? ` on ${payload.environment}` : "";

    return {
        title: `[${name}] Deployment ${status}${environment}`,
        url: payload.deployment_url && URL.canParse(payload.deployment_url) ? payload.deployment_url : undefined,
        color: payload.success ? COLORS.success : COLORS.failure,
    };
}
