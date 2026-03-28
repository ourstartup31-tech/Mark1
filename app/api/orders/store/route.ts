import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    // 1. Only allow admin
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!user.store_id) {
      return NextResponse.json({ error: "Admin has no assigned store" }, { status: 400 });
    }

    // 2. Fetch orders for this admin's store
    const orders = await prisma.orders.findMany({
      where: { store_id: user.store_id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        },
        order_items: {
          include: {
            products: true
          }
        }
      },
      orderBy: { created_at: "desc" }
    });

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch store orders", details: error.message }, { status: 500 });
  }
}
