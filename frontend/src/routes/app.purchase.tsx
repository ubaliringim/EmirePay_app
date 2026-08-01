import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { AppShell, SectionCard } from "@/components/app-shell";
import { ActionButton, ActionLink, Field } from "@/components/ui-kit";
import { useWallet } from "@/lib/wallet-store";
import { naira, serviceMeta } from "@/lib/mock-data";
import {
  computeTotal,
  purchaseServices,
  serviceConfigs,
  type PurchaseServiceId,
} from "@/lib/service-config";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/mock-data";

const searchSchema = z.object({
  service: z
    .enum(["airtime", "data", "electricity", "cable-tv", "airtime-to-cash", "education-pin"])
    .optional(),
});

export function PurchasePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { balance, debit } = useWallet();

  const parsed = searchSchema.safeParse(Object.fromEntries(searchParams));
  const service = parsed.data?.service;

  const active: PurchaseServiceId = service ?? "airtime";
  const config = serviceConfigs[active];

  const [values, setValues] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"form" | "review" | "processing" | "done">("form");
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<Transaction | null>(null);

  const total = useMemo(() => computeTotal(config, values), [config, values]);

  useEffect(() => {
    setValues({});
    setStep("form");
    setError(null);
    setReceipt(null);
  }, [active]);

  const switchService = (id: PurchaseServiceId) => {
    navigate(`/app/purchase?service=${id}`);
  };

  const set = (name: string, v: string) => setValues((p) => ({ ...p, [name]: v }));

  const validate = () => {
    for (const f of config.fields) {
      if (f.type === "quantity") continue;
      if (!values[f.name]) return `Please provide ${f.label.toLowerCase()}.`;
    }
    if (total <= 0) return "Enter a valid amount.";
    return null;
  };

  const goReview = () => {
    const err = validate();
    setError(err);
    if (!err) setStep("review");
  };

  const confirm = () => {
    if (total > balance) {
      setError("Insufficient wallet balance. Fund your wallet to complete this payment.");
      setStep("form");
      return;
    }
    setStep("processing");
    setTimeout(() => {
      const recipient =
        values["phone"] ||
        values["meter"] ||
        values["iuc"] ||
        values["email"] ||
        values["payout"] ||
        "—";
      const tx = debit({
        amount: total,
        service: active,
        description: summaryLine(active, values),
        recipient,
      });
      setReceipt(tx);
      setStep("done");
    }, 1900);
  };

  const insufficient = total > balance;

  return (
    <AppShell title="Make a payment" subtitle="One form, every Emir Pay service.">
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <SectionCard title="Choose a service">
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {purchaseServices.map((id) => {
                const meta = serviceMeta[id];
                const on = id === active;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => switchService(id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border p-3 text-center text-[11px] font-semibold transition-colors",
                      on
                        ? "border-ink bg-primary text-ink"
                        : "border-border text-body hover:bg-canvas-soft",
                    )}
                  >
                    <meta.icon className="h-5 w-5" />
                    {meta.label}
                  </button>
                );
              })}
            </div>
          </SectionCard>

          {step === "form" ? (
            <SectionCard title={config.title}>
              <div className="space-y-5">
                {config.fields.map((f) => {
                  if (f.type === "select") {
                    return (
                      <div key={f.name} className="space-y-2">
                        <label htmlFor={f.name} className="block text-sm font-semibold text-ink">
                          {f.label}
                        </label>
                        <select
                          id={f.name}
                          className="field-input"
                          value={values[f.name] ?? ""}
                          onChange={(e) => set(f.name, e.target.value)}
                        >
                          <option value="">Select {f.label.toLowerCase()}</option>
                          {f.options.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    );
                  }
                  if (f.type === "amount") {
                    return (
                      <div key={f.name} className="space-y-3">
                        <Field
                          id={f.name}
                          label={f.label}
                          inputMode="numeric"
                          placeholder="1000"
                          value={values[f.name] ?? ""}
                          onChange={(e) => set(f.name, e.target.value.replace(/[^0-9]/g, ""))}
                        />
                        <div className="flex flex-wrap gap-2">
                          {(f.presets ?? []).map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => set(f.name, String(p))}
                              className={cn(
                                "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                                values[f.name] === String(p)
                                  ? "border-ink bg-primary text-ink"
                                  : "border-border text-ink hover:bg-canvas-soft",
                              )}
                            >
                              {naira(p)}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }
                  if (f.type === "quantity") {
                    const q = Number(values[f.name] || 1);
                    return (
                      <div key={f.name} className="space-y-2">
                        <span className="block text-sm font-semibold text-ink">{f.label}</span>
                        <div className="inline-flex items-center gap-3 rounded-xl border border-border px-3 py-2">
                          <button
                            type="button"
                            className="h-8 w-8 rounded-lg bg-canvas-soft font-black text-ink"
                            onClick={() => set(f.name, String(Math.max(1, q - 1)))}
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-black text-ink">{q}</span>
                          <button
                            type="button"
                            className="h-8 w-8 rounded-lg bg-primary font-black text-ink"
                            onClick={() => set(f.name, String(q + 1))}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    );
                  }
                  return (
                    <Field
                      key={f.name}
                      id={f.name}
                      type={f.type}
                      label={f.label}
                      placeholder={f.placeholder}
                      value={values[f.name] ?? ""}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  );
                })}

                {error ? (
                  <div className="flex items-start gap-2 rounded-xl bg-destructive/10 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div>
                      <p className="font-semibold">{error}</p>
                      {insufficient ? (
                        <a href="/app" className="text-xs font-bold underline">
                          Go to dashboard to fund wallet
                        </a>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <ActionButton variant="primary" size="block" onClick={goReview}>
                  Review payment
                </ActionButton>
              </div>
            </SectionCard>
          ) : null}

          {step === "review" ? (
            <SectionCard title="Review & confirm">
              <dl className="divide-y divide-border">
                <Row label="Service" value={serviceMeta[active].label} />
                {config.fields.map((f) => (
                  <Row
                    key={f.name}
                    label={f.label}
                    value={f.type === "quantity" ? values[f.name] || "1" : values[f.name] || "—"}
                  />
                ))}
                <Row label="Fee" value={naira(0)} />
              </dl>
              <div className="mt-4 flex items-center justify-between rounded-2xl bg-canvas-soft p-4">
                <span className="text-sm font-semibold text-body">Total</span>
                <span className="text-2xl font-black text-ink">{naira(total)}</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <ActionButton variant="outline" onClick={() => setStep("form")}>
                  <ArrowLeft className="h-4 w-4" /> Edit details
                </ActionButton>
                <ActionButton variant="primary" onClick={confirm}>
                  {config.cta}
                </ActionButton>
              </div>
            </SectionCard>
          ) : null}

          {step === "processing" ? (
            <SectionCard>
              <div className="flex flex-col items-center gap-3 py-12 text-center">
                <Loader2 className="h-9 w-9 animate-spin text-secondary" />
                <p className="text-lg font-black text-ink">Processing your payment…</p>
                <p className="text-sm text-body">Please don't close this page.</p>
              </div>
            </SectionCard>
          ) : null}

          {step === "done" && receipt ? (
            <SectionCard>
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-ink">
                  <CheckCircle2 className="h-7 w-7" />
                </span>
                <p className="text-2xl font-black text-ink">Payment successful</p>
                <p className="text-sm text-body">{receipt.description}</p>
              </div>
              <dl className="mt-2 divide-y divide-border text-sm">
                <DetailRow label="Transaction ID" value={receipt.id} />
                <DetailRow label="Reference" value={receipt.reference} />
                <DetailRow label="Service" value={serviceMeta[receipt.service].label} />
                <DetailRow label="Recipient" value={receipt.recipient} />
                <DetailRow label="Amount" value={naira(receipt.amount)} />
                <DetailRow label="Fee" value={naira(receipt.fee)} />
                <DetailRow
                  label="Date"
                  value={new Date(receipt.date).toLocaleString("en-NG", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                />
                <DetailRow label="Status" value="Successful" />
              </dl>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <ActionLink to="/app" variant="outline">
                  Go to Dashboard
                </ActionLink>
                <ActionButton
                  variant="primary"
                  onClick={() => {
                    setValues({});
                    setReceipt(null);
                    setError(null);
                    setStep("form");
                  }}
                >
                  Make another purchase
                </ActionButton>
              </div>
            </SectionCard>
          ) : null}
        </div>

        <aside className="space-y-5">
          <SectionCard>
            <p className="text-xs font-bold tracking-widest text-body uppercase">Wallet balance</p>
            <p className="mt-2 text-3xl font-black text-ink">{naira(balance)}</p>
            <p className="mt-1 text-sm text-body">Payments are debited instantly.</p>
            <ActionLink to="/app" variant="outline" size="sm" className="mt-4 w-full">
              Fund wallet
            </ActionLink>
          </SectionCard>
          <SectionCard>
            <p className="text-sm font-black text-ink">{serviceMeta[active].label}</p>
            <p className="mt-1 text-sm text-body">{serviceMeta[active].blurb}</p>
          </SectionCard>
        </aside>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <dt className="text-body">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
      <dt className="text-body">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-semibold text-ink">{value}</dd>
    </div>
  );
}

function summaryLine(service: PurchaseServiceId, v: Record<string, string>) {
  switch (service) {
    case "airtime":
      return `${v["network"]} Airtime Top-up`;
    case "data":
      return `${v["network"]} ${v["plan"]}`;
    case "electricity":
      return `${v["disco"]} · ${v["meterType"]}`;
    case "cable-tv":
      return `${v["provider"]} ${v["package"]} renewal`;
    case "airtime-to-cash":
      return `${v["network"]} airtime converted`;
    case "education-pin":
      return `${v["exam"]} ×${v["quantity"] || 1}`;
  }
}
