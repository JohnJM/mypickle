import { Request, Response } from "express";
import { categories } from "../categories";
import { prisma } from "../server";

const rngCategories = categories.sort(() => Math.random() - 0.5);
const genCategories = async (_req: Request, res: Response) => {
  try {
    const existingCategories = await prisma.category.findMany();
    if (existingCategories.length)
      return res.status(200).json({ existingCategories: true });

    const { count } = await prisma.category.createMany({
      data: [...Array(rngCategories.length)].map((_, i) => ({
        name: rngCategories[i],
        tagCount: 0,
      })),
    });
    return res.status(201).json({ success: true, count });
  } catch (err) {
    return res.status(500).end();
  }
};

export { genCategories };
