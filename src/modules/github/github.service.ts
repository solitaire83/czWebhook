import { GithubCheckRun, GithubCheckSuite, GithubCreate, GithubPush, GithubRelease, Sender } from "./github.validation.ts";
import { SendDiscordEmbed } from "../discord/discord.service.ts";
import { DiscordEmbedType } from "../discord/discord.validation.ts";
import { verifyHmacSignature } from "../../core/funcs/signature.ts";
import { COLORS } from "../../interface/discord.interface.ts";
import config from "../../utils/config.ts";

export function verifyGithubSignature(rawBody: Buffer, signature: string | undefined): boolean {
    return verifyHmacSignature(config.GITHUB_WEBHOOK_SECRET, rawBody, signature);
}

export async function handleGithub(event: string, payload: any) {
    let embed: DiscordEmbedType | null = null;

    switch (event) {
        case "push": embed = pushEmbed(payload); break;
        case "create": embed = createEmbed(payload); break;
        case "release": embed = releaseEmbed(payload); break;
        case "check_run": embed = checkRunEmbed(payload); break;
        case "check_suite": embed = checkSuiteEmbed(payload); break;
    }

    if (embed) await SendDiscordEmbed(embed);
}

function senderAuthor(sender: Sender): DiscordEmbedType["author"] {
    return { name: sender.login, url: sender.html_url, icon_url: sender.avatar_url };
}

function conclusionColor(conclusion: string) {
    if (conclusion === "success") return COLORS.success;
    if (conclusion === "failure" || conclusion === "timed_out") return COLORS.failure;
    return COLORS.neutral;
}

function pushEmbed(payload: GithubPush): DiscordEmbedType | null {
    if (payload.deleted || !payload.ref.startsWith("refs/heads/") || payload.commits.length === 0) return null;

    const branch = payload.ref.replace("refs/heads/", "");
    const count = payload.commits.length;
    const commits = payload.commits.slice(0, 5).map((commit) =>
        `[\`${commit.id.slice(0, 7)}\`](${commit.url}) ${commit.message.split("\n")[0]} - ${commit.author.username ?? commit.author.name}`
    );

    return {
        author: senderAuthor(payload.sender),
        title: `[${payload.repository.name}:${branch}] ${count} new commit${count === 1 ? "" : "s"}`,
        url: payload.compare,
        description: commits.join("\n"),
        color: COLORS.info,
    };
}

function createEmbed(payload: GithubCreate): DiscordEmbedType {
    return {
        author: senderAuthor(payload.sender),
        title: `[${payload.repository.full_name}] New ${payload.ref_type} created: ${payload.ref}`,
    };
}

function releaseEmbed(payload: GithubRelease): DiscordEmbedType | null {
    if (payload.action !== "published") return null;

    return {
        author: senderAuthor(payload.sender),
        title: `[${payload.repository.full_name}] New release published: ${payload.release.tag_name}`,
        url: payload.release.html_url,
    };
}

function checkRunEmbed(payload: GithubCheckRun): DiscordEmbedType | null {
    const run = payload.check_run;
    if (payload.action !== "completed" || !run.conclusion) return null;

    return {
        title: `[${payload.repository.name}] ${run.name} ${run.conclusion} on ${run.check_suite.head_branch ?? run.head_sha.slice(0, 7)}`,
        url: run.html_url,
        color: conclusionColor(run.conclusion),
    };
}

function checkSuiteEmbed(payload: GithubCheckSuite): DiscordEmbedType | null {
    const suite = payload.check_suite;
    if (payload.action !== "completed" || !suite.conclusion) return null;

    return {
        title: `[${payload.repository.name}] ${suite.app.name} checks ${suite.conclusion} on ${suite.head_branch ?? suite.head_sha.slice(0, 7)}`,
        color: conclusionColor(suite.conclusion),
    };
}
