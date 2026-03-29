import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";
import { z } from "zod";

/**
 * GET /api/admin/admins
 * List all users with 'admin' role
 */
export async function GET(req: NextRequest) {
  try {
    const { user, response } = await requireSuperAdmin(req);
    if (response) return response;

    const admins = await prisma.users.findMany({
      where: {
        role: "admin"
      },
      orderBy: { created_at: "desc" },
      include: {
        assigned_store: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json(admins);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch admins", details: error.message },
      { status: 500 }
    );
  }
}

const createAdminSchema = z.object({
  phone: z.string().min(10, "Valid phone number required"),
  name: z.string().min(2, "Name is required"),
  store_id: z.string().uuid("Valid Store ID required"),
  role: z.literal("admin").default("admin")
});

/**
 * POST /api/admin/admins
 * Create or promote a user to admin
 */
export async function POST(req: NextRequest) {
  try {
    const { user, response } = await requireSuperAdmin(req);
    if (response) return response;

    const body = await req.json();
    const validated = createAdminSchema.parse(body);

    // Upsert admin: Find by phone, update role and store, or create new
    const admin = await prisma.users.upsert({
      where: { phone: validated.phone },
      update: {
        role: validated.role,
        store_id: validated.store_id,
        name: validated.name
      },
      create: {
        phone: validated.phone,
        name: validated.name,
        role: validated.role,
        store_id: validated.store_id
      }
    });

    return NextResponse.json(admin, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Failed to create admin", details: error.message },
      { status: 500 }
    );
  }
}
