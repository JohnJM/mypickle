import { Request, Response } from "express";
import { categories } from "../categories";
import { prisma } from "../server";

const addTagsToCategory = async ({ body: { categoryId, tagList } }: Request, res: Response) => {
    try {
        console.log({ categoryId, tagList })
        //loop over tags, check if exists in db (with the same categoryid)
        //add the entry or increase the count
        return res.status(200);
    } catch (err) {
        const { message } = err as Error;
        return res.status(500).json({ error: message });
    }
};

const getCategory = async (_req: Request, res: Response) => {
    try {
        //give client a list of categories 
        //ordered by number of tags attached least first
        return res.status(200);
    } catch (err) {
        const { message } = err as Error;
        return res.status(500).json({ error: message });
    }
};

export { addTagsToCategory, getCategory };