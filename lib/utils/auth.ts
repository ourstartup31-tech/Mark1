import { redirect } from "next/navigation";

/**
 * Client-side role check helper
 * Use this in pages or components to enforce role-based access
 */
export function checkRole(userRole: string | null, requiredRole: "admin" | "superadmin" | "customer") {
  if (!userRole) {
    return redirect("/login");
  }

  if (userRole !== requiredRole) {
    // If admin is trying to access superadmin or customer is trying to access admin
    return redirect("/");
  }
}
