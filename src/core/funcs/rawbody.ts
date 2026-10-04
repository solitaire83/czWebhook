import { FastifyInstance } from "fastify";

export function useRawJsonBody(fastify: FastifyInstance) {
    fastify.removeContentTypeParser("application/json");
    fastify.addContentTypeParser("application/json", { parseAs: "buffer" }, (_req, body, done) => {
        done(null, body);
    });
}
