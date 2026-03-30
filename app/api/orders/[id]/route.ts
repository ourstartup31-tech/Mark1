import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin, getUserStoreAccess, getServerUser } from "@/lib/auth";
import { z } from "zod";

const updateStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "ready", "completed", "cancelled"]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getServerUser(req);
    
    // 1. Only allow admin
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status } = updateStatusSchema.parse(body);

    // 2. Fetch order to verify ownership
    const order = await prisma.orders.findUnique({
      where: { id }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.store_id !== user.store_id) {
      return NextResponse.json({ error: "Forbidden: You do not manage this store" }, { status: 403 });
    }

    // 3. Update status and timestamps
    const updateData: any = { status };
    
    // Add logic for status flow? (optional but good practice)
    // For now, allow any valid status change by admin
    
    // Optional timestamps (if columns exist in future, but for now we'll just log)
    // if (status === "confirmed") updateData.confirmed_at = new Date();
    // if (status === "completed") updateData.completed_at = new Date();

    const updatedOrder = await prisma.orders.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update order status", details: error.message },
      { status: 500 }
    );
  }
}
