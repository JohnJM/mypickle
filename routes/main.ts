import { Router } from "express";
import { genCategories } from "../controllers/dev";

const routes = Router();
routes.post("/populateCategories", genCategories); // just for dev

// TODO
// routes.get("/getNewCategory", getNewCategory);
// routes.post("/addTagsToCategory", addTagsToCategory);

export { routes };
