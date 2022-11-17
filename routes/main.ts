import { Router } from "express";
import { addTagsToCategory } from "../controllers/category";
import { genCategories } from "../controllers/dev";

const routes = Router();
routes.post("/populateCategories", genCategories);
routes.post("/addTagsToCategory", addTagsToCategory);

// TODO
// routes.get("/getNewCategory", getNewCategory);

export { routes };
