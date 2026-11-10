import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QtyStepper({
  value,
  max,
  onChange,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
  size?: "sm" | "md";
  label?: string;
}) {
  const h = size === "sm" ? "h-8" : "h-12";
  return (
    <div
      className={cn("inline-flex items-center border border-border", h)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
        className={cn(
          "grid place-items-center text-ink transition hover:text-wine disabled:opacity-30",
          size === "sm" ? "w-8" : "w-11",
        )}
      >
        <Minus className="h-3.5 w-3.5" strokeWidth={1.4} />
      </button>
      <span
        className={cn("min-w-8 text-center tabular-nums", size === "sm" ? "text-sm" : "text-base")}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
        className={cn(
          "grid place-items-center text-ink transition hover:text-wine disabled:opacity-30",
          size === "sm" ? "w-8" : "w-11",
        )}
      >
        <Plus className="h-3.5 w-3.5" strokeWidth={1.4} />
      </button>
    </div>
  );
}
