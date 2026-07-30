import { verifyFirebaseIdToken } from './firebaseAuth';
import { deleteProfilePhoto, getProfilePhoto, putProfilePhoto } from './profilePhoto';
import { listTransactions, purchaseStatus, recordTransaction } from './transactions';
import {
  fetchBalance,
  fetchVariations,
  purchaseAirtime,
  purchaseCableTv,
  purchaseData,
  purchaseElectricity,
  purchaseInternet,
  verifyMeter,
  verifySmartcard,
  verifySmileEmail,
  type Env,
} from './vtpass';

const NETWORK_SERVICE_IDS = new Set(['mtn', 'glo', 'airtel', 'etisalat']);
const DATA_SERVICE_IDS = new Set(['mtn-data', 'glo-data', 'airtel-data', 'etisalat-data']);
const ELECTRICITY_SERVICE_IDS = new Set([
  'ikeja-electric',
  'eko-electric',
  'abuja-electric',
  'portharcourt-electric',
  'kaduna-electric',
]);
const METER_TYPES = new Set(['prepaid', 'postpaid']);
const CABLE_SERVICE_IDS = new Set(['dstv', 'gotv', 'startimes']);
const INTERNET_SERVICE_IDS = new Set(['smile-direct', 'spectranet']);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleAirtime(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { serviceID?: string; amount?: number; phone?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { serviceID, amount, phone } = body;
  if (!serviceID || !NETWORK_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...NETWORK_SERVICE_IDS].join(', ')}` }, 400);
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return json({ error: 'amount must be a positive number' }, 400);
  }
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return json({ error: 'phone must be a valid phone number' }, 400);
  }

  const result = await purchaseAirtime(env, {
    serviceID: serviceID as 'mtn' | 'glo' | 'airtel' | 'etisalat',
    amount,
    phone,
  });

  console.log(`Airtime purchase for uid=${user.uid} requestId=${result.requestId} status=${result.status}`);

  if (result.status === 200) {
    await recordTransaction(env, {
      uid: user.uid,
      type: 'airtime',
      title: 'Airtime Purchase',
      subtitle: `${serviceID.toUpperCase()} • ${phone}`,
      amount,
      status: purchaseStatus(result.data),
      requestId: result.requestId,
    });
  }

  return json(result.data, result.status);
}

async function handleDataPlans(request: Request, env: Env): Promise<Response> {
  try {
    await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  const url = new URL(request.url);
  const serviceID = url.searchParams.get('serviceID');
  if (!serviceID || !DATA_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...DATA_SERVICE_IDS].join(', ')}` }, 400);
  }

  const variations = await fetchVariations(env, serviceID);
  return json({ variations });
}

async function handleData(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { serviceID?: string; variationCode?: string; amount?: number; phone?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { serviceID, variationCode, amount, phone } = body;
  if (!serviceID || !DATA_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...DATA_SERVICE_IDS].join(', ')}` }, 400);
  }
  if (!variationCode) {
    return json({ error: 'variationCode is required' }, 400);
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return json({ error: 'amount must be a positive number' }, 400);
  }
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return json({ error: 'phone must be a valid phone number' }, 400);
  }

  const result = await purchaseData(env, { serviceID, variationCode, amount, phone });

  console.log(`Data purchase for uid=${user.uid} requestId=${result.requestId} status=${result.status}`);

  if (result.status === 200) {
    await recordTransaction(env, {
      uid: user.uid,
      type: 'data',
      title: 'Data Purchase',
      subtitle: `${serviceID.replace('-data', '').toUpperCase()} • ${phone}`,
      amount,
      status: purchaseStatus(result.data),
      requestId: result.requestId,
    });
  }

  return json(result.data, result.status);
}

async function handleElectricityVerify(request: Request, env: Env): Promise<Response> {
  try {
    await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { serviceID?: string; meterNumber?: string; meterType?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { serviceID, meterNumber, meterType } = body;
  if (!serviceID || !ELECTRICITY_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...ELECTRICITY_SERVICE_IDS].join(', ')}` }, 400);
  }
  if (!meterNumber) {
    return json({ error: 'meterNumber is required' }, 400);
  }
  if (!meterType || !METER_TYPES.has(meterType)) {
    return json({ error: 'meterType must be prepaid or postpaid' }, 400);
  }

  const result = await verifyMeter(env, {
    serviceID,
    meterNumber,
    meterType: meterType as 'prepaid' | 'postpaid',
  });

  return json(result.data, result.status);
}

