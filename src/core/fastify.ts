import Fastify from "fastify";
import MainRouter from "../modules/module.ts";
import config from "../utils/config.ts";

export const CORE = Fastify({
    logger: config.NODE_ENV === "development"
})

// MODULES
CORE.register(MainRouter);

CORE.listen({
    port: config.PORT,
    host: "0.0.0.0"
})