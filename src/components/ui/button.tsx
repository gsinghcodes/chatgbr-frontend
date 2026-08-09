import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#ece6d8] text-[#151513] hover:bg-[#fffaf0]",
        ghost:
          "text-[#aaa79e] hover:bg-[#242420] hover:text-[#f4f1ea]",
        subtle:
          "border border-[#30302a] bg-[#191916] text-[#d9d5ca] hover:border-[#4b4b42] hover:bg-[#22221e]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({ className, variant, size, ...props }, ref) => (
  <button
    className={cn(buttonVariants({ variant, size }), className)}
    ref={ref}
    {...props}
  />
));

Button.displayName = "Button";
