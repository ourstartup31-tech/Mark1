import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, getUserStoreAccess, getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    const { searchParams } = new URL(req.url);
    let where: any = {};
    const isCustomer = !user || user.role === "customer";

    if (isCustomer) {
      where.is_available = true; // Customers only see available items
    } else if (user.role === "admin" && user.store_id) {
      where.store_id = user.store_id; // Admins only see their store's products
    }

    const products = await prisma.products.findMany({
      where,
      include: { categories: true },
      orderBy: { created: "desc" }
    });
    
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    // 1. Allow "admin" or "superadmin"
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { name, description, price, category, category_id, stock, stock_quantity, image, image_url, is_available, inStock } = body;
    
    // Resolve category_id if name is provided instead
    if (!category_id && category) {
      const cat = await prisma.categories.findFirst({
        where: { 
          name: category,
          // optional store_id check
          ...(user.store_id ? { store_id: user.store_id } : {})
        }
      });
      if (cat) category_id = cat.id;
    }

    // Standardize stock and availability
    const finalStock = stock_quantity ?? stock ?? 0;
    const finalAvailable = is_available ?? inStock ?? true;
    const finalImageUrl = image_url ?? image ?? null;

    // 2. Force store_id from user profile if available (otherwise null)
    const product = await prisma.products.create({ 
      data: { 
        name,
        description,
        price,
        category_id,
        stock_quantity: finalStock,
        image_url: finalImageUrl,
        is_available: finalAvailable,
        store_id: user.store_id || undefined
      } 
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create product", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    // 1. Allow "admin" or "superadmin"
    if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { id, name, price, stock, stock_quantity, is_available, inStock, category, category_id } = body;

    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    // 2. Fetch product and check ownership (skipping store_id check in single-store setup)
    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    // Resolve category_id if name is provided instead
    if (!category_id && category) {
      const cat = await prisma.categories.findFirst({
        where: { 
          name: category,
          store_id: user.store_id
        }
      });
      if (cat) category_id = cat.id;
    }

    const finalStock = stock_quantity ?? stock ?? existing.stock_quantity;
    const finalAvailable = is_available ?? inStock ?? existing.is_available;

    // 3. Update allowed fields
    const product = await prisma.products.update({ 
      where: { id }, 
      data: {
        name,
        price,
        category_id: category_id || existing.category_id,
        stock_quantity: finalStock,
        is_available: finalAvailable
      } 
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update product", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    // 1. Allow ONLY "admin"
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    // 2. Verify ownership
    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (existing.store_id !== user.store_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Soft delete (set is_available = false)
    const product = await prisma.products.update({ 
      where: { id }, 
      data: { is_available: false } 
    });

    return NextResponse.json({ message: "Product soft-deleted", product });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete product", details: error.message }, { status: 500 });
  }
}

