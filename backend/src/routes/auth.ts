import { Router } from "express";
import { sendOtp, verifyOtp, getMe, logout, googleDummyAuth } from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/me", authenticate, getMe);
router.post("/logout", logout);
router.post("/google-dummy", googleDummyAuth);

export default router;
