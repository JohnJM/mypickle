import { Router } from "express";
import { addTagsToCategory, getCategories } from "../controllers/category";
import { genCategories } from "../controllers/dev";
import { generateCSV } from "../controllers/generateCsvOutput";

const routes = Router();
routes.get("/healthCheck", (_, res) => res.status(200));

routes.post("/populateCategories", genCategories);
routes.post("/addTagsToCategory", addTagsToCategory);
routes.get("/getCategories", getCategories);
routes.post("/generateCSV", generateCSV);

export { routes };
