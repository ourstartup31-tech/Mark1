import { NextRequest, NextResponse } from "next/server";
import { requireSuperAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { user, response } = await requireSuperAdmin(req);
  if (response) return response;

  return NextResponse.json({
    message: "Welcome to the SuperAdmin System API",
    superAdmin: {
      id: user.id,
      phone: user.phone,
      role: user.role
    }
  });
}
