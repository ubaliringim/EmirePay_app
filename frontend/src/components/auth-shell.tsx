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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-canvas-soft lg:grid lg:grid-cols-[0.9fr_1.1fr]">
      <aside className="hidden min-h-screen flex-col justify-between bg-ink p-8 xl:p-12 lg:flex overflow-hidden">
        <Wordmark tone="light" />
        <div className="my-auto py-10">
          <h2 className="display-mega text-4xl xl:text-5xl text-primary">
            Money moves safely here.
          </h2>
          <p className="mt-4 max-w-md text-sm text-canvas-soft/70">
            Every Emir Pay account is protected with encrypted sessions, transaction monitoring and
            round-the-clock human support.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              [ShieldCheck, "Bank-grade encryption on every transaction"],
              [Lock, "Your wallet balance is never shared or sold"],
              [Headset, "24/7 support from a real Emir Pay team"],
            ].map(([Icon, text], i) => {
              const I = Icon as typeof ShieldCheck;
              return (
                <li key={i} className="flex items-center gap-3 text-sm text-canvas-soft/80">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-canvas-soft/10 text-primary shrink-0">
                    <I className="h-4.5 w-4.5" />
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

      <main className="flex min-h-screen w-full max-w-full flex-col items-center justify-center p-4 sm:p-6 lg:p-10 overflow-x-hidden">
        <div className="w-full max-w-md sm:max-w-lg my-auto">
          <div className="surface-card w-full max-w-full p-5 sm:p-7 shadow-lift overflow-hidden">
            <div className="mb-5 flex justify-center overflow-hidden">
              <Wordmark imgClassName="h-10 sm:h-12 max-w-full object-contain w-auto" />
            </div>
            <p className="text-xs font-bold tracking-widest text-secondary uppercase">{eyebrow}</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black">{title}</h1>
            <p className="mt-1.5 text-sm text-body">{subtitle}</p>
            <div className="mt-5">{children}</div>
          </div>
          <p className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-body">
            <Lock className="h-3.5 w-3.5 shrink-0 text-secondary" />
            <span>Secured connection · Emir Pay never asks for your PIN</span>
          </p>
        </div>
      </main>
    </div>
  );
}
