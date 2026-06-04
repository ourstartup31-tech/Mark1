import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SearchResults } from "@/components/sections/SearchResults";
import { Suspense } from "react";

export const metadata = {
  title: "Search Results | SuperMarket",
  description: "Search for products in our store",
};

export default function SearchPage() {
  return (
    <main className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <div className="flex-1 pt-24 pb-16">
        <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6"><p className="text-gray-500">Loading search results...</p></div>}>
          <SearchResults />
        </Suspense>
      </div>
      <Footer />
    </main>
  );
}
