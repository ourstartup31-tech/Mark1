import { Navbar } from "@/components/layout/Navbar";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";

import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { HowItWorks } from "@/components/sections/HowItWorks";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <CartDrawer />
      <Hero />

      <Categories />
      <FeaturedProducts />
      <HowItWorks />
      <Footer />
    </main>
  );
}
