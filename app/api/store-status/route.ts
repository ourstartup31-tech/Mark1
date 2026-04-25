import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // For now, we take the first store as the default
    const store = await prisma.stores.findFirst({
      select: { is_active: true }
    });

    return NextResponse.json({ isActive: store?.is_active ?? true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
