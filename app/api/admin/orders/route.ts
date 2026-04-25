import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;

  try {
    // 1. Identify which stores this admin can see
    let storeIds: string[] = [];
    
    if (user.role === "superadmin") {
      // Superadmin sees all
    } else {
      // 2. Find stores owned by this admin
      const ownedStores = await prisma.stores.findMany({
        where: { owner_id: user.id },
        select: { id: true }
      });
      storeIds = ownedStores.map(s => s.id);
      
      // 3. Add specifically assigned store if not already included
      if (user.store_id && !storeIds.includes(user.store_id)) {
        storeIds.push(user.store_id);
      }
    }

    console.log(`Admin Orders: Fetching for storeIds: ${JSON.stringify(storeIds)}`);

    const orders = await prisma.orders.findMany({
      where: {
        ...(storeIds.length > 0 ? { store_id: { in: storeIds } } : {})
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

    console.log(`Admin Orders: Found ${orders.length} orders`);

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("Admin Orders Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin orders", details: error.message },
      { status: 500 }
    );
  }
}
