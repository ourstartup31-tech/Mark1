import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    if (!user || (user.role !== "admin" && user.role !== "superadmin") || !user.store_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const store = await prisma.stores.findUnique({
      where: { id: user.store_id },
      select: { is_active: true }
    });

    return NextResponse.json(
      { isActive: store?.is_active ?? true },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    if (!user || (user.role !== "admin" && user.role !== "superadmin") || !user.store_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { isActive } = body;

    const store = await prisma.stores.update({
      where: { id: user.store_id },
      data: { is_active: isActive }
    });

    return NextResponse.json(
      { isActive: store.is_active },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
