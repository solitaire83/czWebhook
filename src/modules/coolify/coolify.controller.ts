import { FastifyReply, FastifyRequest } from "fastify";
import { CoolifyEvent } from "./coolify.validation.ts";
import { handleCoolify, verifyCoolifyToken } from "./coolify.service.ts";

export async function CoolifyWebhook(request: FastifyRequest<{ Params: { token: string }; Body: CoolifyEvent }>, reply: FastifyReply) {
    if (!verifyCoolifyToken(request.params.token))
        return reply.code(404).send();

    await handleCoolify(request.body);

    return reply.code(200).send({
        received: true,
    })
}
