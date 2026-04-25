import { Router } from "express";
import { 
  getStoreOrders, 
  updateOrderStatus 
} from "../controllers/orderController";
import { authenticate, authorize } from "../middleware/auth";
import prisma from "../lib/prisma";

const router = Router();

// All admin routes require authentication and admin/superadmin role
router.use(authenticate);
router.use(authorize(["admin", "superadmin"]));

// Order management
router.get("/orders", getStoreOrders);
router.put("/orders/status", updateOrderStatus);

// Store Status management
router.get("/store-status", async (req, res) => {
    try {
        const storeId = (req as any).user.store_id;
        if (!storeId) return res.status(400).json({ error: "No store associated with this user" });

        const store = await prisma.stores.findUnique({
            where: { id: storeId },
            select: { is_active: true }
        });
        
        res.set('Cache-Control', 'no-store');
        res.json({ isActive: store?.is_active ?? false });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch store status" });
    }
});

router.put("/store-status", async (req, res) => {
    try {
        const storeId = (req as any).user.store_id;
        const { isActive } = req.body;

        if (!storeId) return res.status(400).json({ error: "No store associated" });

        await prisma.stores.update({
            where: { id: storeId },
            data: { is_active: isActive }
        });

        res.json({ success: true, isActive });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to update store status" });
    }
});

// Admin Stats (Total Products, Active Staff)
router.get("/stats", async (req, res) => {
    try {
        const storeId = (req as any).user.store_id;
        if (!storeId) return res.status(400).json({ error: "No store associated" });

        const [productCount, staffCount] = await Promise.all([
            prisma.products.count({ where: { store_id: storeId, is_available: true } }),
            prisma.users.count({ where: { store_id: storeId, role: "admin" } })
        ]);

        res.json({
            totalProducts: productCount,
            activeStaff: staffCount
        });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

// Staff management (stub for now, can be expanded)
router.get("/staff", async (req, res) => {
    const storeId = (req as any).user.store_id;
    if (!storeId) return res.json([]);
    
    const staff = await prisma.users.findMany({
        where: { store_id: storeId }
    });
    res.json(staff);
});

export default router;
