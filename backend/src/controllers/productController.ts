import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "../middleware/auth";

export const getProducts = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const isAdmin = user && (user.role === "admin" || user.role === "superadmin");

    let where: any = {};

    if (isAdmin) {
      // Admin sees ALL products for their store (including out-of-stock / unavailable)
      if (user.store_id) {
        where.store_id = user.store_id;
      }
    } else {
      // Customers and guests only see available products
      where.is_available = true;
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

    console.log(`[PRODUCTS] Role: ${user?.role || "guest"}, StoreID: ${user?.store_id || "N/A"}, Found: ${products.length}`);

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
    const { name, price, stock_quantity, is_available, category_id, image_url, description } = req.body;

    if (!id) return res.status(400).json({ error: "Product ID is required" });

    const product = await prisma.products.update({ 
      where: { id }, 
      data: { 
        name, 
        price, 
        category_id, 
        stock_quantity, 
        is_available,
        ...(image_url !== undefined && { image_url }),
        ...(description !== undefined && { description })
      },
      include: { categories: true }
    });

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update product", details: error.message });
  }
};


export const deleteProduct = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID required" });
    
    // Hard delete - actually remove from DB
    await prisma.products.delete({ where: { id } });

    res.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete product", details: error.message });
  }
};

