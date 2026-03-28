import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;

  return NextResponse.json({
    message: "Welcome to the Admin Dashboard API",
    admin: {
      id: user.id,
      phone: user.phone,
      role: user.role
    }
  });
}
