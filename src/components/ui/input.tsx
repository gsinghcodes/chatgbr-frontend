import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "flex h-11 w-full rounded-lg border border-[#33332d] bg-[#0d0d0b] px-3 py-2 text-sm text-[#f4f1ea] outline-none transition placeholder:text-[#66645d] focus:border-[#646458] disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
));

Input.displayName = "Input";
