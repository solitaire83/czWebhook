// Previews the Discord messages from GitHub or Coolify (needs only DISCORD_WEBHOOK_SECRET)
// Usage: pnpm tw <service> <kind> optional: <success/failure>
//        pnpm tw github  push / tag / release / check / suite
//        pnpm tw coolify deploy / test

import "dotenv/config";
import { execSync } from "node:child_process";

const [platform, kind, conclusion = "success"] = process.argv.slice(2);

type Embed = {
    title: string;
    url?: string;
    description?: string;
    color?: number;
    author?: { name: string; url: string; icon_url: string };
};

const color = conclusion === "success" ? 0x00a000 : 0xfc2929;
const repo = { name: "czWebhook", full_name: "solitaire83/czWebhook", html_url: "https://github.com/solitaire83/czWebhook" };
const author = { name: "UserAuthor1337", url: "https://github.com/", icon_url: "https://github.com/github.png" };
const tag = "v0.0.1-test";

const commits = execSync("git log -n 3 --pretty=oneline --no-decorate", { encoding: "utf8" })
    .trim()
    .split("\n")
    .map((line) => {
        const id = line.slice(0, line.indexOf(" "));
        const message = line.slice(line.indexOf(" ") + 1);
        return `[\`${id.slice(0, 7)}\`](${repo.html_url}/commit/${id}) ${message}`;
    });

const github: Record<string, Embed> = {
    push: {
        author,
        title: `[${repo.name}:master] ${commits.length} new commit${commits.length === 1 ? "" : "s"}`,
        url: `${repo.html_url}/compare`,
        description: commits.join("\n"),
        color: 0x7289da,
    },
    tag: {
        author,
        title: `[${repo.full_name}] New tag created: ${tag}`,
    },
    release: {
        author,
        title: `[${repo.full_name}] New release published: ${tag}`,
        url: `${repo.html_url}/releases/tag/${tag}`,
    },
    check: {
        title: `[${repo.name}] build (18.x) ${conclusion} on master`,
        url: `${repo.html_url}/actions`,
        color,
    },
    suite: {
        title: `[${repo.name}] GitHub Actions checks ${conclusion} on master`,
        color,
    },
};

const coolify: Record<string, Embed> = {
    deploy: {
        title: `[MAINAPP] Deployment ${conclusion} on production`,
        color,
    },
    test: {
        title: "[WEBHOOK] The Webhook is working properly",
        color: 0x7289da,
    },
};

const embeds: Record<string, Record<string, Embed>> = { github, coolify };
const embed = embeds[platform]?.[kind];

if (!embed) {
    console.error(`Usage:\n  pnpm tw github  ${Object.keys(github).join(" | ")} [success/failure]\n  pnpm tw coolify ${Object.keys(coolify).join(" | ")} [success/failure]`);
    process.exit(1);
}

const url = process.env.DISCORD_WEBHOOK_SECRET;
if (!url) {
    console.error("Missing DISCORD_WEBHOOK_SECRET in .env");
    process.exit(1);
}

const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
});

if (!response.ok) {
    console.error(`Discord Webhook failed! (${response.status})`);
    process.exit(1);
}

console.log(`${platform} ${kind} -> sent to Discord`);
