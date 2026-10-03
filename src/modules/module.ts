import { FastifyInstance } from 'fastify';
import GithubRouter from "./github/github.routes.ts";

export default async function MainRouter(fastify: FastifyInstance) {
    fastify.get("/", async () => {
        return {
            msg: 'hello world'
        }
    })

    fastify.register(GithubRouter, { prefix: "/github" });
}
