import { Request, Response } from "express";
import { categories } from "../categories";
import { prisma } from "../server";
import { writeToPath } from "@fast-csv/format";
import { Category } from "@prisma/client";
import path from "path";

const addTags = async (
  { id, name }: Category,
  index: number,
  output: string[][]
) => {
  const tags = await prisma.tag.findMany({
    where: { categoryId: id },
  });
  const tagOutput = tags
    .sort((a, b) => b.count - a.count)
    .map(t => '"' + t.name + '"  ' + " : count: " + t.count);
  output[index + 1] = [];
  output[index + 1][0] = name;
  output[index + 1][1] = tagOutput.join("  |  ").toString() || "no tags";
};

const generateCSV = async (_req: Request, res: Response) => {
  try {
    const existingCategories = await prisma.category.findMany({
      orderBy: { tagCount: "desc" },
    });
    if (!existingCategories.length)
      return res.status(200).json({ error: "no categories" });
    let output: string[][] = [["CATEGORY", "TAGS"]];
    await Promise.all(
      existingCategories.map((cat, index) =>
        addTags(cat, index, output)
      )
    );
    writeToPath(path.resolve(__dirname, "../public/output.csv"), output);
    return res.status(200).json({ generatedCSV: true });
  } catch (err) {
    const { message } = err as Error;
    return res.status(500).json({ error: message });
  }
};

export { generateCSV };

