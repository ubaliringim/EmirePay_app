import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { ActionButton, Field } from "@/components/ui-kit";

export function LogIn() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-canvas-soft flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md my-auto">
        <div className="surface-card w-full max-w-full p-5 sm:p-7 shadow-lift overflow-hidden">
          <div className="mb-5 flex justify-center overflow-hidden">
            <Wordmark imgClassName="h-10 sm:h-12 max-w-full object-contain w-auto" />
          </div>
          <p className="text-xs font-bold tracking-widest text-secondary uppercase">Log in</p>
          <h1 className="mt-1 text-2xl sm:text-3xl font-black">Welcome back</h1>
          <p className="mt-1.5 text-sm text-body">
            Sign in to your Emir Pay wallet to continue.
          </p>
          <form
            className="mt-6 space-y-4"
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

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
              <label className="flex items-center gap-2 text-body cursor-pointer select-none">
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

            <p className="text-center text-xs sm:text-sm text-body">
              New to Emir Pay?{" "}
              <Link to="/signup" className="font-semibold text-secondary hover:underline">
                Create an account
              </Link>
            </p>
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
