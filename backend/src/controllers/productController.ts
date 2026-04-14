import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const isCustomer = !user || user.role === "customer";

    let where: any = {};
    if (isCustomer) {
      where.is_available = true; // Customers only see available items
    }

    const { category_id } = req.query;
    if (category_id) {
      where.category_id = category_id as string;
    }

    const products = await prisma.products.findMany({
      where,
      include: { categories: true },
      orderBy: { created: "desc" }
    });
    
    console.log(`[PRODUCTS] Fetching products. isCustomer: ${isCustomer}, Found: ${products.length}`);
    if (products.length > 0) {
      console.log(`[PRODUCTS] First product detail: Name: ${products[0].name}, Available: ${products[0].is_available}, StoreID: ${products[0].store_id}`);
    }

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch products", details: error.message });
  }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, description, price, category_id, stock_quantity, image_url, is_available } = req.body;

    const product = await prisma.products.create({ 
      data: { 
        name,
        description,
        price,
        category_id,
        stock_quantity: stock_quantity ?? 0,
        image_url: image_url ?? null,
        is_available: is_available ?? true,
        store_id: user.store_id || undefined
      } 
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create product", details: error.message });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, price, stock_quantity, is_available, category_id } = req.body;

    if (!id) return res.status(400).json({ error: "Product ID is required" });

    const product = await prisma.products.update({ 
      where: { id }, 
      data: { name, price, category_id, stock_quantity, is_available } 
    });

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update product", details: error.message });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || user.role !== "admin") {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID required" });
    
    // Soft delete
    const product = await prisma.products.update({ 
      where: { id }, 
      data: { is_available: false } 
    });

    res.json({ message: "Product soft-deleted", product });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete product", details: error.message });
  }
};
