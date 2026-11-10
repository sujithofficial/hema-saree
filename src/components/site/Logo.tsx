import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <Link
      to="/"
      aria-label="Hema Sarees — home"
      className={cn("group inline-flex flex-col items-center leading-none", className)}
    >
      <span
        className={cn(
          "font-display text-[1.65rem] tracking-[0.32em] pl-[0.32em] sm:text-[1.9rem]",
          light ? "text-ivory" : "text-wine",
        )}
      >
        HEMA
      </span>
      <span className="mt-1 flex items-center gap-2">
        <span className={cn("h-px w-4", light ? "bg-gold-soft" : "bg-gold")} />
        <span
          className={cn(
            "eyebrow text-[0.55rem] tracking-[0.5em] pl-[0.5em]",
            light ? "text-gold-soft" : "text-gold",
          )}
        >
          Sarees
        </span>
        <span className={cn("h-px w-4", light ? "bg-gold-soft" : "bg-gold")} />
      </span>
    </Link>
  );
}
