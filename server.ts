import path from "path";
import express, { Express } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { CONSTANTS, RATE_LIMIT_OPTIONS } from "./constants";
import { routes } from "./routes/main";

export const prisma = new PrismaClient();
const rateLimiter = rateLimit(RATE_LIMIT_OPTIONS);

const createServer = async () => {
  await prisma.$connect();
  return express();
};
const main = (app: Express) => {
  const { SERVER_ONLINE_MESSAGE, SERVER_PORT, STATIC_DIRECTORY } = CONSTANTS;
  app.listen(SERVER_PORT, () => console.log(SERVER_ONLINE_MESSAGE));
  app.use(rateLimiter);
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());
  app.use(
    `/${STATIC_DIRECTORY}`,
    express.static(path.join(__dirname, STATIC_DIRECTORY))
  );
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.use(routes);
};

createServer()
  .then(main)
  .catch(console.error)
  .finally(() => prisma.$disconnect());
