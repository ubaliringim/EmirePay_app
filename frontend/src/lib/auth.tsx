import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  type User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { authInstance } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(authInstance, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value: AuthContextValue = {
    user,
    loading,
    signIn: async (email, password) => {
      await signInWithEmailAndPassword(authInstance, email, password);
    },
    signUp: async (email, password, displayName) => {
      const cred = await createUserWithEmailAndPassword(authInstance, email, password);
      if (displayName) {
        await updateProfile(cred.user, { displayName });
      }
    },
    signOut: async () => {
      await fbSignOut(authInstance);
    },
    resetPassword: async (email) => {
      await sendPasswordResetEmail(authInstance, email);
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-email": "That email address is invalid.",
  "auth/user-not-found": "No account found with that email.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/email-already-in-use": "An account already exists with that email.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/missing-password": "Please enter your password.",
  "auth/too-many-requests": "Too many attempts. Please try again shortly.",
  "auth/network-request-failed": "Network error. Check your connection.",
  "auth/operation-not-allowed": "Sign in is currently disabled.",
};

export function authErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err) {
    const code = String((err as { code: unknown }).code);
    return AUTH_ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}
