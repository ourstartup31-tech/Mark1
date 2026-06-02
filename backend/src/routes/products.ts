import { Router } from "express";
import { getProducts, createProduct, updateProduct, deleteProduct } from "../controllers/productController";
import { authenticate, optionalAuthenticate } from "../middleware/auth";

const router = Router();

router.get("/", optionalAuthenticate, getProducts);
router.post("/", authenticate, createProduct);
router.put("/:id", authenticate, updateProduct);
router.delete("/:id", authenticate, deleteProduct);

export default router;
