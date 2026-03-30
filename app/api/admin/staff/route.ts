import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    if (!user || user.role !== "admin" || !user.store_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const staff = await prisma.users.findMany({
      where: {
        store_id: user.store_id,
        id: { not: user.id } // Exclude self
      },
      orderBy: { created_at: "desc" }
    });

    return NextResponse.json(staff);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    if (!user || user.role !== "admin" || !user.store_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, role } = body;

    if (!phone || !name) {
      return NextResponse.json({ error: "Email/Phone and Name required" }, { status: 400 });
    }

    const newStaff = await prisma.users.upsert({
      where: { phone },
      update: {
        name,
        role: role || "staff",
        store_id: user.store_id
      },
      create: {
        name,
        phone,
        role: role || "staff",
        store_id: user.store_id
      }
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to add staff" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getServerUser(req);
    if (!user || user.role !== "admin" || !user.store_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    const existing = await prisma.users.findUnique({ where: { id } });
    if (!existing || existing.store_id !== user.store_id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Remove staff from store (orphaning them)
    // Or we could delete them, but usually orphaning/soft-delete is safer
    await prisma.users.update({
      where: { id },
      data: { store_id: null, role: "user" }
    });

    return NextResponse.json({ message: "Staff removed" });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to remove staff" }, { status: 500 });
  }
}
