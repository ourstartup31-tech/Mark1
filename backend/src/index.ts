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

// Public Store Status (Used by Hero/Frontend)
app.get("/api/store-status", async (req: Request, res: Response) => {
  try {
    // For now, getting the first store's status as it's a single store setup
    const store = await prisma.stores.findFirst({
      select: { is_active: true }
    });
    res.set('Cache-Control', 'no-store');
    res.json({ is_active: store?.is_active ?? false });
  } catch (error) {
    res.status(500).json({ is_active: true }); // Default to open on error
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
