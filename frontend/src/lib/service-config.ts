import type { ServiceId } from "@/lib/mock-data";
import mtnLogo from "@/assets/mtn.jpg";
import airtelLogo from "@/assets/airtel.jpg";
import gloLogo from "@/assets/glo.jpg";

export type FieldConfig =
  | {
      type: "select";
      name: string;
      label: string;
      options: { value: string; label: string; price?: number; logo?: string }[];
      placeholder?: string;
    }
  | { type: "text" | "tel" | "email"; name: string; label: string; placeholder?: string }
  | { type: "amount"; name: string; label: string; presets?: number[] }
  | { type: "quantity"; name: string; label: string; unitPrice: number };

export type ServiceConfig = {
  id: ServiceId;
  title: string;
  cta: string;
  fields: FieldConfig[];
};

const networks = [
  { value: "MTN", label: "MTN", logo: mtnLogo },
  { value: "Airtel", label: "Airtel", logo: airtelLogo },
  { value: "Glo", label: "Glo", logo: gloLogo },
  { value: "9mobile", label: "9mobile" },
];

export const purchaseServices: PurchaseServiceId[] = [
  "airtime",
  "data",
  "electricity",
  "cable-tv",
  "airtime-to-cash",
  "education-pin",
];

export type PurchaseServiceId = Exclude<ServiceId, "wallet-funding">;

export const serviceConfigs: Record<PurchaseServiceId, ServiceConfig> = {
  airtime: {
    id: "airtime",
    title: "Buy Airtime",
    cta: "Confirm & Pay",
    fields: [
      { type: "select", name: "network", label: "Network provider", options: networks },
      { type: "tel", name: "phone", label: "Phone number", placeholder: "0803 000 0000" },
      {
        type: "amount",
        name: "amount",
        label: "Amount",
        presets: [100, 200, 500, 1000, 2000, 5000],
      },
    ],
  },
  data: {
    id: "data",
    title: "Buy Data",
    cta: "Confirm & Pay",
    fields: [
      { type: "select", name: "network", label: "Network provider", options: networks },
      { type: "tel", name: "phone", label: "Phone number", placeholder: "0803 000 0000" },
      {
        type: "select",
        name: "plan",
        label: "Data plan",
        options: [
          { value: "500MB - 7 days", label: "500MB · 7 days — ₦150", price: 150 },
          { value: "1GB - 30 days", label: "1GB · 30 days — ₦300", price: 300 },
          { value: "2GB - 30 days", label: "2GB · 30 days — ₦1,200", price: 1200 },
          { value: "5GB - 30 days", label: "5GB · 30 days — ₦2,500", price: 2500 },
          { value: "10GB - 30 days", label: "10GB · 30 days — ₦4,500", price: 4500 },
        ],
      },
    ],
  },
  electricity: {
    id: "electricity",
    title: "Pay Electricity Bill",
    cta: "Confirm & Pay",
    fields: [
      {
        type: "select",
        name: "disco",
        label: "Distribution company",
        options: [
          { value: "Kano Electricity (KEDCO)", label: "Kano Electricity (KEDCO)" },
          { value: "Abuja Electricity (AEDC)", label: "Abuja Electricity (AEDC)" },
          { value: "Ikeja Electric", label: "Ikeja Electric" },
          { value: "Eko Electricity (EKEDC)", label: "Eko Electricity (EKEDC)" },
          { value: "Kaduna Electric", label: "Kaduna Electric" },
          { value: "Port Harcourt (PHED)", label: "Port Harcourt (PHED)" },
        ],
      },
      { type: "text", name: "meter", label: "Meter number", placeholder: "45012299871" },
      {
        type: "select",
        name: "meterType",
        label: "Meter type",
        options: [
          { value: "Prepaid", label: "Prepaid" },
          { value: "Postpaid", label: "Postpaid" },
        ],
      },
      { type: "amount", name: "amount", label: "Amount", presets: [1000, 2000, 5000, 10000] },
    ],
  },
  "cable-tv": {
    id: "cable-tv",
    title: "Renew Cable TV",
    cta: "Confirm & Pay",
    fields: [
      {
        type: "select",
        name: "provider",
        label: "Provider",
        options: [
          { value: "DStv", label: "DStv" },
          { value: "GOtv", label: "GOtv" },
          { value: "StarTimes", label: "StarTimes" },
        ],
      },
      { type: "text", name: "iuc", label: "Smartcard / IUC number", placeholder: "7012994412" },
      {
        type: "select",
        name: "package",
        label: "Bouquet",
        options: [
          { value: "DStv Padi", label: "DStv Padi — ₦4,400", price: 4400 },
          { value: "DStv Compact", label: "DStv Compact — ₦19,000", price: 19000 },
          { value: "DStv Premium", label: "DStv Premium — ₦44,500", price: 44500 },
          { value: "GOtv Jolli", label: "GOtv Jolli — ₦7,200", price: 7200 },
          { value: "GOtv Max", label: "GOtv Max — ₦10,500", price: 10500 },
          { value: "StarTimes Classic", label: "StarTimes Classic — ₦4,200", price: 4200 },
        ],
      },
    ],
  },
  "airtime-to-cash": {
    id: "airtime-to-cash",
    title: "Convert Airtime to Cash",
    cta: "Confirm & Convert",
    fields: [
      { type: "select", name: "network", label: "Network", options: networks },
      { type: "tel", name: "phone", label: "Airtime sender line", placeholder: "0803 000 0000" },
      {
        type: "amount",
        name: "amount",
        label: "Airtime value",
        presets: [1000, 2000, 5000, 10000],
      },
      {
        type: "select",
        name: "payout",
        label: "Payout account",
        options: [
          { value: "Zenith Bank •••• 7741", label: "Zenith Bank •••• 7741" },
          { value: "GTBank •••• 2093", label: "GTBank •••• 2093" },
          { value: "Emir Pay Wallet", label: "Emir Pay Wallet" },
        ],
      },
    ],
  },
  "education-pin": {
    id: "education-pin",
    title: "Buy Educational PIN",
    cta: "Confirm & Pay",
    fields: [
      {
        type: "select",
        name: "exam",
        label: "Exam body",
        options: [
          { value: "WAEC Result Checker", label: "WAEC Result Checker — ₦3,500", price: 3500 },
          { value: "NECO Result Checker", label: "NECO Result Checker — ₦1,300", price: 1300 },
          { value: "JAMB UTME PIN", label: "JAMB UTME PIN — ₦7,700", price: 7700 },
          { value: "NABTEB Result Checker", label: "NABTEB Result Checker — ₦1,000", price: 1000 },
        ],
      },
      { type: "quantity", name: "quantity", label: "Quantity", unitPrice: 0 },
      { type: "email", name: "email", label: "Delivery email", placeholder: "you@example.com" },
    ],
  },
};

export function computeTotal(config: ServiceConfig, values: Record<string, string>): number {
  let unit = 0;
  let qty = 1;
  for (const f of config.fields) {
    if (f.type === "amount") unit = Number(values[f.name] || 0);
    if (f.type === "quantity") qty = Math.max(1, Number(values[f.name] || 1));
    if (f.type === "select") {
      const opt = f.options.find((o) => o.value === values[f.name]);
      if (opt?.price) unit = opt.price;
    }
  }
  return unit * qty;
}
