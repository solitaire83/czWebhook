import { FastifyReply, FastifyRequest } from "fastify";
import { handleGithub, verifyGithubSignature } from "./github.service.ts";

export async function GithubWebhook(request: FastifyRequest<{ Body: Buffer }>, reply: FastifyReply) {
    const signature = request.headers["x-hub-signature-256"] as string | undefined;
    if (!verifyGithubSignature(request.body, signature)) 
        return reply.code(401).send({ error: "Invalid signature" });
    

    const event = request.headers["x-github-event"] as string;
    await handleGithub(event, JSON.parse(request.body.toString("utf8")));

    return reply.code(200).send({
        received: true,
    })
}
