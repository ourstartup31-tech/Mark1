import { Router } from "express";
import { 
  getMyOrders, 
  createOrder,
  getOrderById
} from "../controllers/orderController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All order routes require authentication
router.use(authenticate);

router.get("/my", getMyOrders);
router.post("/", createOrder);
router.get("/:id", getOrderById);

export default router;
