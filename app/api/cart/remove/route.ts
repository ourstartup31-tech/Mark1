import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    if (!user || user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product_id } = await req.json();

    if (!product_id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // 1. Find and Remove
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

    await prisma.cart_items.delete({
      where: { id: cartItem.id }
    });

    return NextResponse.json({ message: "Item removed from cart" });

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to remove item", details: error.message }, { status: 500 });
  }
}
