import { Outlet } from "react-router-dom";
import { WalletProvider } from "@/lib/wallet-store";

export function AppLayout() {
  return (
    <WalletProvider>
      <Outlet />
    </WalletProvider>
  );
}
