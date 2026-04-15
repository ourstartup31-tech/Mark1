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

// Staff management (stub for now, can be expanded)
router.get("/staff", async (req, res) => {
    // Current logic in AdminContext expects staff for a store
    const storeId = (req as any).user.store_id;
    if (!storeId) return res.json([]);
    
    const staff = await prisma.users.findMany({
        where: { store_id: storeId }
    });
    res.json(staff);
});

export default router;
