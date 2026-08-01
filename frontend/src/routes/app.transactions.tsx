import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import { AppShell, SectionCard } from "@/components/app-shell";
import { ActionButton } from "@/components/ui-kit";
import { useWallet } from "@/lib/wallet-store";
import { naira, serviceMeta, statusTone, type Transaction } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function TransactionsPage() {
  const { transactions } = useWallet();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [service, setService] = useState("all");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (service !== "all" && tx.service !== service) return false;
      if (status !== "all" && tx.status !== status) return false;
      if (from && new Date(tx.date) < new Date(from)) return false;
      if (to && new Date(tx.date) > new Date(`${to}T23:59:59`)) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !tx.description.toLowerCase().includes(q) &&
          !tx.recipient.toLowerCase().includes(q) &&
          !tx.reference.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [transactions, service, status, from, to, query]);

  const pages = Math.max(1, Math.ceil(filtered.length / 8));
  const current = Math.min(page, pages);
  const rows = filtered.slice((current - 1) * 8, current * 8);

  return (
    <AppShell title="Transactions" subtitle={`${filtered.length} records found`}>
      <div className="mx-auto w-full max-w-5xl space-y-5">
        <SectionCard>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-mute" />
              <input
                className="field-input pl-11"
                placeholder="Search description, recipient or reference"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                aria-label="Search transactions"
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <select
                className="field-input"
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by service"
              >
                <option value="all">All services</option>
                {Object.entries(serviceMeta).map(([id, m]) => (
                  <option key={id} value={id}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                className="field-input"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by status"
              >
                <option value="all">All statuses</option>
                <option value="successful">Successful</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
              <input
                type="date"
                className="field-input"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                aria-label="From date"
              />
              <input
                type="date"
                className="field-input"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                aria-label="To date"
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setService("all");
                setStatus("all");
                setFrom("");
                setTo("");
                setPage(1);
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:underline"
            >
              <SlidersHorizontal className="h-4 w-4" /> Reset filters
            </button>
          </div>
        </SectionCard>

        <SectionCard>
          {rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-body">
              No transactions match those filters.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((tx) => {
                const meta = serviceMeta[tx.service];
                return (
                  <li key={tx.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(tx)}
                      className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-canvas-soft/60"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-canvas-soft text-ink">
                        <meta.icon className="h-4.5 w-4.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-ink">{tx.description}</p>
                        <p className="truncate text-xs text-body">
                          {tx.recipient} ·{" "}
                          {new Date(tx.date).toLocaleString("en-NG", {
                            dateStyle: "medium",
                            timeStyle: "short",
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
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {pages > 1 ? (
            <div className="mt-5 flex items-center justify-between gap-3">
              <ActionButton
                variant="outline"
                size="sm"
                disabled={current === 1}
                onClick={() => setPage(current - 1)}
              >
                Previous
              </ActionButton>
              <p className="text-sm text-body">
                Page {current} of {pages}
              </p>
              <ActionButton
                variant="outline"
                size="sm"
                disabled={current === pages}
                onClick={() => setPage(current + 1)}
              >
                Next
              </ActionButton>
            </div>
          ) : null}
        </SectionCard>
      </div>

      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-md rounded-3xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">Transaction receipt</DialogTitle>
                <DialogDescription>{selected.description}</DialogDescription>
              </DialogHeader>
              <div className="mt-2 rounded-2xl bg-canvas-soft p-4 text-center">
                <p className="text-3xl font-black text-ink">{naira(selected.amount)}</p>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase",
                    statusTone[selected.status],
                  )}
                >
                  {selected.status}
                </span>
              </div>
              <dl className="mt-4 divide-y divide-border text-sm">
                <DetailRow label="Transaction ID" value={selected.id} />
                <DetailRow label="Reference" value={selected.reference} />
                <DetailRow label="Service" value={serviceMeta[selected.service].label} />
                <DetailRow label="Recipient" value={selected.recipient} />
                <DetailRow label="Fee" value={naira(selected.fee)} />
                <DetailRow label="Total" value={naira(selected.amount + selected.fee)} />
                <DetailRow
                  label="Date"
                  value={new Date(selected.date).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
              </dl>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <dt className="text-body">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}
