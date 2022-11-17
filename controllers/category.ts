import { Request, Response } from "express";
import { prisma } from "../server";

const createOrUpdateTags = async (name: string, categoryId: string) => {
    const { id, count } = await prisma.tag.findFirst({ where: { name, categoryId } }) || {};
    if (id && count) {
        await prisma.tag.update({ where: { id }, data: { count: count + 1 } });
    } else {
        await prisma.tag.create({ data: { count: 1, name, categoryId } })
    }
}

const addTagsToCategory = async ({ body: { categoryId, tagList } }: Request, res: Response) => {
    try {
        if (!tagList.length) return res.status(400).json({ error: 'no tags provided' })
        await Promise.all(tagList.map((name: string) => createOrUpdateTags(name, categoryId)));
        await prisma.category.update({ where: { id: categoryId }, data: { tagCount: { increment: tagList.length } } })
        return res.status(201).json({ success: true })
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