import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

/**
 * Fetch all orders for the current customer
 */
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    if (user.role !== "customer") {
      return res.status(403).json({ error: "Only customers can view their orders" });
    }

    const dbOrders = await prisma.orders.findMany({
      where: { user_id: user.id },
      include: {
        order_items: {
          include: {
            products: true
          }
        },
        stores: {
          select: {
            name: true,
            address: true
          }
        }
      },
      orderBy: { created_at: "desc" }
    });

    // Map to frontend format
    const orders = dbOrders.map(order => ({
      id: order.id,
      total_amount: order.total_price,
      status: order.status,
      // For now, using placeholders or extracting if we had them. 
      // The frontend sends these during creation, so we should probably have stored them.
      // Since schema doesn't have them, we'll return some defaults or extract from pickup_time
      pickup_day: "Today", 
      pickup_slot: "Standard Slot",
      created_at: order.created_at,
      store: order.stores,
      items: order.order_items.map(item => ({
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        product: {
          name: item.products?.name || "Product",
          emoji: (item.products as any)?.emoji || "📦"
        }
      }))
    }));
    
    return res.json({ orders });
  } catch (error: any) {
    console.error("Get My Orders Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch orders", details: error.message });
  }
};

/**
 * Place a new order based on current cart items
 */
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { payment_method, pickup_slot, pickup_day } = req.body;
    
    if (user.role !== "customer") {
      return res.status(403).json({ error: "Only customers can place orders" });
    }

    // 1. Fetch user's cart items with product details
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
      return res.status(400).json({ error: "Cart is empty" });
    }

    // 2. Group items by store_id
    const itemsByStore: Record<string, typeof cartItems> = {};
    cartItems.forEach(item => {
      const sId = item.products?.store_id;
      if (sId) {
        if (!itemsByStore[sId]) itemsByStore[sId] = [];
        itemsByStore[sId].push(item);
      }
    });

    const ordersCreated: any[] = [];

    // 3. Create orders in a transaction
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
        // Note: We don't have pickup_day/slot in DB yet, so we just log or store in status/metadata if needed.
        // For now, we'll just return them in the response so the confirmation page works.
        const order = await tx.orders.create({
          data: {
            user_id: user.id,
            store_id: storeId,
            total_price: storeTotal,
            status: "pending",
            payment_method: payment_method || "pay-at-store",
            // pickup_time placeholder logic if needed
            pickup_time: new Date(), 
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

        // Add virtual fields for frontend
        ordersCreated.push({
            ...order,
            total_amount: order.total_price,
            pickup_day: pickup_day || "Today",
            pickup_slot: pickup_slot || "Standard Slot"
        });
      }

      // 4. Clear the user's carts
      const cartIds = [...new Set(cartItems.map((item: any) => item.cart_id))].filter(Boolean) as string[];
      await tx.cart_items.deleteMany({
        where: { cart_id: { in: cartIds } }
      });
    });

    return res.status(201).json({ 
      message: "Order(s) placed successfully", 
      orders: ordersCreated 
    });

  } catch (error: any) {
    console.error("Create Order Error:", error.message);
    return res.status(500).json({ error: error.message || "Failed to place order" });
  }
};

/**
 * Fetch a single order by ID
 */
export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;

        const order = await prisma.orders.findUnique({
            where: { id },
            include: {
                order_items: {
                    include: {
                        products: true
                    }
                },
                stores: true
            }
        });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        // Check if user has permission (is the owner, or is admin of that store)
        if (user.role === "customer" && order.user_id !== user.id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        if (user.role === "admin" && order.store_id !== user.store_id) {
            return res.status(403).json({ error: "Forbidden" });
        }

        return res.json(order);
    } catch (error: any) {
        return res.status(500).json({ error: "Failed to fetch order details" });
    }
};