async function handleElectricity(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: {
    serviceID?: string;
    meterNumber?: string;
    meterType?: string;
    amount?: number;
    phone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { serviceID, meterNumber, meterType, amount, phone } = body;
  if (!serviceID || !ELECTRICITY_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...ELECTRICITY_SERVICE_IDS].join(', ')}` }, 400);
  }
  if (!meterNumber) {
    return json({ error: 'meterNumber is required' }, 400);
  }
  if (!meterType || !METER_TYPES.has(meterType)) {
    return json({ error: 'meterType must be prepaid or postpaid' }, 400);
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return json({ error: 'amount must be a positive number' }, 400);
  }
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return json({ error: 'phone must be a valid phone number' }, 400);
  }

  const result = await purchaseElectricity(env, {
    serviceID,
    meterNumber,
    meterType: meterType as 'prepaid' | 'postpaid',
    amount,
    phone,
  });

  console.log(`Electricity purchase for uid=${user.uid} requestId=${result.requestId} status=${result.status}`);

  if (result.status === 200) {
    await recordTransaction(env, {
      uid: user.uid,
      type: 'electricity',
      title: 'Electricity Bill',
      subtitle: `${serviceID} • ${meterNumber}`,
      amount,
      status: purchaseStatus(result.data),
      requestId: result.requestId,
    });
  }

  return json(result.data, result.status);
}

async function handleCablePlans(request: Request, env: Env): Promise<Response> {
  try {
    await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  const url = new URL(request.url);
  const serviceID = url.searchParams.get('serviceID');
  if (!serviceID || !CABLE_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...CABLE_SERVICE_IDS].join(', ')}` }, 400);
  }

  const variations = await fetchVariations(env, serviceID);
  return json({ variations });
}

async function handleCableVerify(request: Request, env: Env): Promise<Response> {
  try {
    await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { serviceID?: string; smartcardNumber?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { serviceID, smartcardNumber } = body;
  if (!serviceID || !CABLE_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...CABLE_SERVICE_IDS].join(', ')}` }, 400);
  }
  if (!smartcardNumber) {
    return json({ error: 'smartcardNumber is required' }, 400);
  }

  const result = await verifySmartcard(env, { serviceID, smartcardNumber });
  return json(result.data, result.status);
}

async function handleCable(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: {
    serviceID?: string;
    smartcardNumber?: string;
    variationCode?: string;
    amount?: number;
    phone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { serviceID, smartcardNumber, variationCode, amount, phone } = body;
  if (!serviceID || !CABLE_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...CABLE_SERVICE_IDS].join(', ')}` }, 400);
  }
  if (!smartcardNumber) {
    return json({ error: 'smartcardNumber is required' }, 400);
  }
  if (!variationCode) {
    return json({ error: 'variationCode is required' }, 400);
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return json({ error: 'amount must be a positive number' }, 400);
  }
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return json({ error: 'phone must be a valid phone number' }, 400);
  }

  const result = await purchaseCableTv(env, { serviceID, smartcardNumber, variationCode, amount, phone });

  console.log(`Cable TV purchase for uid=${user.uid} requestId=${result.requestId} status=${result.status}`);

  if (result.status === 200) {
    await recordTransaction(env, {
      uid: user.uid,
      type: 'cable',
      title: 'Cable TV Subscription',
      subtitle: `${serviceID.toUpperCase()} • ${smartcardNumber}`,
      amount,
      status: purchaseStatus(result.data),
      requestId: result.requestId,
    });
  }

  return json(result.data, result.status);
}

