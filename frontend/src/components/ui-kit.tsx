import { cva, type VariantProps } from "class-variance-authority";
import { Link } from "react-router-dom";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const actionVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-primary text-ink hover:bg-primary-active shadow-card",
        secondary: "bg-secondary text-canvas hover:bg-ink-deep",
        dark: "bg-ink text-primary hover:bg-ink-deep",
        outline: "bg-canvas text-ink border border-ink hover:bg-canvas-soft",
        ghost: "text-ink hover:bg-canvas-soft",
      },
      size: {
        md: "px-6 py-3 text-base",
        sm: "px-4 py-2 text-sm",
        lg: "px-8 py-4 text-base",
        block: "w-full px-6 py-3.5 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ActionProps = VariantProps<typeof actionVariants>;

export function ActionButton({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"button"> & ActionProps) {
  return <button className={cn(actionVariants({ variant, size }), className)} {...props} />;
}

export function ActionLink({
  className,
  variant,
  size,
  ...props
}: ComponentProps<typeof Link> & ActionProps) {
  return <Link className={cn(actionVariants({ variant, size }), className)} {...props} />;
}

export function ActionAnchor({
  className,
  variant,
  size,
  ...props
}: ComponentProps<"a"> & ActionProps) {
  return <a className={cn(actionVariants({ variant, size }), className)} {...props} />;
}

export function Field({
  label,
  hint,
  className,
  id,
  ...props
}: ComponentProps<"input"> & { label: string; hint?: string }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {label}
      </label>
      <input id={id} className={cn("field-input", className)} {...props} />
      {hint ? <p className="text-xs text-mute">{hint}</p> : null}
    </div>
  );
}
