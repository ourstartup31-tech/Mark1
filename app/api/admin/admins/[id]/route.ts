import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { z } from "zod";

const updateAdminSchema = z.object({
  role: z.enum(["user", "admin", "superadmin"]).optional(),
  store_id: z.string().uuid().nullable().optional(),
});

/**
 * PATCH /api/admin/admins/[id]
 * Update admin role or store assignment
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireSuperAdmin(req);
    if (response) return response;

    const { id } = await params;
    const body = await req.json();
    const validated = updateAdminSchema.parse(body);

    const admin = await prisma.users.update({
      where: { id },
      data: validated
    });

    return NextResponse.json(admin);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update admin", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/admins/[id]
 * Remove an admin user
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user, response } = await requireSuperAdmin(req);
    if (response) return response;

    const { id } = await params;

    await prisma.users.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "Admin not found or already deleted" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete admin", details: error.message },
      { status: 500 }
    );
  }
}
