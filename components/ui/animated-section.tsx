"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "left" | "right" | "scale";

interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    threshold?: number;
    direction?: Direction;
    once?: boolean;
}

const hiddenClass: Record<Direction, string> = {
    up: "section-hidden",
    left: "section-hidden section-hidden-left",
    right: "section-hidden section-hidden-right",
    scale: "section-hidden",
};

export function AnimatedSection({
    children,
    className,
    delay = 0,
    threshold = 0.12,
    direction = "up",
    once = true,
}: AnimatedSectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.disconnect();
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, once]);

    return (
        <div
            ref={ref}
            className={cn(
                hiddenClass[direction],
                visible && "section-visible",
                className
            )}
            style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
}
