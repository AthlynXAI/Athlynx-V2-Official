import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-h-[100px] rounded-xl border px-4 py-3 text-base md:text-sm",
        "bg-[#050d1f]/90 border-blue-700/60 text-white",
        "caret-blue-400 placeholder:text-blue-400/50",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(59,130,246,0.06)]",
        "transition-all duration-200 outline-none resize-none",
        "hover:border-blue-500/80",
        "focus:border-blue-400 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_0_0_3px_rgba(59,130,246,0.4),0_0_20px_rgba(59,130,246,0.25)]",
        "selection:bg-blue-600 selection:text-white",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/30",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
