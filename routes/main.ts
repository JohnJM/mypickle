import { UserRole } from "@prisma/client";
import { Router } from "express";
import { login, register } from "../controllers/auth/";
import { addTagsToCategory, getCategories } from "../controllers/category";
import { genCategories } from "../controllers/dev";
import { generateCSV } from "../controllers/generateCSV/";
import { getAuthMiddleware } from "../middleware/auth";

const requireAuth = getAuthMiddleware([UserRole.ADMIN]);

const routes = Router();
routes.get("/healthCheck", (_, res) => res.status(200).end());

routes.post("/populateCategories", genCategories);
routes.post("/addTagsToCategory", addTagsToCategory);
routes.get("/getCategories", getCategories);
routes.post("/generateCSV", [requireAuth, generateCSV]);

routes.post("/register", register);
routes.post("/login", login);

export { routes };
