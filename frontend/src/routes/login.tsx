import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { ActionButton, Field } from "@/components/ui-kit";

export function LogIn() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-canvas-soft flex items-center justify-center px-5">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Wordmark />
        </div>
        <div className="surface-card p-7 sm:p-9">
          <p className="text-sm font-bold tracking-widest text-secondary uppercase">Log in</p>
          <h1 className="mt-2 text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-sm text-body">
            Sign in to your Emir Pay wallet to continue.
          </p>
          <form
            className="mt-7 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate("/app");
            }}
          >
            <Field
              id="identifier"
              label="Email or Phone"
              placeholder="you@example.com or 0801 234 5678"
              autoComplete="username"
            />
            <Field
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-body">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border accent-[var(--color-secondary)]"
                />
                Keep me signed in
              </label>
              <a href="#" className="font-semibold text-secondary hover:underline">
                Forgot Password?
              </a>
            </div>

            <ActionButton type="submit" variant="primary" size="block">
              Log In
            </ActionButton>

            <p className="text-center text-sm text-body">
              New to Emir Pay?{" "}
              <Link to="/signup" className="font-semibold text-secondary hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-body">
          <Lock className="h-3.5 w-3.5 text-secondary" /> Secured connection · Emir Pay never asks
          for your PIN
        </p>
      </div>
    </div>
  );
}
