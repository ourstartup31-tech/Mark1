import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { cookies } from "next/headers";

const verifyOtpSchema = z.object({
  phone: z.string().min(10, "Phone number is required"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, otp } = verifyOtpSchema.parse(body);

    // Find the latest valid OTP
    const otpRecord = await prisma.otp_codes.findFirst({
      where: {
        phone,
        otp,
        expires_at: { gt: new Date() },
      },
      orderBy: { created_at: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { error: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check if user exists, otherwise auto-register
    let user = await prisma.users.findUnique({
      where: { phone },
    });

    if (!user) {
      user = await prisma.users.create({
        data: {
          phone,
          role: "customer",
        },
      });
    }

    // Delete used OTP
    await prisma.otp_codes.deleteMany({
      where: { phone },
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, phone: user.phone, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set HTTP-only cookie
    const cookieStore = await cookies();
    cookieStore.set("supermarket_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return NextResponse.json({
      token,
      user,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Verification failed", details: error.message },
      { status: 500 }
    );
  }
}
