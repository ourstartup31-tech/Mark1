import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "Contact Us | SuperMarket",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full">
        <h1 className="text-4xl font-medium text-black mb-8">Contact Us</h1>
        <div className="bg-white rounded-2xl p-8 border border-gray-100  max-w-2xl">
          <p className="text-gray-600 mb-8 text-lg">
            We'd love to hear from you. Whether you have a question about an order, 
            need help with the platform, or just want to share feedback, our team is ready to assist.
          </p>

          <div className="space-y-6">
            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Store Address</h2>
              <p className="text-black font-semibold text-lg">123 Market Street, City</p>
            </div>
            
            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Phone Number</h2>
              <p className="text-black font-semibold text-lg">+91 98765 43210</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Email Address</h2>
              <p className="text-black font-semibold text-lg">hello@supermarket.in</p>
            </div>

            <div>
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-widest mb-2">Pickup & Store Hours</h2>
              <p className="text-gray-600">Monday - Sunday: 8:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
