import { FastifyInstance } from "fastify";
import { GithubWebhook } from "./github.controller.ts";

export default async function GithubRouter(fastify: FastifyInstance) {
    fastify.post("/", GithubWebhook);
}