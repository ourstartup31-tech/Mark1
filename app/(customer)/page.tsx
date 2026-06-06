import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";

import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { HowItWorks } from "@/components/sections/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />

      <FeaturedProducts />
      <HowItWorks />
      <Footer />
    </main>
  );
}
