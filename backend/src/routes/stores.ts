import { Router } from "express";
import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

// GET /api/stores
router.get("/", authenticate, async (req: any, res) => {
    const user = req.user;
    const canAccessAll = user.role === "superadmin";
    const storeId = user.store_id;

    try {
        let stores;
        if (canAccessAll) {
            // Superadmin sees all
            stores = await prisma.stores.findMany({
                include: { owner: { select: { name: true, phone: true } } }
            });
        } else if (storeId) {
            // Admin sees only their own store
            stores = await prisma.stores.findMany({
                where: { id: storeId }
            });
        } else {
            // Regular user sees only active stores
            stores = await prisma.stores.findMany({
                where: { is_active: true }
            });
        }
        res.json(stores);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to fetch stores" });
    }
});

// POST /api/stores (Superadmin only)
router.post("/", authenticate, authorize(["superadmin"]), async (req, res) => {
    try {
        const store = await prisma.stores.create({
            data: req.body
        });
        res.status(201).json(store);
    } catch (error: any) {
        res.status(500).json({ error: "Failed to create store" });
    }
});

export default router;
