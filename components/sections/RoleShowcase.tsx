import React from "react";
import { AnimatedSection } from "@/components/ui/animated-section";

const roles = [
    {
        emoji: "🛒",
        title: "Customer",
        description: "Browse products, add to cart, and place orders for convenient in-store pickup.",
        color: "#D60000",
        link: "/login",
        cta: "Shop Now",
    },
    {
        emoji: "🧑‍💼",
        title: "Store Staff",
        description: "Manage orders, update inventory, and handle customer requests from the staff panel.",
        color: "#000000",
        link: "#",
        cta: "Staff Login",
    },
    {
        emoji: "📊",
        title: "Admin",
        description: "Full control over products, categories, pricing, orders, and store analytics.",
        color: "#000000",
        link: "#",
        cta: "Admin Panel",
    },
];

export function RoleShowcase() {
    return (
        <section className="bg-gray-50 py-20 lg:py-24">
            <div className="max-w-7xl mx-auto px-6">
                <AnimatedSection className="text-center mb-16">
                    <p className="text-[10px] items-center justify-center inline-flex gap-2 font-bold text-[#D60000] uppercase tracking-[0.2em] mb-4">
                        <span className="w-1 h-1 rounded-full bg-[#D60000]" />
                        Platform Roles
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight">
                        Built for Everyone
                    </h2>
                    <p className="mt-4 text-gray-400 font-medium max-w-sm mx-auto">
                        A unified experience tailored for customers, staff, and management.
                    </p>
                </AnimatedSection>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {roles.map((role, i) => (
                        <AnimatedSection key={role.title} delay={i * 80}>
                            <div className="group bg-white rounded-[2rem] border border-gray-100 p-10 hover:border-black hover:shadow-xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-500">
                                <div className="text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                                    {role.emoji}
                                </div>
                                <h3 className="font-bold text-xl text-black mb-3 tracking-tight">{role.title}</h3>
                                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                                    {role.description}
                                </p>
                                <a
                                    href={role.link}
                                    className="inline-flex items-center gap-2 text-xs font-bold text-black uppercase tracking-widest group-hover:text-[#D60000] transition-colors"
                                >
                                    {role.cta} <span className="text-[14px]">→</span>
                                </a>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
}
