import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, getUserStoreAccess } from "@/lib/auth";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, storeId, canAccessAll } = await getUserStoreAccess(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  try {
    // Verify ownership
    const store = await prisma.stores.findUnique({
      where: { id }
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    // Role-based oversight
    if (!canAccessAll && store.id !== storeId) {
      return NextResponse.json({ error: "Forbidden: You do not own this store" }, { status: 403 });
    }

    const body = await req.json();
    // Prevent changing owner_id via PUT unless superadmin
    if (user.role !== "superadmin") {
      delete body.owner_id;
    }

    const updatedStore = await prisma.stores.update({
      where: { id },
      data: body
    });

    return NextResponse.json(updatedStore);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update store", details: error.message },
      { status: 500 }
    );
  }
}
