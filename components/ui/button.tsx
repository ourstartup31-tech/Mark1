import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none active:scale-95",
    {
        variants: {
            variant: {
                default:
                    "bg-black text-white hover:bg-[#111111] shadow-md hover:shadow-lg hover:shadow-red-700/20",
                outline:
                    "border-2 border-black text-black bg-transparent hover:bg-black hover:text-white",
                ghost:
                    "text-black hover:bg-gray-100",
                white:
                    "bg-white text-black hover:bg-gray-50 shadow-md",
                "outline-white":
                    "border-2 border-white text-white bg-transparent hover:bg-white hover:text-black",
                icon:
                    "bg-transparent text-black hover:bg-gray-100 rounded-full",
            },
            size: {
                sm: "h-9 px-4 py-2 text-xs",
                default: "h-11 px-6 py-2.5",
                lg: "h-13 px-8 py-3 text-base",
                xl: "h-14 px-10 py-3.5 text-base",
                icon: "h-10 w-10 p-0",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> { }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
);
Button.displayName = "Button";

export { buttonVariants };
