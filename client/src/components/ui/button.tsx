import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-blue-400/60 aria-invalid:ring-red-500/30 aria-invalid:border-red-500 cursor-pointer select-none",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_0_16px_rgba(59,130,246,0.35),inset_0_1px_0_rgba(255,255,255,0.15)] hover:from-blue-500 hover:to-blue-400 hover:shadow-[0_0_28px_rgba(59,130,246,0.55),inset_0_1px_0_rgba(255,255,255,0.2)] active:scale-[0.97] active:shadow-none",
        destructive:
          "bg-gradient-to-r from-red-700 to-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)] hover:from-red-600 hover:to-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)] active:scale-[0.97]",
        outline:
          "bg-[#050d1f]/80 border border-blue-700/60 text-white hover:border-blue-400 hover:bg-[#0a1628] hover:shadow-[0_0_14px_rgba(59,130,246,0.25)] active:scale-[0.97]",
        secondary:
          "bg-[#0a1628]/90 border border-blue-800/40 text-blue-100 hover:border-blue-600/60 hover:bg-[#0d1f3a] hover:text-white active:scale-[0.97]",
        ghost:
          "text-blue-300 hover:bg-blue-900/30 hover:text-white hover:shadow-[inset_0_0_12px_rgba(59,130,246,0.1)] active:scale-[0.97]",
        link: "text-blue-400 underline-offset-4 hover:underline hover:text-blue-300 p-0 h-auto",
        gold:
          "bg-gradient-to-r from-yellow-500 to-amber-400 text-black font-black shadow-[0_0_16px_rgba(234,179,8,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] hover:from-yellow-400 hover:to-amber-300 hover:shadow-[0_0_28px_rgba(234,179,8,0.6)] active:scale-[0.97]",
      },
      size: {
        default: "h-11 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-xs",
        lg: "h-12 rounded-xl px-8 has-[>svg]:px-6 text-base",
        xl: "h-14 rounded-2xl px-10 has-[>svg]:px-8 text-lg font-black",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
