import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    // 1. Only allow customers
    if (!user || user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch all carts for this user (could be across multiple stores)
    const carts = await prisma.carts.findMany({
      where: { user_id: user.id },
      include: {
        cart_items: {
          include: {
            products: {
              select: {
                id: true,
                name: true,
                price: true,
                image_url: true,
                store_id: true,
                is_available: true
              }
            }
          }
        }
      }
    });

    // 3. Flatten items and calculate total
    const allItems = carts.flatMap(cart => cart.cart_items);
    const total = allItems.reduce((sum, item) => {
      const price = Number(item.price);
      return sum + (price * item.quantity);
    }, 0);

    return NextResponse.json({
      items: allItems,
      total: total.toFixed(2),
      count: allItems.length
    });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch cart", details: error.message }, { status: 500 });
  }
}
