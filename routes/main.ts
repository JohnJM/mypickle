import { Router } from "express";
import { addTagsToCategory, getCategories } from "../controllers/category";
import { genCategories } from "../controllers/dev";

const routes = Router();
routes.post("/populateCategories", genCategories);
routes.post("/addTagsToCategory", addTagsToCategory);
routes.get("/getCategories", getCategories);

export { routes };
