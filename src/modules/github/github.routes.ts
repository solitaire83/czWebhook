import { FastifyInstance } from "fastify";
import { GithubWebhook } from "./github.controller.ts";

export default async function GithubRouter(fastify: FastifyInstance) {
    fastify.removeContentTypeParser("application/json");
    fastify.addContentTypeParser("application/json", { parseAs: "buffer" }, (_req, body, done) => {
        done(null, body);
    });

    fastify.post("/", GithubWebhook);
}
