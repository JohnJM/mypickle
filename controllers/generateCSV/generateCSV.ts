import { Request, Response } from "express";
import { prisma } from "../../server";
import { writeToPath } from "@fast-csv/format";
import { Category } from "@prisma/client";
import path from "path";
import { updateGoogleSpreadSheet } from "./googleSheetsIntegration";

const addTags = async ({ id, name }: Category) => {
  const tags = await prisma.tag.findMany({
    where: { categoryId: id },
  });
  const tagOutput = tags
    .sort((a, b) => b.count - a.count)
    .map(t => `"${t.name}": count: ${t.count}`);
  return [name, ...tagOutput];
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
    writeToPath(path.resolve(__dirname, "../../public/output.csv"), output);
    await updateGoogleSpreadSheet(output);
    return res.status(200).json({ generatedCSV: true });
  } catch (err) {
    const { message } = err as Error;
    console.error({ error: message });
    if (message === "Failed on google sheet integration") {
      return res.status(500).json({ error: message });
    }
    return res.status(500).end();
  }
};

export { generateCSV };
