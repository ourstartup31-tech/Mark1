import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    if (!user || user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product_id, quantity } = await req.json();

    if (!product_id || quantity === undefined) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 });
    }

    // 1. Find user's cart containing this product
    const cartItem = await prisma.cart_items.findFirst({
      where: {
        product_id,
        carts: {
          user_id: user.id
        }
      }
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // 2. Update or Remove
    if (quantity <= 0) {
      await prisma.cart_items.delete({
        where: { id: cartItem.id }
      });
      return NextResponse.json({ message: "Item removed from cart" });
    } else {
      const updated = await prisma.cart_items.update({
        where: { id: cartItem.id },
        data: { quantity }
      });
      return NextResponse.json(updated);
    }

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update cart", details: error.message }, { status: 500 });
  }
}
