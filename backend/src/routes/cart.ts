import { Router } from "express";
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeFromCart, 
  clearCart 
} from "../controllers/cartController";
import { authenticate } from "../middleware/auth";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeFromCart);
router.delete("/clear", clearCart);

export default router;
