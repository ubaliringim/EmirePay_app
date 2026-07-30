export interface Env {
  FIREBASE_PROJECT_ID: string;
  VTPASS_BASE_URL: string;
  VTPASS_API_KEY: string;
  VTPASS_SECRET_KEY: string;
  VTPASS_PUBLIC_KEY: string;
  DB: D1Database;
  PROFILE_PHOTOS: KVNamespace;
}

/**
 * VTpass wants request_id to start with today's date/hour/minute
 * (YYYYMMDDHHmm) followed by any unique suffix.
 * https://www.vtpass.com/documentation/how-to-generate-request-id/
 */
export function generateRequestId(): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const stamp =
    now.getUTCFullYear().toString() +
    pad(now.getUTCMonth() + 1) +
    pad(now.getUTCDate()) +
    pad(now.getUTCHours()) +
    pad(now.getUTCMinutes());
  const suffix = crypto.randomUUID().replace(/-/g, '').slice(0, 12);
  return `${stamp}${suffix}`;
}

export interface AirtimePurchaseInput {
  serviceID: 'mtn' | 'glo' | 'airtel' | 'etisalat';
  amount: number;
  phone: string;
}

export async function purchaseAirtime(env: Env, input: AirtimePurchaseInput) {
  const requestId = generateRequestId();

  const response = await fetch(`${env.VTPASS_BASE_URL}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VTPASS_API_KEY,
      'secret-key': env.VTPASS_SECRET_KEY,
    },
    body: JSON.stringify({
      request_id: requestId,
      serviceID: input.serviceID,
      amount: input.amount,
      phone: input.phone,
    }),
  });

  const data = await response.json();
  return { requestId, status: response.status, data };
}

export interface DataVariation {
  variation_code: string;
  name: string;
  variation_amount: string;
  fixedPrice: string;
}

/** Fetches the available data plans (variation codes + prices) for a data serviceID, e.g. "mtn-data". */
export async function fetchVariations(env: Env, serviceID: string): Promise<DataVariation[]> {
  const response = await fetch(`${env.VTPASS_BASE_URL}/service-variations?serviceID=${encodeURIComponent(serviceID)}`, {
    headers: {
      'api-key': env.VTPASS_API_KEY,
      'public-key': env.VTPASS_PUBLIC_KEY,
    },
  });

  const data = await response.json() as { content?: { variations?: DataVariation[] } };
  return data.content?.variations ?? [];
}

/** Fetches the merchant's VTpass wallet balance (the float used to fulfill purchases). */
export async function fetchBalance(env: Env): Promise<number> {
  const response = await fetch(`${env.VTPASS_BASE_URL}/balance`, {
    headers: {
      'api-key': env.VTPASS_API_KEY,
      'public-key': env.VTPASS_PUBLIC_KEY,
    },
  });

  const data = (await response.json()) as { contents?: { balance?: number | string } };
  const balance = data.contents?.balance;
  return typeof balance === 'string' ? parseFloat(balance) || 0 : balance ?? 0;
}

export interface DataPurchaseInput {
  serviceID: string;
  variationCode: string;
  amount: number;
  phone: string;
}

export async function purchaseData(env: Env, input: DataPurchaseInput) {
  const requestId = generateRequestId();

  const response = await fetch(`${env.VTPASS_BASE_URL}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VTPASS_API_KEY,
      'secret-key': env.VTPASS_SECRET_KEY,
    },
    body: JSON.stringify({
      request_id: requestId,
      serviceID: input.serviceID,
      billersCode: input.phone,
      variation_code: input.variationCode,
      amount: input.amount,
      phone: input.phone,
    }),
  });

  const data = await response.json();
  return { requestId, status: response.status, data };
}

export interface MeterVerifyInput {
  serviceID: string;
  meterNumber: string;
  meterType: 'prepaid' | 'postpaid';
}

