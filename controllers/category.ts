import { Request, Response } from "express";
import { CONSTANTS } from "../constants";
import { prisma } from "../server";
import { Category } from "@prisma/client";

const createOrUpdateTags = async (name: string, categoryId: string) => {
    const { id, count } =
        (await prisma.tag.findFirst({ where: { name, categoryId } })) || {};
    if (id && count) {
        await prisma.tag.update({ where: { id }, data: { count: count + 1 } });
    } else {
        await prisma.tag.create({ data: { count: 1, name, categoryId } });
    }
};

const addTagsToCategory = async (
    { body: { categoryId, tagList } }: Request,
    res: Response
) => {
    try {
        if (!tagList.length)
            return res.status(400).json({ error: "no tags provided" });
        await Promise.all(
            tagList.map((name: string) => createOrUpdateTags(name, categoryId))
        );
        await prisma.category.update({
            where: { id: categoryId },
            data: { tagCount: { increment: tagList.length } },
        });
        return res.status(201).json({ success: true });
    } catch (err) {
        const { message } = err as Error;
        return res.status(500).json({ error: message });
    }
};

const mapCategories = (cat: Category) => ({ id: cat.id, name: cat.name });
const getCategories = async (
    { body: { skip = 0, take = 5 } }: Request,
    res: Response
) => {
    try {
        const categories = await prisma.category.findMany({
            skip,
            take,
            orderBy: {
                tagCount: "asc",
            },
        });
        return res.status(200).json({
            categories: categories.map(mapCategories),
        });
    } catch (err) {
        const { message } = err as Error;
        return res.status(500).json({ error: message });
    }
};

export { addTagsToCategory, getCategories };
