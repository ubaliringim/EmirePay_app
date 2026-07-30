import type { Env } from './vtpass';

export type TransactionType = 'airtime' | 'data' | 'electricity' | 'cable' | 'internet';
export type TransactionStatus = 'Success' | 'Pending' | 'Failed';

export interface TransactionInput {
  uid: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: number;
  status: TransactionStatus;
  requestId?: string;
}

/** VTpass responses carry a top-level `code`: "000" = successful, "099" = processing, anything else = failed. */
export function purchaseStatus(data: unknown): TransactionStatus {
  const code = data && typeof data === 'object' ? (data as { code?: unknown }).code : undefined;
  if (code === '000') return 'Success';
  if (code === '099') return 'Pending';
  return 'Failed';
}

export async function recordTransaction(env: Env, input: TransactionInput): Promise<void> {
  try {
    await env.DB.prepare(
      `INSERT INTO transactions (id, uid, type, title, subtitle, amount, direction, status, request_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'out', ?, ?, ?)`,
    )
      .bind(
        crypto.randomUUID(),
        input.uid,
        input.type,
        input.title,
        input.subtitle,
        input.amount,
        input.status,
        input.requestId ?? null,
        new Date().toISOString(),
      )
      .run();
  } catch (err) {
    console.error('Failed to record transaction', err);
  }
}

export interface TransactionRow {
  id: string;
  type: TransactionType;
  title: string;
  subtitle: string;
  amount: number;
  direction: 'in' | 'out';
  status: TransactionStatus;
  created_at: string;
}

export async function listTransactions(env: Env, uid: string): Promise<TransactionRow[]> {
  const { results } = await env.DB.prepare(
    `SELECT id, type, title, subtitle, amount, direction, status, created_at
     FROM transactions WHERE uid = ? ORDER BY created_at DESC LIMIT 200`,
  )
    .bind(uid)
    .all<TransactionRow>();
  return results;
}