async function handleInternetPlans(request: Request, env: Env): Promise<Response> {
  try {
    await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  const url = new URL(request.url);
  const serviceID = url.searchParams.get('serviceID');
  if (!serviceID || !INTERNET_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...INTERNET_SERVICE_IDS].join(', ')}` }, 400);
  }

  const variations = await fetchVariations(env, serviceID);
  return json({ variations });
}

async function handleInternetVerify(request: Request, env: Env): Promise<Response> {
  try {
    await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { email } = body;
  if (!email) {
    return json({ error: 'email is required' }, 400);
  }

  const result = await verifySmileEmail(env, { email });
  return json(result.data, result.status);
}

async function handleInternet(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  let body: {
    serviceID?: string;
    billersCode?: string;
    variationCode?: string;
    amount?: number;
    phone?: string;
  };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const { serviceID, billersCode, variationCode, amount, phone } = body;
  if (!serviceID || !INTERNET_SERVICE_IDS.has(serviceID)) {
    return json({ error: `serviceID must be one of ${[...INTERNET_SERVICE_IDS].join(', ')}` }, 400);
  }
  if (!billersCode) {
    return json({ error: 'billersCode is required' }, 400);
  }
  if (!variationCode) {
    return json({ error: 'variationCode is required' }, 400);
  }
  if (typeof amount !== 'number' || amount <= 0) {
    return json({ error: 'amount must be a positive number' }, 400);
  }
  if (!phone || !/^\d{10,15}$/.test(phone)) {
    return json({ error: 'phone must be a valid phone number' }, 400);
  }

  const result = await purchaseInternet(env, {
    serviceID: serviceID as 'smile-direct' | 'spectranet',
    billersCode,
    variationCode,
    amount,
    phone,
  });

  console.log(`Internet purchase for uid=${user.uid} requestId=${result.requestId} status=${result.status}`);

  if (result.status === 200) {
    await recordTransaction(env, {
      uid: user.uid,
      type: 'internet',
      title: 'Internet Subscription',
      subtitle: `${serviceID === 'smile-direct' ? 'Smile' : 'Spectranet'} • ${billersCode}`,
      amount,
      status: purchaseStatus(result.data),
      requestId: result.requestId,
    });
  }

  return json(result.data, result.status);
}

async function handleBalance(request: Request, env: Env): Promise<Response> {
  try {
    await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  const balance = await fetchBalance(env);
  return json({ balance });
}

async function handleGetProfilePhoto(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  const photo = await getProfilePhoto(env, user.uid);
  if (!photo) return json({ error: 'Not found' }, 404);

  return new Response(photo.bytes, {
    status: 200,
    headers: { 'Content-Type': photo.contentType },
  });
}

async function handlePutProfilePhoto(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  const contentType = request.headers.get('Content-Type');
  if (!contentType || !contentType.startsWith('image/')) {
    return json({ error: 'Content-Type must be an image/* type' }, 400);
  }

  const bytes = await request.arrayBuffer();
  if (bytes.byteLength === 0) {
    return json({ error: 'Empty request body' }, 400);
  }

  try {
    await putProfilePhoto(env, user.uid, bytes, contentType);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : 'Upload failed' }, 400);
  }

  return json({ ok: true });
}

async function handleDeleteProfilePhoto(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  await deleteProfilePhoto(env, user.uid);
  return json({ ok: true });
}

async function handleTransactions(request: Request, env: Env): Promise<Response> {
  let user;
  try {
    user = await verifyFirebaseIdToken(request.headers.get('Authorization'), env.FIREBASE_PROJECT_ID);
  } catch {
    return json({ error: 'Unauthorized' }, 401);
  }

  const transactions = await listTransactions(env, user.uid);
  return json({ transactions });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === 'GET' && url.pathname === '/transactions') {
      return handleTransactions(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/balance') {
      return handleBalance(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/profile-photo') {
      return handleGetProfilePhoto(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/profile-photo') {
      return handlePutProfilePhoto(request, env);
    }

    if (request.method === 'DELETE' && url.pathname === '/profile-photo') {
      return handleDeleteProfilePhoto(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/airtime') {
      return handleAirtime(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/data-plans') {
      return handleDataPlans(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/data') {
      return handleData(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/electricity/verify') {
      return handleElectricityVerify(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/electricity') {
      return handleElectricity(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/cable-plans') {
      return handleCablePlans(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/cable/verify') {
      return handleCableVerify(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/cable') {
      return handleCable(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/internet-plans') {
      return handleInternetPlans(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/internet/verify') {
      return handleInternetVerify(request, env);
    }

    if (request.method === 'POST' && url.pathname === '/internet') {
      return handleInternet(request, env);
    }

    if (request.method === 'GET' && url.pathname === '/health') {
      return json({ ok: true });
    }

    return json({ error: 'Not found' }, 404);
  },
};
