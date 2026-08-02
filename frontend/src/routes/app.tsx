import { Outlet, Navigate } from "react-router-dom";
import { WalletProvider } from "@/lib/wallet-store";
import { useAuth } from "@/lib/auth";

export function AppLayout() {
  return (
    <WalletProvider>
      <Outlet />
    </WalletProvider>
  );
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas-soft">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
