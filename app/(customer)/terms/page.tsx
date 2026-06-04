import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service | SuperMarket",
};

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full">
        <h1 className="text-4xl font-bold text-black mb-8">Terms of Service</h1>
        <div className="prose prose-slate max-w-none text-gray-600">
          <p className="mb-4">Last Updated: June 2026</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">2. Purchases and Payments</h2>
          <p className="mb-4">All prices are inclusive of applicable taxes unless stated otherwise. We reserve the right to refuse or cancel any order for any reason, including errors in product pricing or availability.</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">3. Pickup Rules</h2>
          <p className="mb-4">Orders must be picked up during the selected timeslot. Failure to pick up your order may result in order cancellation without refund, especially for perishable items.</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">4. Liability</h2>
          <p className="mb-4">Our liability for any claim related to your purchase shall not exceed the purchase price of the items in question.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
