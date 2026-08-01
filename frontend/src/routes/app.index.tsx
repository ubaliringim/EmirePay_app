import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Plus, ArrowRight } from "lucide-react";
import { AppShell, SectionCard } from "@/components/app-shell";
import { ActionButton, ActionLink } from "@/components/ui-kit";
import { CopyButton, FundWalletDialog } from "@/components/fund-wallet-dialog";
import { useWallet } from "@/lib/wallet-store";
import { naira, serviceMeta, statusTone, type ServiceId } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const serviceColors: Record<ServiceId, { bg: string; text: string; hover: string }> = {
  airtime: { bg: "bg-emerald-100", text: "text-emerald-600", hover: "hover:bg-emerald-50" },
  data: { bg: "bg-sky-100", text: "text-sky-600", hover: "hover:bg-sky-50" },
  electricity: { bg: "bg-amber-100", text: "text-amber-600", hover: "hover:bg-amber-50" },
  "cable-tv": { bg: "bg-violet-100", text: "text-violet-600", hover: "hover:bg-violet-50" },
  "airtime-to-cash": { bg: "bg-rose-100", text: "text-rose-600", hover: "hover:bg-rose-50" },
  "education-pin": { bg: "bg-teal-100", text: "text-teal-600", hover: "hover:bg-teal-50" },
  "wallet-funding": { bg: "bg-orange-100", text: "text-orange-600", hover: "hover:bg-orange-50" },
};

export function Dashboard() {
  const { balance, transactions, profile } = useWallet();
  const [show, setShow] = useState(true);
  const [fundOpen, setFundOpen] = useState(false);

  return (
    <AppShell title={`Hello, ${profile.firstName}`} subtitle="Here's what's happening today.">
      <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-3">
        <div className="rounded-3xl bg-ink p-6 text-canvas-soft shadow-lift lg:col-span-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-widest text-primary uppercase">
                Wallet balance
              </p>
              <div className="mt-2 flex items-center gap-3">
                <p className="display-mega text-4xl text-canvas sm:text-5xl">
                  {show ? naira(balance) : "₦ • • • • • •"}
                </p>
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-canvas-soft/10 text-primary"
                  aria-label={show ? "Hide balance" : "Show balance"}
                >
                  {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="mt-2 text-sm text-canvas-soft/60">
                Available to spend · updated just now
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
            <div className="rounded-2xl bg-canvas-soft/8 p-4">
              <p className="text-xs font-bold tracking-widest text-canvas-soft/60 uppercase">
                Your virtual account
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-3">
                <p className="text-xl font-black text-canvas">{profile.virtualAccount}</p>
                <CopyButton value={profile.virtualAccount} label="Account number copied" light />
              </div>
              <p className="mt-1 text-xs text-canvas-soft/80">
                {profile.bankName} · {profile.accountName}
              </p>
            </div>
            <ActionButton
              variant="primary"
              onClick={() => setFundOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" /> Fund Wallet
            </ActionButton>
          </div>
        </div>

        <SectionCard title="Services" className="lg:col-span-3">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {tiles.map((id) => {
              const meta = serviceMeta[id];
              const colors = serviceColors[id];
              const to = id === "wallet-funding" ? undefined : "/app/purchase";
              const inner = (
                <>
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-2xl transition-transform group-hover:-translate-y-0.5",
                      colors.bg,
                      colors.text,
                    )}
                  >
                    <meta.icon className="h-5 w-5" />
                  </span>
                  <span className="text-center text-xs font-semibold text-ink">{meta.label}</span>
                </>
              );
              return to ? (
                <Link
                  key={id}
                  to={`/app/purchase?service=${id}`}
                  className={cn(
                    "group flex flex-col items-center gap-2 rounded-2xl border border-border p-3 transition-colors",
                    colors.hover,
                  )}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={id}
                  type="button"
                  onClick={() => setFundOpen(true)}
                  className={cn(
                    "group flex flex-col items-center gap-2 rounded-2xl border border-border p-3 transition-colors",
                    colors.hover,
                  )}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard
          title="Recent transactions"
          className="lg:col-span-3"
          action={
            <ActionLink to="/app/transactions" variant="ghost" size="sm">
              View all <ArrowRight className="h-4 w-4" />
            </ActionLink>
          }
        >
          <ul className="divide-y divide-border">
            {transactions.slice(0, 5).map((tx) => {
              const meta = serviceMeta[tx.service];
              return (
                <li key={tx.id} className="flex items-center gap-3 py-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-canvas-soft text-ink">
                    <meta.icon className="h-4.5 w-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{tx.description}</p>
                    <p className="truncate text-xs text-body">
                      {tx.recipient} ·{" "}
                      {new Date(tx.date).toLocaleDateString("en-NG", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-ink">
                      {tx.service === "wallet-funding" ? "+" : "−"}
                      {naira(tx.amount)}
                    </p>
                    <span
                      className={cn(
                        "mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        statusTone[tx.status],
                      )}
                    >
                      {tx.status}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </div>

      <FundWalletDialog open={fundOpen} onOpenChange={setFundOpen} />
    </AppShell>
  );
}

const tiles: ServiceId[] = [
  "airtime",
  "data",
  "electricity",
  "cable-tv",
  "airtime-to-cash",
  "education-pin",
  "wallet-funding",
];
