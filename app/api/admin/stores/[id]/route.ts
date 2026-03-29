import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { z } from "zod";

const updateStoreSchema = z.object({
  is_active: z.boolean(),
});

/**
 * PATCH /api/admin/stores/[id]
 * Toggle store active status (Superadmin only)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { user, response } = await requireSuperAdmin(req);
    if (response) return response;

    const { id } = await params;
    const body = await req.json();
    const { is_active } = updateStoreSchema.parse(body);

    const store = await prisma.stores.update({
      where: { id },
      data: { is_active }
    });

    return NextResponse.json(store);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to update store", details: error.message },
      { status: 500 }
    );
  }
}