/** Calls VTpass merchant-verify to check a meter number and return the customer's name before purchase. */
export async function verifyMeter(env: Env, input: MeterVerifyInput) {
  const response = await fetch(`${env.VTPASS_BASE_URL}/merchant-verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VTPASS_API_KEY,
      'secret-key': env.VTPASS_SECRET_KEY,
    },
    body: JSON.stringify({
      billersCode: input.meterNumber,
      serviceID: input.serviceID,
      type: input.meterType,
    }),
  });

  const data = await response.json();
  return { status: response.status, data };
}

export interface SmartcardVerifyInput {
  serviceID: string;
  smartcardNumber: string;
}

/** Calls VTpass merchant-verify to check a smartcard/IUC number and return the customer's name before purchase. */
export async function verifySmartcard(env: Env, input: SmartcardVerifyInput) {
  const response = await fetch(`${env.VTPASS_BASE_URL}/merchant-verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VTPASS_API_KEY,
      'secret-key': env.VTPASS_SECRET_KEY,
    },
    body: JSON.stringify({
      billersCode: input.smartcardNumber,
      serviceID: input.serviceID,
    }),
  });

  const data = await response.json();
  return { status: response.status, data };
}

export interface CableTvPurchaseInput {
  serviceID: string;
  smartcardNumber: string;
  variationCode: string;
  amount: number;
  phone: string;
}

export async function purchaseCableTv(env: Env, input: CableTvPurchaseInput) {
  const requestId = generateRequestId();

  const response = await fetch(`${env.VTPASS_BASE_URL}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VTPASS_API_KEY,
      'secret-key': env.VTPASS_SECRET_KEY,
    },
    body: JSON.stringify({
      request_id: requestId,
      serviceID: input.serviceID,
      billersCode: input.smartcardNumber,
      variation_code: input.variationCode,
      amount: input.amount,
      phone: input.phone,
      subscription_type: 'change',
      quantity: 1,
    }),
  });

  const data = await response.json();
  return { requestId, status: response.status, data };
}

export interface SmileEmailVerifyInput {
  email: string;
}

/** Calls VTpass's Smile-specific merchant-verify to resolve a Smile account email into its billable account IDs. */
export async function verifySmileEmail(env: Env, input: SmileEmailVerifyInput) {
  const response = await fetch(`${env.VTPASS_BASE_URL}/merchant-verify/smile/email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VTPASS_API_KEY,
      'secret-key': env.VTPASS_SECRET_KEY,
    },
    body: JSON.stringify({
      billersCode: input.email,
      serviceID: 'smile-direct',
    }),
  });

  const data = await response.json();
  return { status: response.status, data };
}

export interface InternetPurchaseInput {
  serviceID: 'smile-direct' | 'spectranet';
  billersCode: string;
  variationCode: string;
  amount: number;
  phone: string;
}

export async function purchaseInternet(env: Env, input: InternetPurchaseInput) {
  const requestId = generateRequestId();

  const response = await fetch(`${env.VTPASS_BASE_URL}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VTPASS_API_KEY,
      'secret-key': env.VTPASS_SECRET_KEY,
    },
    body: JSON.stringify({
      request_id: requestId,
      serviceID: input.serviceID,
      billersCode: input.billersCode,
      variation_code: input.variationCode,
      amount: input.amount,
      phone: input.phone,
    }),
  });

  const data = await response.json();
  return { requestId, status: response.status, data };
}

export interface ElectricityPurchaseInput {
  serviceID: string;
  meterNumber: string;
  meterType: 'prepaid' | 'postpaid';
  amount: number;
  phone: string;
}

export async function purchaseElectricity(env: Env, input: ElectricityPurchaseInput) {
  const requestId = generateRequestId();

  const response = await fetch(`${env.VTPASS_BASE_URL}/pay`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VTPASS_API_KEY,
      'secret-key': env.VTPASS_SECRET_KEY,
    },
    body: JSON.stringify({
      request_id: requestId,
      serviceID: input.serviceID,
      billersCode: input.meterNumber,
      variation_code: input.meterType,
      amount: input.amount,
      phone: input.phone,
    }),
  });

  const data = await response.json();
  return { requestId, status: response.status, data };
}
