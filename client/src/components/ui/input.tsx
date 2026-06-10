import { useDialogComposition } from "@/components/ui/dialog";
import { useComposition } from "@/hooks/useComposition";
import { cn } from "@/lib/utils";
import * as React from "react";

function Input({
  className,
  type,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  ...props
}: React.ComponentProps<"input">) {
  // Get dialog composition context if available (will be no-op if not inside Dialog)
  const dialogComposition = useDialogComposition();

  // Add composition event handlers to support input method editor (IME) for CJK languages.
  const {
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onKeyDown: handleKeyDown,
  } = useComposition<HTMLInputElement>({
    onKeyDown: (e) => {
      // Check if this is an Enter key that should be blocked
      const isComposing = (e.nativeEvent as any).isComposing || dialogComposition.justEndedComposing();

      // If Enter key is pressed while composing or just after composition ended,
      // don't call the user's onKeyDown (this blocks the business logic)
      if (e.key === "Enter" && isComposing) {
        return;
      }

      // Otherwise, call the user's onKeyDown
      onKeyDown?.(e);
    },
    onCompositionStart: e => {
      dialogComposition.setComposing(true);
      onCompositionStart?.(e);
    },
    onCompositionEnd: e => {
      // Mark that composition just ended - this helps handle the Enter key that confirms input
      dialogComposition.markCompositionEnd();
      // Delay setting composing to false to handle Safari's event order
      // In Safari, compositionEnd fires before the ESC keydown event
      setTimeout(() => {
        dialogComposition.setComposing(false);
      }, 100);
      onCompositionEnd?.(e);
    },
  });

  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Premium dark glass input — AthlynX style
        "h-11 w-full min-w-0 rounded-xl border px-4 py-2.5 text-base md:text-sm",
        "bg-[#0a1628] border-blue-600/70 text-white font-medium",
        "caret-blue-400 placeholder:text-blue-400/50",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),inset_0_0_0_1px_rgba(59,130,246,0.06)]",
        "transition-all duration-200 outline-none",
        "hover:border-blue-500/80 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_0_8px_rgba(59,130,246,0.12)]",
        "focus:border-blue-400 focus:shadow-[inset_0_2px_4px_rgba(0,0,0,0.7),0_0_0_3px_rgba(59,130,246,0.4),0_0_20px_rgba(59,130,246,0.25)]",
        "selection:bg-blue-600 selection:text-white",
        "file:text-white file:border-0 file:bg-transparent file:text-sm file:font-medium",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/30",
        className
      )}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onKeyDown={handleKeyDown}
      {...props}
    />
  );
}

export { Input };
