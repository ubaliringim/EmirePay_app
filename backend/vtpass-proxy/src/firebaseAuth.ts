import { createRemoteJWKSet, jwtVerify } from 'jose';

const GOOGLE_JWKS_URL =
  'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com';

// Reused across requests within the same Worker isolate; jose caches the keys internally.
const jwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URL));

export interface VerifiedUser {
  uid: string;
  email?: string;
}

/**
 * Verifies a Firebase Authentication ID token without the Firebase Admin SDK
 * (which needs Node.js APIs unavailable in the Workers runtime).
 * Throws if the token is missing, expired, or signed for a different project.
 */
export async function verifyFirebaseIdToken(
  authorizationHeader: string | null,
  projectId: string,
): Promise<VerifiedUser> {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    throw new Error('Missing bearer token');
  }
  const token = authorizationHeader.slice('Bearer '.length);

  const { payload } = await jwtVerify(token, jwks, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  if (!payload.sub) {
    throw new Error('Token missing subject');
  }

  return { uid: payload.sub, email: payload.email as string | undefined };
}
