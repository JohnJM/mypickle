import { Request } from "express";
import { categories } from "./categories";

const RATE_LIMIT_OPTIONS = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req: Request) => req?.route?.path === "/healthCheck",
};

const SERVER_PORT = 10000;
const STATIC_DIRECTORY = "public";

const CATEGORY_COUNT = categories.length || 1201;

const CONSTANTS = {
  SERVER_ONLINE_MESSAGE: `Server running on port ${SERVER_PORT}`,
  SERVER_PORT,
  STATIC_DIRECTORY,
  CATEGORY_COUNT,
};

export { CONSTANTS, RATE_LIMIT_OPTIONS };
