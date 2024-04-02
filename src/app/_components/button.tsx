import { cva, type VariantProps } from "class-variance-authority";
import { type ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const buttonClasses = cva(["transition-colors"], {
    variants: {
        size: {
            default: ["rounded-md", "p-2"],
            icon: ["rounded-full", "size-10", "flex", "justify-center", "items-center", "p-2.5"],
        },
        variant: {
            default: ["bg-secondary", "hover:bg-secondary-hover"],
            ghosted: ["hover:bg-gray-200"],
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    }
})

type buttonProps = VariantProps<typeof buttonClasses> & ComponentProps<"button">
export default function Button({ variant = "default", size = "default", className, ...props }: buttonProps) {
    return (
        <button {...props} className={twMerge(buttonClasses({ size, variant }), className)} />
    );
}