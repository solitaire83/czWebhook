import { FastifyInstance } from "fastify";
import { GithubWebhook } from "./github.controller.ts";
import { useRawJsonBody } from "../../core/funcs/rawbody.ts";

export default async function GithubRouter(fastify: FastifyInstance) {
    useRawJsonBody(fastify);

    fastify.post("/", GithubWebhook);
}
