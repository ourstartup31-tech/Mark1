import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, getUserStoreAccess, getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    const { searchParams } = new URL(req.url);
    const queryStoreId = searchParams.get("store_id");

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let where: any = {};

    if (user.role === "admin") {
      // Admin ONLY sees their own store
      if (!user.store_id) {
        return NextResponse.json({ error: "Admin has no assigned store" }, { status: 400 });
      }
      where.store_id = user.store_id;
    } else if (user.role === "customer") {
      // Customer: MUST pass store_id as query param
      if (!queryStoreId) {
        return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
      }
      where.store_id = queryStoreId;
      where.is_available = true; // Only show available products to customers
    } else if (user.role === "superadmin") {
      // Superadmin returns ALL, can filter by query if provided
      if (queryStoreId) where.store_id = queryStoreId;
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
    
    // 1. Allow ONLY "admin"
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.store_id) {
      return NextResponse.json({ error: "Admin has no assigned store" }, { status: 400 });
    }

    const body = await req.json();
    
    // 2. Force store_id from user profile (NOT from frontend)
    const product = await prisma.products.create({ 
      data: { 
        ...body, 
        store_id: user.store_id 
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
    
    // 1. Allow ONLY "admin"
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, price, stock, is_available } = body;

    if (!id) return NextResponse.json({ error: "Product ID is required" }, { status: 400 });

    // 2. Fetch product and check ownership
    const existing = await prisma.products.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    if (existing.store_id !== user.store_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 3. Update allowed fields
    const product = await prisma.products.update({ 
      where: { id }, 
      data: {
        name,
        price,
        stock_quantity: stock, // database field is stock_quantity
        is_available
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

