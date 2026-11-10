import { cn } from "@/lib/utils";
import { discountPercent, formatINR } from "@/lib/format";
import { stockLabel, stockStatus } from "@/lib/catalog";

export function Price({
  price,
  mrp,
  size = "md",
  className,
}: {
  price: number;
  mrp?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const off = discountPercent(price, mrp);
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2.5 gap-y-1", className)}>
      <span
        className={cn(
          "text-ink",
          size === "lg"
            ? "font-display text-3xl"
            : size === "md"
              ? "text-[0.95rem] font-medium"
              : "text-sm font-medium",
        )}
      >
        {formatINR(price)}
      </span>
      {off > 0 && (
        <>
          <span
            className={cn(
              "text-muted-foreground line-through",
              size === "lg" ? "text-base" : "text-xs",
            )}
          >
            {formatINR(mrp!)}
          </span>
          <span
            className={cn(
              "text-wine",
              size === "lg" ? "eyebrow" : "text-[0.7rem] font-medium tracking-wide",
            )}
          >
            {off}% off
          </span>
        </>
      )}
    </div>
  );
}

export function StockIndicator({ stock, className }: { stock: number; className?: string }) {
  const s = stockStatus(stock);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[0.72rem] tracking-wide",
        s === "sold-out" && "text-muted-foreground",
        s === "low" && "text-warning",
        s === "in-stock" && "text-success",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          s === "sold-out" && "bg-muted-foreground",
          s === "low" && "bg-warning",
          s === "in-stock" && "bg-success",
        )}
      />
      {stockLabel(stock)}
    </span>
  );
}
