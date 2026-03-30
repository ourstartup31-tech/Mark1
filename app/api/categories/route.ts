import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserStoreAccess } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const categories = await prisma.categories.findMany({
      include: { products: { take: 5 } } // Sample products
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { user, storeId, canAccessAll } = await getUserStoreAccess(req);
  if (!user || (!storeId && !canAccessAll)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { emoji, ...rest } = body; // remove emoji from body

    const category = await prisma.categories.create({
      data: {
        ...rest,
        // store_id is optional in single-store setup or taken from user if available
        store_id: user.store_id || undefined
      }
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create category", details: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { user, storeId } = await getUserStoreAccess(req);
  if (!user || !storeId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, name, description } = body;
    if (!id) return NextResponse.json({ error: "Category ID required" }, { status: 400 });

    const existing = await prisma.categories.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.store_id !== storeId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const category = await prisma.categories.update({
      where: { id },
      data: { name, description }
    });
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { user, storeId } = await getUserStoreAccess(req);
  if (!user || !storeId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.categories.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (existing.store_id !== storeId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await prisma.categories.delete({ where: { id } });
    return NextResponse.json({ message: "Deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
