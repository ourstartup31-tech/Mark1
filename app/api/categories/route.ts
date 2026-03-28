import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserStoreAccess } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { storeId, canAccessAll } = await getUserStoreAccess(req);
    const { searchParams } = new URL(req.url);
    const targetStoreId = searchParams.get("storeId");

    let where: any = {};
    if (storeId) {
      where.store_id = storeId;
    } else if (targetStoreId) {
      where.store_id = targetStoreId;
    } else if (!canAccessAll) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
    }

    const categories = await prisma.categories.findMany({
      where,
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
    const finalStoreId = canAccessAll ? body.store_id : storeId;

    if (!finalStoreId) {
      return NextResponse.json({ error: "Store ID is required" }, { status: 400 });
    }

    const category = await prisma.categories.create({
      data: {
        ...body,
        store_id: finalStoreId
      }
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
