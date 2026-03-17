import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  try {
    const stores = await prisma.stores.findMany();
    return NextResponse.json(stores);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to fetch stores", details: error.message },
      { status: 500 }
    );
  }
}
