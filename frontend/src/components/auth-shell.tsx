import type { ReactNode } from "react";
import { ShieldCheck, Lock, Headset } from "lucide-react";
import { Wordmark } from "@/components/wordmark";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas-soft lg:grid lg:grid-cols-[1fr_1.05fr]">
      <aside className="hidden flex-col justify-between bg-ink p-12 lg:flex">
        <Wordmark tone="light" />
        <div>
          <h2 className="display-mega text-5xl text-primary">Money moves safely here.</h2>
          <p className="mt-5 max-w-md text-canvas-soft/70">
            Every Emir Pay account is protected with encrypted sessions, transaction monitoring and
            round-the-clock human support.
          </p>
          <ul className="mt-10 space-y-4">
            {[
              [ShieldCheck, "Bank-grade encryption on every transaction"],
              [Lock, "Your wallet balance is never shared or sold"],
              [Headset, "24/7 support from a real Emir Pay team"],
            ].map(([Icon, text], i) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <li key={i} className="flex items-center gap-3 text-sm text-canvas-soft/80">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-canvas-soft/10 text-primary">
                    <I className="h-4 w-4" />
                  </span>
                  {text as string}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="text-xs text-canvas-soft/50">
          © {new Date().getFullYear()} Emir Pay · Kano State, Nigeria
        </p>
      </aside>

      <main className="flex min-h-screen flex-col items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center lg:hidden">
            <Wordmark />
          </div>
          <div className="surface-card p-7 sm:p-9">
            <p className="text-sm font-bold tracking-widest text-secondary uppercase">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-black">{title}</h1>
            <p className="mt-2 text-sm text-body">{subtitle}</p>
            <div className="mt-7">{children}</div>
          </div>
          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-body">
            <Lock className="h-3.5 w-3.5 text-secondary" /> Secured connection · Emir Pay never asks
            for your PIN
          </p>
        </div>
      </main>
    </div>
  );
}
