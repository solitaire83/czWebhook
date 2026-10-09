import { FastifyInstance } from "fastify";
import { CoolifyWebhook } from "./coolify.controller.ts";

export default async function CoolifyRouter(fastify: FastifyInstance) {
    fastify.post("/:token", CoolifyWebhook);
}
