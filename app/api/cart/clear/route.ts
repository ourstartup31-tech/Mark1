import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    if (!user || user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Find all carts for this user
    const userCarts = await prisma.carts.findMany({
      where: { user_id: user.id },
      select: { id: true }
    });

    const cartIds = userCarts.map(c => c.id);

    // 2. Delete all items in those carts
    const result = await prisma.cart_items.deleteMany({
      where: {
        cart_id: { in: cartIds }
      }
    });

    return NextResponse.json({ 
      message: "Cart cleared", 
      itemsRemoved: result.count 
    });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to clear cart", details: error.message }, { status: 500 });
  }
}
