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
    <div className="h-screen max-h-screen w-full bg-canvas-soft overflow-hidden lg:grid lg:grid-cols-[1fr_1.05fr]">
      <aside className="hidden h-screen flex-col justify-between bg-ink p-8 xl:p-12 lg:flex overflow-hidden">
        <Wordmark tone="light" />
        <div>
          <h2 className="display-mega text-4xl xl:text-5xl text-primary">Money moves safely here.</h2>
          <p className="mt-4 max-w-md text-xs sm:text-sm text-canvas-soft/70">
            Every Emir Pay account is protected with encrypted sessions, transaction monitoring and
            round-the-clock human support.
          </p>
          <ul className="mt-8 space-y-3">
            {[
              [ShieldCheck, "Bank-grade encryption on every transaction"],
              [Lock, "Your wallet balance is never shared or sold"],
              [Headset, "24/7 support from a real Emir Pay team"],
            ].map(([Icon, text], i) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <li key={i} className="flex items-center gap-3 text-xs sm:text-sm text-canvas-soft/80">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-canvas-soft/10 text-primary shrink-0">
                    <I className="h-4 w-4" />
                  </span>
                  {text as string}
                </li>
              );
            })}
          </ul>
        </div>
        <p className="text-xs text-canvas-soft/50">
          © {new Date().getFullYear()} Emir Pay · Created by Teamstack Technologies Ltd
        </p>
      </aside>

      <main className="flex h-screen max-h-screen flex-col items-center justify-center p-3 sm:p-4 overflow-hidden">
        <div className="w-full max-w-[420px] my-auto">
          <div className="mb-3 flex justify-center lg:hidden">
            <Wordmark />
          </div>
          <div className="surface-card p-4 sm:p-5">
            <p className="text-[11px] font-bold tracking-widest text-secondary uppercase">{eyebrow}</p>
            <h1 className="mt-0.5 text-xl font-black">{title}</h1>
            <p className="mt-1 text-xs text-body">{subtitle}</p>
            <div className="mt-3">{children}</div>
          </div>
          <p className="mt-3 flex flex-wrap items-center justify-center gap-1 text-center text-[11px] text-body">
            <Lock className="h-3 w-3 shrink-0 text-secondary" />
            <span>Secured connection · Emir Pay never asks for your PIN</span>
          </p>
        </div>
      </main>
    </div>
  );
}
