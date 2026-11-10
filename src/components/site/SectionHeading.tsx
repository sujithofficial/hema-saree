import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  aside,
  className,
  light,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  aside?: ReactNode;
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}
    >
      <div className="max-w-2xl">
        <p
          className={cn("eyebrow flex items-center gap-3", light ? "text-gold-soft" : "text-gold")}
        >
          {index && (
            <span className="font-display text-sm tracking-normal normal-case italic">{index}</span>
          )}
          <span className={cn("h-px w-8", light ? "bg-gold-soft/60" : "bg-gold/60")} />
          {eyebrow}
        </p>
        <h2 className={cn("display-lg mt-4 text-balance", light ? "text-ivory" : "text-ink")}>
          {title}
        </h2>
      </div>
      {aside && <div className="md:pb-2">{aside}</div>}
    </div>
  );
}
