import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <div className={cn("inline-flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[#6541F5] text-white shadow-sm shadow-[#6541F5]/20">
        {/* Orbital SVG with star and open book inspiration */}
        <svg viewBox="0 0 32 32" className="h-5.5 w-5.5 shrink-0" aria-hidden="true">
          <ellipse cx="16" cy="16" rx="12" ry="5.5" fill="none" stroke="#D8D5FF" strokeWidth="1.5" strokeDasharray="3 1.5" transform="rotate(-28 16 16)" />
          <path d="M12 20C13.5 19 15 19 16 19.5C17 19 18.5 19 20 20V12C18.5 11 17 11 16 11.5C15 11 13.5 11 12 12V20Z" fill="#FFFFFF" />
          <path d="M16 11.5V19.5" stroke="#5230E8" strokeWidth="1" />
          <circle cx="23" cy="11" r="2" fill="#F4B942" />
          <circle cx="9" cy="21" r="1.3" fill="#D8D5FF" />
        </svg>
      </div>
      <div className="flex flex-col">
        <span className={cn("font-display text-[17px] font-bold tracking-tight leading-tight text-foreground", inverse && "text-primary-foreground")}>
          Vidya<span className="text-[#6541F5] dark:text-[#7C5CFA]">Verse</span>
        </span>
        <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase -mt-0.5">
          A Universe of Learning
        </span>
      </div>
    </div>
  );
}

export function DemoTag({ children = "Demo profile", className }: { children?: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-md border border-[#D8D5FF] bg-[#D8D5FF]/35 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#5230E8] dark:border-[#7C5CFA]/30 dark:bg-[#7C5CFA]/15 dark:text-[#D8D5FF]", className)}>
      {children}
    </span>
  );
}

export function NetworkTag({ status = "online", className }: { status?: "online" | "mesh" | "offline"; className?: string }) {
  const cfg = {
    online: { label: "Browser online · Demo mode", border: "border-[#31B98A]/30", bg: "bg-[#31B98A]/10", text: "text-[#31B98A]" },
    mesh: { label: "School Mesh · Demo mode", border: "border-[#6541F5]/30", bg: "bg-[#6541F5]/10", text: "text-[#6541F5] dark:text-[#7C5CFA]" },
    offline: { label: "Browser offline · Demo mode", border: "border-[#F4B942]/30", bg: "bg-[#F4B942]/10", text: "text-[#d97706] dark:text-[#F4B942]" },
  }[status];

  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium", cfg.border, cfg.bg, cfg.text, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {cfg.label}
    </span>
  );
}

export function PageHeader({ title, description, actions, eyebrow }: { title: string; description?: ReactNode; actions?: ReactNode; eyebrow?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border pb-5">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-bold text-foreground md:text-3xl tracking-tight flex items-center gap-3">
          {title}
        </h1>
        {description && <p className="mt-1.5 max-w-2xl text-[14px] text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className, as: As = "section" }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; as?: "section" | "div" | "article" }) {
  return (
    <As className={cn("card-surface p-5 bg-card text-card-foreground border-border shadow-sm", className)}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-border pb-3">
          {title && <h2 className="text-[16px] font-semibold text-foreground flex items-center gap-2">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </As>
  );
}

export function Meter({ value, tone = "primary", label, className }: { value: number; tone?: "primary" | "teal" | "blue" | "green" | "pink" | "orange" | "purple" | "success" | "warning" | "cyan" | "saffron"; label: string; className?: string }) {
  const v = Math.max(0, Math.min(100, value));
  const fill = tone === "blue"
    ? "bg-[#42A5E8]"
    : tone === "teal"
    ? "bg-[#19B99A]"
    : tone === "green" || tone === "success"
    ? "bg-[#28B987]"
    : tone === "pink"
    ? "bg-[#E95778]"
    : tone === "orange" || tone === "warning" || tone === "saffron"
    ? "bg-[#F5A623]"
    : "bg-[#6541F5]";
  return (
    <div role="progressbar" aria-label={label} aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} className={cn("h-2 w-full overflow-hidden rounded-full bg-muted border border-border/50", className)}>
      <div className={cn("h-full rounded-full transition-all duration-500", fill)} style={{ width: `${v}%` }} />
    </div>
  );
}

export function SimNote({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-dashed border-[#EAE7FF] dark:border-[#2A2A3E] bg-[#EAE7FF]/30 dark:bg-[#1A1A28] px-3.5 py-2.5 text-xs text-muted-foreground flex items-center gap-2">
      <span className="inline-block h-2 w-2 rounded-full bg-[#6541F5]" />
      <div>
        <span className="font-semibold text-foreground">VidyaVerse Prototype: </span>
        {children}
      </div>
    </div>
  );
}

export function IconBox({ children, tone = "primary" }: { children: ReactNode; tone?: "primary" | "teal" | "blue" | "green" | "pink" | "orange" | "purple" | "success" | "warning" | "cyan" | "saffron" }) {
  const cls = tone === "blue"
    ? "bg-[#DDF2FC] text-[#42A5E8] border border-[#DDF2FC] dark:bg-[#42A5E8]/15 dark:text-[#42A5E8] dark:border-[#42A5E8]/30"
    : tone === "teal"
    ? "bg-[#DDF8EE] text-[#19B99A] border border-[#DDF8EE] dark:bg-[#19B99A]/15 dark:text-[#19B99A] dark:border-[#19B99A]/30"
    : tone === "green" || tone === "success"
    ? "bg-[#DDF8EE] text-[#28B987] border border-[#DDF8EE] dark:bg-[#28B987]/15 dark:text-[#28B987] dark:border-[#28B987]/30"
    : tone === "pink"
    ? "bg-[#FCE5EB] text-[#E95778] border border-[#FCE5EB] dark:bg-[#E95778]/15 dark:text-[#E95778] dark:border-[#E95778]/30"
    : tone === "orange" || tone === "warning" || tone === "saffron"
    ? "bg-[#FFF0D5] text-[#F5A623] border border-[#FFF0D5] dark:bg-[#F5A623]/15 dark:text-[#F5A623] dark:border-[#F5A623]/30"
    : "bg-[#EAE7FF] text-[#6541F5] border border-[#EAE7FF] dark:bg-[#7C5CFA]/15 dark:text-[#7C5CFA] dark:border-[#7C5CFA]/30";
  return <span className={cn("inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl [&_svg]:h-5 [&_svg]:w-5 shadow-sm", cls)}>{children}</span>;
}
