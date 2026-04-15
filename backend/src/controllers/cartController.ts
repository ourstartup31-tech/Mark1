import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import prisma from "../lib/prisma";

/**
 * Fetch the user's cart items across all stores
 */
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    // Find all carts for this user (could be across multiple stores)
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

    // Flatten items and calculate total
    const allItems = carts.flatMap(cart => cart.cart_items);
    const total = allItems.reduce((sum, item) => {
      const price = Number(item.price);
      return sum + (price * item.quantity);
    }, 0);

    return res.json({
      items: allItems,
      total: total.toFixed(2),
      count: allItems.length
    });
  } catch (error: any) {
    console.error("Get Cart Error:", error.message);
    return res.status(500).json({ error: "Failed to fetch cart", details: error.message });
  }
};

/**
 * Add an item to the cart
 */
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({ error: "Product ID and quantity are required" });
    }

    // 1. Fetch product and validate
    const product = await prisma.products.findUnique({
      where: { id: product_id }
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (!product.is_available) {
      return res.status(400).json({ error: "Product is not available" });
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
      return res.status(200).json(updatedItem);
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
      return res.status(201).json(newItem);
    }
  } catch (error: any) {
    console.error("Add to Cart Error:", error.message);
    return res.status(500).json({ error: "Failed to add to cart", details: error.message });
  }
};

/**
 * Update item quantity in the cart
 */
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { product_id, quantity } = req.body;

    if (!product_id || quantity === undefined) {
      return res.status(400).json({ error: "Product ID and quantity are required" });
    }

    // Find the item first to ensure permissions
    const item = await prisma.cart_items.findFirst({
      where: {
        product_id,
        carts: { user_id: user.id }
      }
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    if (quantity <= 0) {
      await prisma.cart_items.delete({ where: { id: item.id } });
      return res.json({ message: "Item removed from cart" });
    }

    const updatedItem = await prisma.cart_items.update({
      where: { id: item.id },
      data: { quantity }
    });

    return res.json(updatedItem);
  } catch (error: any) {
    console.error("Update Cart Error:", error.message);
    return res.status(500).json({ error: "Failed to update cart", details: error.message });
  }
};

/**
 * Remove a single item from the cart
 */
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const item = await prisma.cart_items.findFirst({
      where: {
        product_id,
        carts: { user_id: user.id }
      }
    });

    if (!item) {
      return res.status(404).json({ error: "Item not found in cart" });
    }

    await prisma.cart_items.delete({ where: { id: item.id } });
    return res.json({ message: "Item removed" });
  } catch (error: any) {
    console.error("Remove from Cart Error:", error.message);
    return res.status(500).json({ error: "Failed to remove item", details: error.message });
  }
};

/**
 * Clear the entire cart for the user
 */
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    
    // Find all cart IDs for this user
    const userCarts = await prisma.carts.findMany({
      where: { user_id: user.id },
      select: { id: true }
    });

    const cartIds = userCarts.map(c => c.id);

    // Delete all cart items for those carts
    await prisma.cart_items.deleteMany({
      where: { cart_id: { in: cartIds } }
    });

    return res.json({ message: "Cart cleared successfully" });
  } catch (error: any) {
    console.error("Clear Cart Error:", error.message);
    return res.status(500).json({ error: "Failed to clear cart", details: error.message });
  }
};
