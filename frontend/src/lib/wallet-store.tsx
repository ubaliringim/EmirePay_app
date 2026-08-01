import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  mockTransactions,
  mockUser,
  STARTING_BALANCE,
  type ServiceId,
  type Transaction,
  type TxStatus,
} from "@/lib/mock-data";

type Profile = typeof mockUser;

type WalletContextValue = {
  balance: number;
  transactions: Transaction[];
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
  credit: (amount: number, description: string, recipient: string) => Transaction;
  debit: (args: {
    amount: number;
    service: ServiceId;
    description: string;
    recipient: string;
    fee?: number;
    status?: TxStatus;
  }) => Transaction;
};

const WalletContext = createContext<WalletContextValue | null>(null);

const newId = () => String(990000 + Math.floor(Math.random() * 9999));

export function WalletProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [profile, setProfile] = useState<Profile>(mockUser);

  const value = useMemo<WalletContextValue>(
    () => ({
      balance,
      transactions,
      profile,
      updateProfile: (patch) =>
        setProfile((p) => {
          const next = { ...p, ...patch };
          next.name = `${next.firstName} ${next.lastName}`.trim();
          next.initials = `${next.firstName[0] ?? ""}${next.lastName[0] ?? ""}`.toUpperCase();
          return next;
        }),
      credit: (amount, description, recipient) => {
        const tx: Transaction = {
          id: newId(),
          reference: `EMP-${newId()}`,
          service: "wallet-funding",
          description,
          recipient,
          amount,
          fee: 0,
          status: "successful",
          date: new Date().toISOString(),
        };
        setBalance((b) => b + amount);
        setTransactions((list) => [tx, ...list]);
        return tx;
      },
      debit: ({ amount, service, description, recipient, fee = 0, status = "successful" }) => {
        const tx: Transaction = {
          id: newId(),
          reference: `EMP-${newId()}`,
          service,
          description,
          recipient,
          amount,
          fee,
          status,
          date: new Date().toISOString(),
        };
        setBalance((b) => b - (amount + fee));
        setTransactions((list) => [tx, ...list]);
        return tx;
      },
    }),
    [balance, transactions, profile],
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used inside WalletProvider");
  return ctx;
}
