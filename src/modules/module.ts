import { FastifyInstance } from 'fastify';
import GithubRouter from "./github/github.routes.ts";

export default async function MainRouter(fastify: FastifyInstance) {
    fastify.register(GithubRouter, { prefix: "/github" });
}
