import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { z } from "zod";
import { AuthRequest } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

// Schema for OTP verification
const verifyOtpSchema = z.object({
  phone: z.string().min(10, "Phone number is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Controllers
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Phone number required" });

    // Generate 6-digit OTP (Random, not fixed)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60000); // 5 minutes

    await prisma.otp_codes.create({
      data: { phone, otp, expires_at: expiresAt }
    });

    // In production, the OTP should ONLY be sent via SMS. 
    // Including it here for dev/testing ease as in previous logic.
    res.json({ message: "OTP sent successfully", otp }); 
  } catch (error: any) {
    res.status(500).json({ error: "Failed to send OTP", details: error.message });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const body = verifyOtpSchema.parse(req.body);
    const { phone, otp } = body;

    const otpRecord = await prisma.otp_codes.findFirst({
      where: {
        phone,
        otp,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: "desc" },
    });

    if (!otpRecord) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Check if user exists, otherwise auto-register
    let user = await prisma.users.findUnique({ where: { phone } });
    if (!user) {
      // Auto-provision Superadmin if phone matches env var
      const superadminPhone = process.env.SUPERADMIN_PHONE;
      const role = (superadminPhone && phone === superadminPhone) ? "superadmin" : "customer";
      
      user = await prisma.users.create({
        data: { phone, role },
      });
    }

    await prisma.otp_codes.deleteMany({ where: { phone } });

    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("supermarket_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.json({ token, user });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues[0].message });
    }
    res.status(500).json({ error: "Verification failed", details: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  res.json({ user: req.user });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("supermarket_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  });
  res.json({ message: "Logged out successfully" });
};
