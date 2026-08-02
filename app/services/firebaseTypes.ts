export type FirebaseUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

export type Unsubscribe = () => void;

export interface FirebaseAuth {
  signIn: (email: string, password: string) => Promise<FirebaseUser>;
  signUp: (email: string, password: string, displayName?: string) => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  onAuthStateChange: (cb: (user: FirebaseUser | null) => void) => Unsubscribe;
  getCurrentUser: () => FirebaseUser | null;
}

export function mapUser(u: any): FirebaseUser | null {
  if (!u) return null;
  return {
    uid: u.uid,
    email: u.email ?? null,
    displayName: u.displayName ?? null,
  };
}