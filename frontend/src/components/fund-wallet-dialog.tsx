import { useState } from "react";
import { Copy, Check, Landmark, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActionButton, Field } from "@/components/ui-kit";
import { useWallet } from "@/lib/wallet-store";
import { naira } from "@/lib/mock-data";

export function CopyButton({
  value,
  label = "Copied",
  light = false,
}: {
  value: string;
  label?: string;
  light?: boolean;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
        } catch {
          /* clipboard unavailable */
        }
        setDone(true);
        toast.success(`${label} to clipboard`);
        setTimeout(() => setDone(false), 1600);
      }}
      className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
        light
          ? "border-canvas-soft/25 text-canvas-soft hover:bg-canvas-soft/15 hover:text-canvas-soft"
          : "border-border text-ink hover:bg-canvas-soft"
      }`}
      aria-label="Copy"
    >
      {done ? (
        <Check className={`h-3.5 w-3.5 ${light ? "text-primary" : "text-secondary"}`} />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {done ? "Copied" : "Copy"}
    </button>
  );
}

export function FundWalletDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { profile, credit } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const payNow = () => {
    const value = Number(amount);
    if (!value || value < 100) {
      toast.error("Enter an amount of ₦100 or more");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      credit(value, "Wallet funding · Paystack", "Card •••• 4821");
      setLoading(false);
      setAmount("");
      onOpenChange(false);
      toast.success(`Wallet funded with ${naira(value)}`, {
        description: "Your new balance is available immediately.",
      });
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Fund your wallet</DialogTitle>
          <DialogDescription>Choose how you'd like to add money to Emir Pay.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="transfer" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="transfer">
              <Landmark className="mr-1.5 h-4 w-4" /> Bank transfer
            </TabsTrigger>
            <TabsTrigger value="paystack">
              <CreditCard className="mr-1.5 h-4 w-4" /> Paystack
            </TabsTrigger>
          </TabsList>

          <TabsContent value="transfer" className="mt-5 space-y-4">
            <p className="text-sm text-body">
              Transfer any amount to your dedicated Emir Pay account. Funds reflect in seconds.
            </p>
            <div className="rounded-2xl bg-canvas-soft p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold tracking-widest text-body uppercase">
                    Account number
                  </p>
                  <p className="text-2xl font-black text-ink">{profile.virtualAccount}</p>
                </div>
                <CopyButton value={profile.virtualAccount} label="Account number copied" />
              </div>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-body">Bank</dt>
                  <dd className="font-semibold text-ink">{profile.bankName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-body">Account name</dt>
                  <dd className="font-semibold text-ink">{profile.accountName}</dd>
                </div>
              </dl>
            </div>
          </TabsContent>

          <TabsContent value="paystack" className="mt-5 space-y-4">
            <Field
              id="fund-amount"
              label="Amount to fund"
              inputMode="numeric"
              placeholder="5000"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9]/g, ""))}
              hint="Minimum ₦100. Card is charged securely by Paystack."
            />
            <div className="flex flex-wrap gap-2">
              {[1000, 2000, 5000, 10000].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setAmount(String(p))}
                  className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink hover:bg-canvas-soft"
                >
                  {naira(p)}
                </button>
              ))}
            </div>
            <ActionButton variant="primary" size="block" onClick={payNow} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing payment…
                </>
              ) : (
                "Pay Now"
              )}
            </ActionButton>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
