import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_for_dev_only";

interface JWTPayload {
  userId: string;
  phone: string;
  role: string;
}

import { cookies } from "next/headers";

export async function getServerUser(req: NextRequest) {
  try {
    let token: string | undefined;

    // 1. Check Authorization header
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } 
    
    // 2. Fallback to cookies
    if (!token) {
      const cookieStore = await cookies();
      token = cookieStore.get("supermarket_token")?.value;
      if (token) console.log("Auth: Token found in cookies");
    }

    // 3. Verify
    if (!token) {
      console.log("Auth: No token found in headers or cookies");
      return null;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      console.log("Auth: Token is valid but user not found in DB", decoded.userId);
    } else {
      console.log(`Auth: Authenticated user ${user.phone} (${user.role})`);
    }

    return user;
  } catch (error: any) {
    console.error("Auth: Error verifying token", error.message);
    return null;
  }
}

export async function requireAuth(req: NextRequest) {
  const user = await getServerUser(req);
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, response: null };
}

export async function requireRole(req: NextRequest, allowedRoles: string[]) {
  const { user, response } = await requireAuth(req);
  if (response) return { user: null, response };

  if (!allowedRoles.includes(user.role)) {
    return { 
      user: null, 
      response: NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 }) 
    };
  }

  return { user, response: null };
}

export async function requireAdmin(req: NextRequest) {
  return requireRole(req, ["admin", "superadmin"]);
}

export async function requireSuperAdmin(req: NextRequest) {
  return requireRole(req, ["superadmin"]);
}

/**
 * Helper to get store access context for a user
 */
export async function getUserStoreAccess(req: NextRequest) {
  const user = await getServerUser(req);
  if (!user) return { user: null, canAccessAll: false, storeId: null };

  if (user.role === "superadmin") {
    return { user, canAccessAll: true, storeId: null };
  }

  if (user.role === "admin") {
    return { user, canAccessAll: false, storeId: user.store_id };
  }

  return { user, canAccessAll: false, storeId: null };
}
