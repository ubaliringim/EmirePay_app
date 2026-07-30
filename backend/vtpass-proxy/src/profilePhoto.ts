import type { Env } from './vtpass';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024; // 2MB

interface PhotoMetadata {
  contentType: string;
}

export async function putProfilePhoto(
  env: Env,
  uid: string,
  bytes: ArrayBuffer,
  contentType: string,
): Promise<void> {
  if (bytes.byteLength > MAX_PHOTO_BYTES) {
    throw new Error('Photo too large (max 2MB)');
  }
  const metadata: PhotoMetadata = { contentType };
  await env.PROFILE_PHOTOS.put(uid, bytes, { metadata });
}

export async function getProfilePhoto(
  env: Env,
  uid: string,
): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const result = await env.PROFILE_PHOTOS.getWithMetadata(uid, 'arrayBuffer');
  if (result.value === null) return null;
  const metadata = result.metadata as PhotoMetadata | null;
  return { bytes: result.value, contentType: metadata?.contentType ?? 'image/jpeg' };
}

export async function deleteProfilePhoto(env: Env, uid: string): Promise<void> {
  await env.PROFILE_PHOTOS.delete(uid);
}
