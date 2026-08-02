import { useNavigate, Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Wordmark } from "@/components/wordmark";
import { ActionButton, Field } from "@/components/ui-kit";

export function LogIn() {
  const navigate = useNavigate();
  return (
    <div className="h-screen max-h-screen w-full bg-canvas-soft flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      <div className="w-full max-w-[360px] my-auto">
        <div className="surface-card p-4 sm:p-5">
          <div className="mb-3 flex justify-center">
            <Wordmark imgClassName="h-12 w-auto" />
          </div>
          <p className="text-[11px] font-bold tracking-widest text-secondary uppercase">Log in</p>
          <h1 className="mt-0.5 text-xl font-black">Welcome back</h1>
          <p className="mt-1 text-xs text-body">
            Sign in to your Emir Pay wallet to continue.
          </p>
          <form
            className="mt-4 space-y-3"
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
              className="!py-2 !px-3 text-sm"
            />
            <Field
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              className="!py-2 !px-3 text-sm"
            />

            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <label className="flex items-center gap-1.5 text-body cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="h-3.5 w-3.5 rounded border-border accent-[var(--color-secondary)]"
                />
                Keep me signed in
              </label>
              <a href="#" className="font-semibold text-secondary hover:underline">
                Forgot Password?
              </a>
            </div>

            <ActionButton type="submit" variant="primary" size="block" className="!py-2.5 text-sm">
              Log In
            </ActionButton>

            <p className="text-center text-xs text-body pt-0.5">
              New to Emir Pay?{" "}
              <Link to="/signup" className="font-semibold text-secondary hover:underline">
                Create an account
              </Link>
            </p>
          </form>
        </div>
        <p className="mt-3 flex flex-wrap items-center justify-center gap-1 text-center text-[11px] text-body">
          <Lock className="h-3 w-3 shrink-0 text-secondary" />
          <span>Secured connection · Emir Pay never asks for your PIN</span>
        </p>
      </div>
    </div>
  );
}
