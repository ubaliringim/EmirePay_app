import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { AppShell, SectionCard } from "@/components/app-shell";
import { ActionButton, Field } from "@/components/ui-kit";
import { CopyButton } from "@/components/fund-wallet-dialog";
import { useWallet } from "@/lib/wallet-store";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function SettingsPage() {
  const { profile, updateProfile } = useWallet();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
  });
  const [saving, setSaving] = useState(false);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const save = () => {
    if (!form.firstName || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      updateProfile(form);
      setSaving(false);
      toast.success("Profile updated", { description: "Your changes have been saved." });
    }, 1200);
  };

  const changePassword = () => {
    if (!pwd.current || !pwd.next) {
      toast.error("Fill in your current and new password");
      return;
    }
    if (pwd.next.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (pwd.next !== pwd.confirm) {
      toast.error("New passwords don't match");
      return;
    }
    setPwdSaving(true);
    setTimeout(() => {
      setPwdSaving(false);
      setPwd({ current: "", next: "", confirm: "" });
      toast.success("Password changed successfully");
    }, 1400);
  };

  return (
    <AppShell title="Profile & Settings" subtitle="Manage your account and preferences.">
      <div className="mx-auto grid w-full max-w-5xl gap-5 lg:grid-cols-2">
        <SectionCard title="Profile" className="lg:col-span-2">
          <div className="mb-5 flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-primary text-xl font-black text-ink">
              {profile.initials}
            </span>
            <div>
              <p className="text-lg font-black text-ink">{profile.name}</p>
              <p className="text-sm text-body">{profile.email}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="firstName"
              label="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
            <Field
              id="lastName"
              label="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
            <Field
              id="email"
              label="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Field
              id="phone"
              label="Phone number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <ActionButton variant="primary" className="mt-5" onClick={save} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </ActionButton>
        </SectionCard>

        <SectionCard title="Security">
          <div className="space-y-4">
            <Field
              id="current-password"
              label="Current password"
              type="password"
              placeholder="••••••••"
              value={pwd.current}
              onChange={(e) => setPwd({ ...pwd, current: e.target.value })}
            />
            <Field
              id="new-password"
              label="New password"
              type="password"
              placeholder="At least 8 characters"
              value={pwd.next}
              onChange={(e) => setPwd({ ...pwd, next: e.target.value })}
            />
            <Field
              id="confirm-password"
              label="Confirm new password"
              type="password"
              placeholder="Repeat new password"
              value={pwd.confirm}
              onChange={(e) => setPwd({ ...pwd, confirm: e.target.value })}
            />
            <ActionButton variant="dark" onClick={changePassword} disabled={pwdSaving}>
              {pwdSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" /> Change Password
                </>
              )}
            </ActionButton>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title="Account details">
            <div className="rounded-2xl bg-canvas-soft p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold tracking-widest text-body uppercase">
                    Virtual account
                  </p>
                  <p className="text-2xl font-black text-ink">{profile.virtualAccount}</p>
                </div>
                <CopyButton value={profile.virtualAccount} label="Account number copied" />
              </div>
              <p className="mt-2 text-sm text-body">
                {profile.bankName} · {profile.accountName}
              </p>
            </div>
          </SectionCard>

          <SectionCard title="Preferences">
            <div className="space-y-4">
              <ToggleRow
                label="Email notifications"
                hint="Receipts and security alerts by email"
                checked={emailAlerts}
                onChange={(v) => {
                  setEmailAlerts(v);
                  toast.success(`Email notifications ${v ? "enabled" : "disabled"}`);
                }}
              />
              <ToggleRow
                label="SMS notifications"
                hint="Transaction alerts to your phone"
                checked={smsAlerts}
                onChange={(v) => {
                  setSmsAlerts(v);
                  toast.success(`SMS notifications ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
          </SectionCard>

          <SectionCard>
            <ActionButton
              variant="outline"
              size="block"
              onClick={() => setConfirmLogout(true)}
              className="border-destructive text-destructive hover:bg-destructive/5"
            >
              <LogOut className="h-4 w-4" /> Log Out
            </ActionButton>
          </SectionCard>
        </div>
      </div>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of Emir Pay?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to sign in again to access your wallet.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/login")}>Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}

function ToggleRow({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-border p-4">
      <div>
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="text-xs text-body">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
