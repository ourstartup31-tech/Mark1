import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const sendOtpSchema = z.object({
  phone: z.string().min(10, "Phone number is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone } = sendOtpSchema.parse(body);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Save/Update OTP in database
    await prisma.otp_codes.create({
      data: {
        phone,
        otp,
        expires_at: expiresAt,
      },
    });

    // In production, you would send this via SMS provider
    return NextResponse.json({
      message: "OTP sent successfully",
      otp, // Returning OTP for testing as requested
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to send OTP", details: error.message },
      { status: 500 }
    );
  }
}
