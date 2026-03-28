import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;

  try {
    // Admin can see orders for all their stores
    // First find the store IDs owned by this admin
    const ownedStores = await prisma.stores.findMany({
      where: { owner_id: user.id },
      select: { id: true }
    });

    const storeIds = ownedStores.map(s => s.id);

    const orders = await prisma.orders.findMany({
      where: {
        store_id: { in: storeIds }
      },
      include: {
        users: {
          select: { name: true, phone: true }
        },
        order_items: {
          include: { products: true }
        }
      },
      orderBy: { created_at: "desc" }
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch admin orders", details: error.message },
      { status: 500 }
    );
  }
}
