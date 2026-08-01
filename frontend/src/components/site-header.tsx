import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { ActionAnchor, ActionLink } from "@/components/ui-kit";

const links = [
  { label: "Services", href: "#services" },
  { label: "About", href: "#about" },
  { label: "Leadership", href: "#leadership" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl">
      <nav
        className="flex items-center justify-between rounded-full border border-white/20 bg-white/60 px-4 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.08)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 sm:px-6"
        aria-label="Main"
      >
        <Wordmark />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <ActionLink to="/login" variant="ghost" size="sm">
            Log In
          </ActionLink>
          <ActionLink to="/signup" variant="primary" size="sm">
            Sign Up
          </ActionLink>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white/50 text-ink backdrop-blur transition-colors hover:bg-white/70 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {open ? (
        <div className="mt-2 overflow-hidden rounded-3xl border border-white/20 bg-white/70 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <ActionAnchor
                key={l.href}
                href={l.href}
                variant="ghost"
                size="sm"
                className="justify-start rounded-xl"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </ActionAnchor>
            ))}
            <div className="mt-3 grid grid-cols-2 gap-3">
              <ActionLink to="/login" variant="outline" size="sm">
                Log In
              </ActionLink>
              <ActionLink to="/signup" variant="primary" size="sm">
                Sign Up
              </ActionLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
