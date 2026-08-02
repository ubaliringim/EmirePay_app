import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Wordmark } from "@/components/wordmark";
import { ActionButton, Field } from "@/components/ui-kit";
import { useAuth, authErrorMessage } from "@/lib/auth";

export function LogIn() {
  const navigate = useNavigate();
  const { user, signIn, resetPassword } = useAuth();
  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "forgot") {
        await resetPassword(email);
        toast.success("Password reset link sent", {
          description: "Check your inbox for instructions.",
        });
        setMode("login");
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-canvas-soft flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md my-auto">
        <div className="surface-card w-full max-w-full p-5 sm:p-7 shadow-lift overflow-hidden">
          <div className="mb-5 flex justify-center overflow-hidden">
            <Wordmark imgClassName="h-10 sm:h-12 max-w-full object-contain w-auto" />
          </div>

          {mode === "login" ? (
            <>
              <p className="text-xs font-bold tracking-widest text-secondary uppercase">Log in</p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black">Welcome back</h1>
              <p className="mt-1.5 text-sm text-body">
                Sign in to your Emir Pay wallet to continue.
              </p>
            </>
          ) : (
            <>
              <p className="text-xs font-bold tracking-widest text-secondary uppercase">
                Reset password
              </p>
              <h1 className="mt-1 text-2xl sm:text-3xl font-black">Forgot Password?</h1>
              <p className="mt-1.5 text-sm text-body">
                Enter your email and we'll send you a reset link.
              </p>
            </>
          )}

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <Field
              id="identifier"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
              required
            />

            {mode === "login" && (
              <Field
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                required
              />
            )}

            {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}

            <ActionButton type="submit" variant="primary" size="block" disabled={loading}>
              {mode === "forgot" ? "Send reset link" : loading ? "Signing in…" : "Log In"}
            </ActionButton>

            {mode === "login" ? (
              <div className="flex justify-end text-xs sm:text-sm">
                <button
                  type="button"
                  className="font-semibold text-secondary hover:underline"
                  onClick={() => {
                    setError(null);
                    setMode("forgot");
                  }}
                >
                  Forgot Password?
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="flex items-center gap-1.5 text-sm font-semibold text-secondary hover:underline"
                onClick={() => {
                  setError(null);
                  setMode("login");
                }}
              >
                <ArrowLeft className="h-4 w-4" /> Back to log in
              </button>
            )}

            {mode === "login" && (
              <p className="text-center text-xs sm:text-sm text-body">
                New to Emir Pay?{" "}
                <Link to="/signup" className="font-semibold text-secondary hover:underline">
                  Create an account
                </Link>
              </p>
            )}
          </form>
        </div>
        <p className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-center text-xs text-body">
          <Lock className="h-3.5 w-3.5 shrink-0 text-secondary" />
          <span>Secured connection · Emir Pay never asks for your PIN</span>
        </p>
      </div>
    </div>
  );
}
