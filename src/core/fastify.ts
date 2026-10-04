import Fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import MainRouter from "../modules/module.ts";
import config from "../utils/config.ts";

export const CORE = Fastify({
    logger: config.LOGGER,
    trustProxy: true // https://www.fastify.io/docs/latest/Reference/Server/#trustproxy
})

// SECURITY
await CORE.register(rateLimit, {
    max: config.RATE_LIMIT_MAX,
    timeWindow: config.RATE_LIMIT_WINDOW
})

// MODULES
CORE.register(MainRouter);

CORE.listen({
    port: config.PORT,
    host: "0.0.0.0"
})