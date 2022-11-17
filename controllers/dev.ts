import { Request, Response } from "express";
import { categories } from "../categories";
import { prisma } from "../server";

const genCategories = async (_req: Request, res: Response) => {
    try {
        const existingCategories = await prisma.category.findMany();
        if (existingCategories.length)
            return res
                .status(200)
                .json({ existingCategories: true });

        const { count } = await prisma.category.createMany({
            data: [...Array(categories.length)].map((_, i) => ({
                name: categories[i],
            })),
        });
        return res
            .status(201)
            .json({ success: true, count });
    } catch (err) {
        const { message } = err as Error;
        return res.status(500).json({ error: message });
    }
};

export { genCategories };
