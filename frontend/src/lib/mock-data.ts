import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  Repeat,
  GraduationCap,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type ServiceId =
  | "airtime"
  | "data"
  | "electricity"
  | "cable-tv"
  | "airtime-to-cash"
  | "education-pin"
  | "wallet-funding";

export type TxStatus = "successful" | "pending" | "failed";

export type Transaction = {
  id: string;
  reference: string;
  service: ServiceId;
  description: string;
  recipient: string;
  amount: number;
  fee: number;
  status: TxStatus;
  date: string; // ISO
};

export const naira = (n: number) =>
  `₦${n.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const serviceMeta: Record<ServiceId, { label: string; icon: LucideIcon; blurb: string }> = {
  airtime: { label: "Airtime", icon: Smartphone, blurb: "Top up any Nigerian line instantly" },
  data: { label: "Data", icon: Wifi, blurb: "Affordable bundles on all networks" },
  electricity: { label: "Electricity", icon: Zap, blurb: "Prepaid & postpaid meter tokens" },
  "cable-tv": { label: "Cable TV", icon: Tv, blurb: "DStv, GOtv and StarTimes renewals" },
  "airtime-to-cash": { label: "Airtime to Cash", icon: Repeat, blurb: "Convert airtime to money" },
  "education-pin": {
    label: "Education PINs",
    icon: GraduationCap,
    blurb: "WAEC, NECO, JAMB, NABTEB",
  },
  "wallet-funding": {
    label: "Fund Wallet",
    icon: Wallet,
    blurb: "Add money to your Emir Pay wallet",
  },
};

export const mockUser = {
  firstName: "Aminu",
  lastName: "Suleiman",
  name: "Aminu Suleiman",
  email: "aminu.suleiman@example.com",
  phone: "0803 412 8890",
  initials: "AS",
  virtualAccount: "8032451190",
  bankName: "Emir Pay MFB (Wema)",
  accountName: "Aminu Suleiman / Emir Pay",
};

export const STARTING_BALANCE = 24500;

const t = (
  id: string,
  service: ServiceId,
  description: string,
  recipient: string,
  amount: number,
  status: TxStatus,
  date: string,
  fee = 0,
): Transaction => ({
  id,
  reference: `EMP-${id}`,
  service,
  description,
  recipient,
  amount,
  fee,
  status,
  date,
});

export const mockTransactions: Transaction[] = [
  t(
    "994211",
    "airtime",
    "MTN Airtime Top-up",
    "0803 412 8890",
    1000,
    "successful",
    "2026-07-31T09:14:00Z",
  ),
  t(
    "994198",
    "data",
    "Airtel 2GB · 30 days",
    "0902 771 5540",
    1200,
    "successful",
    "2026-07-30T18:02:00Z",
  ),
  t(
    "994175",
    "electricity",
    "Kano Disco · Prepaid",
    "45012299871",
    5000,
    "successful",
    "2026-07-30T07:45:00Z",
    50,
  ),
  t(
    "994160",
    "cable-tv",
    "DStv Compact renewal",
    "7012994412",
    19000,
    "pending",
    "2026-07-29T20:20:00Z",
  ),
  t(
    "994142",
    "wallet-funding",
    "Wallet funding · Paystack",
    "Card •••• 4821",
    15000,
    "successful",
    "2026-07-29T11:03:00Z",
  ),
  t(
    "994120",
    "education-pin",
    "WAEC Result Checker ×2",
    "aminu.suleiman@example.com",
    7000,
    "successful",
    "2026-07-28T13:37:00Z",
  ),
  t(
    "994101",
    "airtime-to-cash",
    "Glo airtime converted",
    "0805 220 1188",
    4000,
    "failed",
    "2026-07-27T16:12:00Z",
  ),
  t(
    "994088",
    "data",
    "MTN 1GB · 30 days",
    "0803 412 8890",
    300,
    "successful",
    "2026-07-27T08:00:00Z",
  ),
  t(
    "994061",
    "airtime",
    "9mobile Airtime",
    "0908 552 0031",
    500,
    "successful",
    "2026-07-26T19:41:00Z",
  ),
  t(
    "994040",
    "cable-tv",
    "GOtv Jolli renewal",
    "2019945510",
    7200,
    "successful",
    "2026-07-25T10:05:00Z",
  ),
  t(
    "994019",
    "electricity",
    "Ikeja Electric · Postpaid",
    "3301992217",
    12000,
    "successful",
    "2026-07-24T15:26:00Z",
    50,
  ),
  t(
    "993997",
    "wallet-funding",
    "Bank transfer to virtual account",
    "Zenith •••• 7741",
    25000,
    "successful",
    "2026-07-23T09:19:00Z",
  ),
  t(
    "993970",
    "data",
    "Glo 5GB · 30 days",
    "0805 220 1188",
    2500,
    "pending",
    "2026-07-22T21:48:00Z",
  ),
  t(
    "993944",
    "airtime",
    "Airtel Airtime",
    "0902 771 5540",
    2000,
    "successful",
    "2026-07-21T12:33:00Z",
  ),
  t(
    "993921",
    "education-pin",
    "JAMB UTME PIN",
    "chiamaka.okoro@example.com",
    7700,
    "successful",
    "2026-07-20T08:52:00Z",
  ),
  t(
    "993900",
    "airtime-to-cash",
    "MTN airtime converted",
    "0803 412 8890",
    10000,
    "successful",
    "2026-07-19T17:14:00Z",
    800,
  ),
  t(
    "993878",
    "electricity",
    "Abuja Disco · Prepaid",
    "5510028833",
    3000,
    "failed",
    "2026-07-18T06:40:00Z",
  ),
  t(
    "993855",
    "cable-tv",
    "StarTimes Classic",
    "6620113399",
    4200,
    "successful",
    "2026-07-17T14:07:00Z",
  ),
  t(
    "993830",
    "data",
    "9mobile 3GB · 30 days",
    "0908 552 0031",
    1500,
    "successful",
    "2026-07-16T10:22:00Z",
  ),
  t(
    "993811",
    "wallet-funding",
    "Wallet funding · Paystack",
    "Card •••• 4821",
    5000,
    "successful",
    "2026-07-15T07:58:00Z",
  ),
];

export const statusTone: Record<TxStatus, string> = {
  successful: "bg-primary text-ink",
  pending: "bg-warning/30 text-ink",
  failed: "bg-destructive/12 text-destructive",
};
