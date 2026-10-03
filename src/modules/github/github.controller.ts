import { FastifyReply, FastifyRequest } from "fastify";
import { GithubValidations} from "./github.validation.ts";
import { handleGithub } from "./github.service.ts";

export async function GithubWebhook(request: FastifyRequest, reply: FastifyReply) {
    const payload = GithubValidations.parse(request.body);
    await handleGithub(payload);

    return reply.code(200).send({
        received: true,
    })
}