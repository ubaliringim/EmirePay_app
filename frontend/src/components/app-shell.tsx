import { useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  ShoppingBag,
} from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import logoWhiteBg from "@/assets/logowhitebg.png";
import { useWallet } from "@/lib/wallet-store";
import { cn } from "@/lib/utils";
import { ActionButton } from "@/components/ui-kit";
import avatarImg from "@/assets/avatar-3d.png";
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

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/purchase", label: "Purchase", icon: ShoppingBag },
  { to: "/app/transactions", label: "Transactions", icon: ArrowLeftRight },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

function useIsActive() {
  const pathname = useLocation().pathname;
  return (to: string, exact?: boolean) =>
    exact ? pathname === to || pathname === `${to}/` : pathname.startsWith(to);
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const { profile } = useWallet();
  const isActive = useIsActive();
  const [drawer, setDrawer] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const navigate = useNavigate();

  const navList = (onClick?: () => void) => (
    <nav className="flex flex-col gap-1" aria-label="App">
      {nav.map((item) => {
        const active = isActive(item.to, "exact" in item ? item.exact : false);
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-ink"
                : "text-canvas-soft/75 hover:bg-canvas-soft/10 hover:text-canvas-soft",
            )}
          >
            <item.icon className="h-4.5 w-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-canvas-soft lg:grid lg:grid-cols-[264px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col justify-between bg-ink p-6 lg:flex">
        <div>
          <Wordmark tone="light" src={logoWhiteBg} />
          <div className="mt-10">{navList()}</div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl bg-canvas-soft/8 p-4">
            <p className="text-xs font-bold tracking-widest text-primary uppercase">Need help?</p>
            <p className="mt-1 text-xs text-canvas-soft/70">
              Our Kano support team replies in minutes, 24/7.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setConfirmLogout(true)}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-canvas-soft/75 transition-colors hover:bg-canvas-soft/10 hover:text-canvas-soft"
          >
            <LogOut className="h-4.5 w-4.5" /> Log Out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-canvas/90 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-ink lg:hidden"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="lg:hidden">
                <Wordmark className="[&_img]:h-6" />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-lg font-black text-ink">{title}</h1>
                {subtitle ? <p className="text-xs text-body">{subtitle}</p> : null}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                className="relative grid h-10 w-10 place-items-center rounded-full border border-border text-ink transition-colors hover:bg-canvas-soft"
                aria-label="Notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-secondary" />
              </button>
              <Link
                to="/app/settings"
                className="flex items-center gap-2 rounded-full border border-border py-1.5 pr-3 pl-1.5 transition-colors hover:bg-canvas-soft"
              >
                <img
                  src={avatarImg}
                  alt={profile.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="hidden text-sm font-semibold text-ink sm:block">
                  {profile.firstName}
                </span>
              </Link>
            </div>
          </div>
          <div className="border-t border-border px-4 py-3 lg:hidden">
            <h1 className="text-xl font-black text-ink">{title}</h1>
            {subtitle ? <p className="text-xs text-body">{subtitle}</p> : null}
          </div>
        </header>

        <main className="flex-1 px-4 pt-5 pb-28 sm:px-6 lg:pb-10">{children}</main>
      </div>

      {drawer ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-ink/50"
            onClick={() => setDrawer(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col justify-between bg-ink p-6">
            <div>
              <div className="flex items-center justify-between">
                <Wordmark tone="light" src={logoWhiteBg} />
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  className="grid h-9 w-9 place-items-center rounded-full bg-canvas-soft/10 text-canvas-soft"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-8">{navList(() => setDrawer(false))}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                setDrawer(false);
                setConfirmLogout(true);
              }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-canvas-soft/75"
            >
              <LogOut className="h-4.5 w-4.5" /> Log Out
            </button>
          </div>
        </div>
      ) : null}

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-canvas/95 backdrop-blur-xl lg:hidden"
        aria-label="Primary"
      >
        <div className="grid grid-cols-4">
          {nav.map((item) => {
            const active = isActive(item.to, "exact" in item ? item.exact : false);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-semibold transition-colors",
                  active ? "text-secondary" : "text-mute",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-12 place-items-center rounded-full transition-colors",
                    active ? "bg-primary text-ink" : "",
                  )}
                >
                  <item.icon className="h-4.5 w-4.5" />
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <AlertDialog open={confirmLogout} onOpenChange={setConfirmLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Log out of Emir Pay?</AlertDialogTitle>
            <AlertDialogDescription>
              You'll need to sign in again to access your wallet and make payments.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay signed in</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/login")}>Log Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function SectionCard({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card p-5 sm:p-6", className)}>
      {title || action ? (
        <div className="mb-4 flex items-center justify-between gap-3">
          {title ? <h2 className="text-base font-black text-ink">{title}</h2> : <span />}
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export { ActionButton };
