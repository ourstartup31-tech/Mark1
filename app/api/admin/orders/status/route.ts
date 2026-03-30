import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PUT(req: NextRequest) {
  const { user, response } = await requireAdmin(req);
  if (response) return response;

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Verify order belongs to a store owned by this admin
    const order = await prisma.orders.findUnique({
      where: { id },
      include: { stores: true }
    });

    if (!order || !order.stores) {
      return NextResponse.json({ error: "Order or store not found" }, { status: 404 });
    }

    if (order.stores.owner_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to update order status", details: error.message },
      { status: 500 }
    );
  }
}
