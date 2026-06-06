import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata = {
  title: "About Us | SuperMarket",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 pt-32 pb-24 w-full">
        <h1 className="text-4xl font-medium text-black mb-8">Our Story</h1>
        <div className="prose prose-slate max-w-none text-gray-600">
          <p className="mb-4 text-lg">
            Welcome to SuperMarket. We started with a simple vision: to make everyday grocery shopping 
            effortless, fast, and highly reliable.
          </p>
          <p className="mb-4">
            Founded in 2026, we noticed a gap in the way local neighborhoods handled their daily needs. 
            Long checkout lines and out-of-stock surprises were frustrating. We decided to combine the 
            convenience of online ordering with the trust and immediacy of local pickup.
          </p>

          <h2 id="quality" className="text-2xl font-semibold text-black mt-12 mb-4">Quality Promise</h2>
          <p className="mb-4">
            We partner with the best local farmers and trusted brands to ensure everything you buy is fresh, 
            safe, and of the highest quality. If an item doesn't meet our strict standards, it never makes 
            it to our shelves—or your cart.
          </p>

          <h2 id="careers" className="text-2xl font-semibold text-black mt-12 mb-4">Careers</h2>
          <p className="mb-4">
            We're constantly looking for passionate individuals who care about food quality and community service. 
            If you want to be part of a fast-growing local team, please reach out via our contact page.
          </p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
