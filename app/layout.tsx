import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FreshMart – Fresh Groceries Delivered to Your Doorstep",
  description:
    "Order daily essentials from your trusted local supermarket. Fresh fruits, vegetables, dairy, snacks, and more delivered fast.",
  keywords: ["grocery delivery", "supermarket online", "fresh produce", "order groceries"],
};

import { AuthProvider } from "@/context/AuthContext";
import { AdminProvider } from "@/context/AdminContext";
import { ToastProvider } from "@/context/ToastContext";
import { SuperAdminProvider } from "@/context/SuperAdminContext";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>
            <SuperAdminProvider>
              <AdminProvider>
                <CartProvider>{children}</CartProvider>
              </AdminProvider>
            </SuperAdminProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
