import { FastifyInstance } from 'fastify';
import GithubRouter from "./github/github.routes.ts";
import CoolifyRouter from "./coolify/coolify.routes.ts";

export default async function MainRouter(fastify: FastifyInstance) {
    fastify.register(GithubRouter, { prefix: "/github" });
    fastify.register(CoolifyRouter, { prefix: "/coolify" });
}
