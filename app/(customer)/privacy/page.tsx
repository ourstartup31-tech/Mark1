import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | SuperMarket",
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full">
        <h1 className="text-4xl font-bold text-black mb-8">Privacy Policy</h1>
        <div className="prose prose-slate max-w-none text-gray-600">
          <p className="mb-4">Last Updated: June 2026</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">1. Information We Collect</h2>
          <p className="mb-4">We collect information you provide directly to us when you create an account, make a purchase, or communicate with us. This includes your name, email address, phone number, and delivery/pickup address.</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">We use the information we collect to fulfill your orders, communicate with you about our products, and improve our services.</p>
          <h2 id="cookies" className="text-2xl font-semibold text-black mt-8 mb-4">3. Cookie Policy</h2>
          <p className="mb-4">We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">4. Contact Us</h2>
          <p className="mb-4">If you have any questions about this Privacy Policy, please contact us at hello@supermarket.in.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
