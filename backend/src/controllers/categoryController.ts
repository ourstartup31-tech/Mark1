import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: { name: "asc" }
    });
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, description, store_id } = req.body;
    if (!name) return res.status(400).json({ error: "Category name required" });

    const category = await prisma.categories.create({
      data: { name, description, store_id: store_id || null }
    });
    res.status(201).json(category);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create category", details: error.message });
  }
};
