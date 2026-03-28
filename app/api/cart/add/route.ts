import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    if (!user || user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { product_id, quantity } = await req.json();

    if (!product_id || !quantity) {
      return NextResponse.json({ error: "Product ID and quantity are required" }, { status: 400 });
    }

    // 1. Fetch product and validate
    const product = await prisma.products.findUnique({
      where: { id: product_id }
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.is_available) {
      return NextResponse.json({ error: "Product is not available" }, { status: 400 });
    }

    // 2. Find or create cart for this user and store
    let cart = await prisma.carts.findFirst({
      where: { user_id: user.id, store_id: product.store_id }
    });

    if (!cart) {
      cart = await prisma.carts.create({
        data: { 
          user_id: user.id, 
          store_id: product.store_id 
        }
      });
    }

    // 3. Find if item already in cart
    const existingItem = await prisma.cart_items.findFirst({
      where: { cart_id: cart.id, product_id }
    });

    if (existingItem) {
      // Increase quantity
      const updatedItem = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      return NextResponse.json(updatedItem);
    } else {
      // Create new cart item
      const newItem = await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id,
          quantity,
          price: product.price
        }
      });
      return NextResponse.json(newItem, { status: 201 });
    }

  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add to cart", details: error.message }, { status: 500 });
  }
}
