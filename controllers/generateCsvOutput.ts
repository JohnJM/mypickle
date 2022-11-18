import { Request, Response } from "express";
import { categories } from "../categories";
import { prisma } from "../server";
import { writeToPath } from "@fast-csv/format";
import { Category } from "@prisma/client";
import path from "path";

const addTags = async ({ id, name }: Category) => {
  const tags = await prisma.tag.findMany({
    where: { categoryId: id },
  });
  const tagOutput = tags
    .sort((a, b) => b.count - a.count)
    .map(t => '"' + t.name + '"' + ": count: " + t.count);
  return [name, ...tagOutput || "no tags"];
};

const generateCSV = async (_req: Request, res: Response) => {
  try {
    const existingCategories = await prisma.category.findMany({
      orderBy: { tagCount: "desc" },
      where: {
        tagCount: { gt: 0 },
      },
    });
    if (!existingCategories.length)
      return res.status(200).json({ error: "no categories" });
    const output: string[][] = [
      ["CATEGORY", "TAGS"],
      ...(await Promise.all(existingCategories.map(addTags))),
    ];

    writeToPath(path.resolve(__dirname, "../public/output.csv"), output);
    return res.status(200).json({ generatedCSV: true });
  } catch (err) {
    const { message } = err as Error;
    return res.status(500).json({ error: message });
  }
};

export { generateCSV };
