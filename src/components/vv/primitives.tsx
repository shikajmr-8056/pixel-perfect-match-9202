import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg viewBox="0 0 32 32" className="h-8 w-8 shrink-0" aria-hidden="true">
        <rect width="32" height="32" rx="8" className={inverse ? "fill-primary-foreground" : "fill-primary"} />
        <ellipse cx="16" cy="16" rx="11" ry="5" fill="none" strokeWidth="1.6" className="stroke-teal" transform="rotate(-25 16 16)" />
        <circle cx="16" cy="16" r="4" className="fill-saffron" />
        <circle cx="25" cy="11.5" r="1.8" className="fill-teal" />
      </svg>
      <span className={cn("font-display text-lg font-semibold tracking-tight", inverse ? "text-primary-foreground" : "text-primary")}>
        VidyaVerse
      </span>
    </span>
  );
}

export function DemoTag({ children = "Demo data", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border border-dashed border-saffron-strong/40 bg-saffron-soft px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-saffron-strong", className)}>
      {children}
    </span>
  );
}

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-[26px] font-semibold text-foreground md:text-[30px]">{title}</h1>
        {description && <p className="mt-1.5 max-w-2xl text-[15px] text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className, as: As = "section" }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; as?: "section" | "div" | "article" }) {
  return (
    <As className={cn("card-surface p-5", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title && <h2 className="text-[17px] font-semibold text-foreground">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </As>
  );
}

export function Meter({ value, tone = "teal", label, className }: { value: number; tone?: "teal" | "saffron" | "primary"; label: string; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  const fill = tone === "teal" ? "bg-teal" : tone === "saffron" ? "bg-saffron" : "bg-primary";
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}>
      <div className={cn("h-full rounded-full transition-[width] duration-500", fill)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function SimNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 rounded-lg border border-dashed border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">Prototype note: </span>
      {children}
    </p>
  );
}

export function IconBox({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "teal" | "saffron" }) {
  const cls = tone === "teal" ? "bg-teal-soft text-teal-strong" : tone === "saffron" ? "bg-saffron-soft text-saffron-strong" : "bg-primary-soft text-primary";
  return <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&_svg]:h-5 [&_svg]:w-5", cls)}>{children}</span>;
}
