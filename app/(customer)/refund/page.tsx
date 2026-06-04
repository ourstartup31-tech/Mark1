import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Return & Refund Policy | SuperMarket",
};

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full">
        <h1 className="text-4xl font-bold text-black mb-8">Return & Refund Policy</h1>
        <div className="prose prose-slate max-w-none text-gray-600">
          <p className="mb-4">Last Updated: June 2026</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">1. Returns</h2>
          <p className="mb-4">We want you to be completely satisfied with your purchase. If you receive a damaged or incorrect item, please return it at the time of pickup or contact us within 24 hours of receiving your order.</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">2. Refunds</h2>
          <p className="mb-4">Once we inspect the returned item, we will notify you of the status of your refund. If approved, the refund will be initiated to your original method of payment within 5-7 business days.</p>
          <h2 className="text-2xl font-semibold text-black mt-8 mb-4">3. Non-Returnable Items</h2>
          <p className="mb-4">Perishable goods (such as fresh fruits, vegetables, dairy) cannot be returned once accepted at pickup, unless they were damaged or spoiled before handover.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
