import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createStoreSchema = z.object({
  name: z.string().min(2, "Store name is required"),
  city: z.string().min(2, "City is required"),
  adminName: z.string().optional(),
  adminPhone: z.string().optional(),
});

/**
 * GET /api/admin/stores
 * List all stores for superadmin
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireSuperAdmin(req);
    if (response) return response;

    const stores = await prisma.stores.findMany({
      orderBy: { created_at: "desc" },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            phone: true
          }
        }
      }
    });

    return NextResponse.json(stores);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch stores", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/stores
 * Create a new store (Superadmin only)
 */
export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireSuperAdmin(req);
    if (response) return response;

    const body = await req.json();
    console.log("POST /api/admin/stores - Request Body:", body);
    
    const validated = createStoreSchema.parse(body);
    console.log("POST /api/admin/stores - Data Validated:", validated);

    const result = await prisma.$transaction(async (tx) => {
      let assignedOwnerId = user.id;

      // 1. Handle optional store admin creation/assignment
      if (validated.adminPhone) {
        console.log("POST /api/admin/stores - Process Admin:", validated.adminPhone);
        const admin = await tx.users.upsert({
          where: { phone: validated.adminPhone },
          update: {
            name: validated.adminName || "Store Admin",
            role: "admin"
          },
          create: {
            phone: validated.adminPhone,
            name: validated.adminName || "Store Admin",
            role: "admin"
          }
        });
        assignedOwnerId = admin.id;
        console.log("POST /api/admin/stores - Admin Assigned (ID):", assignedOwnerId);
      }

      // 2. Create the store
      console.log("POST /api/admin/stores - Creating store record...");
      const store = await tx.stores.create({
        data: {
          name: validated.name,
          city: validated.city,
          owner_id: assignedOwnerId,
          is_active: true
        }
      });
      console.log("POST /api/admin/stores - Store created (ID):", store.id);

      // 3. If an admin was assigned, link them to the store as their workplace
      if (validated.adminPhone) {
        console.log("POST /api/admin/stores - Linking admin to store_id...");
        await tx.users.update({
          where: { id: assignedOwnerId },
          data: { store_id: store.id }
        });
      }

      return store;
    });

    console.log("POST /api/admin/stores - Transaction COMPLETED successfully.");
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/admin/stores - FAILED:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create store", details: error.message },
      { status: 500 }
    );
  }
}
