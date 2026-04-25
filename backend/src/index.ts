import express, { Request, Response } from "express";
// Backend Deployed Version: 1.0.1
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { authenticate } from "./middleware/auth";
import prisma from "./lib/prisma";

// Routes
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import categoryRoutes from "./routes/categories";
import cartRoutes from "./routes/cart";
import orderRoutes from "./routes/orders";
import adminRoutes from "./routes/admin";
import storesRoutes from "./routes/stores";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
const allowedOrigins = ( [
  process.env.FRONTEND_URL,
  "https://mark1-gray.vercel.app",
  "http://localhost:3000"
].filter(Boolean) as string[] );

app.use(cors({
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed or is a Vercel preview URL
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".vercel.app");
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.send("Supermarket API is running successfully!");
});

// Health Check
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Cleanup Stores (Robust Merge & Purge)
app.get("/api/admin/cleanup-stores", async (req: Request, res: Response) => {
  try {
    // 1. Find the store we want to KEEP (the one with the most products or an owner)
    const keepStore = await prisma.stores.findFirst({
      where: { products: { some: {} } },
      orderBy: { created_at: 'desc' }
    }) || await prisma.stores.findFirst({ orderBy: { created_at: 'asc' } });

    if (!keepStore) return res.json({ message: "No stores found at all." });

    const otherStoreIds = (await prisma.stores.findMany({
      where: { id: { not: keepStore.id } },
      select: { id: true }
    })).map(s => s.id);

    if (otherStoreIds.length === 0) {
      return res.json({ message: "Database is already clean. Only one store exists.", store: keepStore.name });
    }

    // 2. MOVE EVERYTHING to the KeepStore
    await prisma.$transaction([
      // Move Orders
      prisma.orders.updateMany({
        where: { store_id: { in: otherStoreIds } },
        data: { store_id: keepStore.id }
      }),
      // Move Products
      prisma.products.updateMany({
        where: { store_id: { in: otherStoreIds } },
        data: { store_id: keepStore.id }
      }),
      // Move Categories
      prisma.categories.updateMany({
        where: { store_id: { in: otherStoreIds } },
        data: { store_id: keepStore.id }
      }),
      // Move Users/Staff
      prisma.users.updateMany({
        where: { store_id: { in: otherStoreIds } },
        data: { store_id: keepStore.id }
      }),
      // FINALLY Delete Other Stores
      prisma.stores.deleteMany({
        where: { id: { in: otherStoreIds } }
      })
    ]);

    res.json({ 
      message: "Merge & Cleanup successful!", 
      keptStore: { id: keepStore.id, name: keepStore.name },
      mergedFromCount: otherStoreIds.length 
    });
  } catch (error: any) {
    console.error("Cleanup Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Public Store Status (Used by Hero/Frontend)
app.get("/api/store-status", async (req: Request, res: Response) => {
  try {
    // Count total stores for debugging
    const totalStores = await prisma.stores.count();
    
    // Find the store that is most likely the "real" one (has an owner or products)
    const store = await prisma.stores.findFirst({
      where: {
        OR: [
          { owner_id: { not: null } },
          { products: { some: {} } }
        ]
      },
      orderBy: { created_at: 'desc' },
      select: { id: true, name: true, is_active: true }
    });
    
    console.log(`[Status Check] Total Stores in DB: ${totalStores}`);
    console.log(`[Status Check] Selected Store: ${store?.name} (${store?.id}), Active: ${store?.is_active}`);
    
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.json({ isActive: store?.is_active ?? false });
  } catch (error) {
    console.error("[Status Error]", error);
    res.status(500).json({ isActive: true });
  }
});

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/stores", storesRoutes);

// Test DB Connection
app.get("/api/test-db", async (req: Request, res: Response) => {
  try {
    const count = await prisma.users.count();
    res.json({ success: true, userCount: count });
  } catch (error: any) {
    res.status(500).json({ error: "DB connection failed", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
