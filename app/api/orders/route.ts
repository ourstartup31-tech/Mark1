import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    
    // 1. Only allow customers
    if (!user || user.role !== "customer") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Fetch user's cart items with product details
    const cartItems = await prisma.cart_items.findMany({
      where: {
        carts: { user_id: user.id }
      },
      include: {
        products: true,
        carts: true
      }
    });

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 3. Group items by store_id (in case of multi-store carts)
    const itemsByStore: Record<string, typeof cartItems> = {};
    cartItems.forEach(item => {
      const sId = item.products?.store_id;
      if (sId) {
        if (!itemsByStore[sId]) itemsByStore[sId] = [];
        itemsByStore[sId].push(item);
      }
    });

    const ordersCreated: any[] = [];

    // 4. Create orders in a transaction
    await prisma.$transaction(async (tx: any) => {
      for (const [storeId, items] of Object.entries(itemsByStore)) {
        let storeTotal = 0;
        
        // Validate items
        for (const item of items) {
          if (!item.products || !item.products.is_available) {
            throw new Error(`Product ${item.products?.name || "unknown"} is no longer available`);
          }
          storeTotal += Number(item.price) * item.quantity;
        }

        // Create the order
        const order = await tx.orders.create({
          data: {
            user_id: user.id,
            store_id: storeId,
            total_price: storeTotal,
            status: "pending",
            order_items: {
              create: items.map((item: any) => ({
                product_id: item.product_id,
                quantity: item.quantity,
                price: item.price
              }))
            }
          },
          include: { order_items: true }
        });
        ordersCreated.push(order);
      }

      // 5. Clear the user's carts
      const cartIds = [...new Set(cartItems.map((item: any) => item.cart_id))].filter(Boolean) as string[];
      await tx.cart_items.deleteMany({
        where: { cart_id: { in: cartIds } }
      });
    });

    return NextResponse.json({ 
      message: "Order(s) placed successfully", 
      orders: ordersCreated 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}
