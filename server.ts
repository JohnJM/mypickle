import path from "path";
import express, { Express } from "express";
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { CONSTANTS, RATE_LIMIT_OPTIONS } from "./constants";
import { routes } from "./routes/main";

export const prisma = new PrismaClient();
const rateLimiter = rateLimit(RATE_LIMIT_OPTIONS);

const createServer = async () => {
    await prisma.$connect();
    // await prisma.category.deleteMany({})
    return express();
};
const main = (app: Express) => {
    const { SERVER_ONLINE_MESSAGE, SERVER_PORT, STATIC_DIRECTORY } =
        CONSTANTS;
    app.listen(SERVER_PORT, () => console.log(SERVER_ONLINE_MESSAGE));
    app.use(rateLimiter);
    app.use(morgan("dev"));
    app.use(express.json());
    app.use(`/${STATIC_DIRECTORY}`, express.static(path.join(__dirname, STATIC_DIRECTORY),
    ));
    app.use(routes);
};

createServer()
    .then(main)
    .catch(console.error)
    .finally(() => prisma.$disconnect());
