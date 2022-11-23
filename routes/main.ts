import { Router } from "express";
import { addTagsToCategory, getCategories } from "../controllers/category";
import { genCategories } from "../controllers/dev";
import { generateCSV } from "../controllers/generateCSV/";

const routes = Router();
routes.get("/healthCheck", (_, res) => res.status(200).end());

routes.post("/populateCategories", genCategories);
routes.post("/addTagsToCategory", addTagsToCategory);
routes.get("/getCategories", getCategories);
routes.get("/generateCSV", generateCSV);

export { routes };
