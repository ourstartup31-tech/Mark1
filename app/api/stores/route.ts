import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAuth, requireSuperAdmin, getUserStoreAccess } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { user, storeId, canAccessAll } = await getUserStoreAccess(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    let stores;
    if (canAccessAll) {
      // Superadmin sees all
      stores = await prisma.stores.findMany({
        include: { owner: { select: { name: true, phone: true } } }
      });
    } else if (storeId) {
      // Admin sees only their own store
      stores = await prisma.stores.findMany({
        where: { id: storeId }
      });
    } else {
      // Regular user sees only active stores
      stores = await prisma.stores.findMany({
        where: { is_active: true }
      });
    }
    
    return NextResponse.json(stores);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch stores", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { response } = await requireSuperAdmin(req);
  if (response) return response;

  try {
    const body = await req.json();
    const store = await prisma.stores.create({
      data: body
    });
    return NextResponse.json(store, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to create store", details: error.message },
      { status: 500 }
    );
  }
}

