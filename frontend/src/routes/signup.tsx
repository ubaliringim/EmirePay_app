import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthShell } from "@/components/auth-shell";
import { ActionButton, Field } from "@/components/ui-kit";

export function SignUp() {
  const navigate = useNavigate();
  return (
    <AuthShell
      eyebrow="Sign up"
      title="Create your account"
      subtitle="It takes under a minute to start paying bills with Emir Pay."
    >
      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/app");
        }}
      >
        <Field
          id="name"
          label="Full Name"
          placeholder="Amina Yusuf"
          autoComplete="name"
          className="!py-2 !px-3 text-sm"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="!py-2 !px-3 text-sm"
          />
          <Field
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="0801 234 5678"
            autoComplete="tel"
            className="!py-2 !px-3 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="!py-2 !px-3 text-sm"
          />
          <Field
            id="confirm"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="!py-2 !px-3 text-sm"
          />
        </div>

        <label className="flex items-start gap-2 text-xs text-body cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-[var(--color-secondary)] shrink-0"
          />
          <span>
            I agree to the{" "}
            <a href="#" className="font-semibold text-secondary underline-offset-2 hover:underline">
              Terms &amp; Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="font-semibold text-secondary underline-offset-2 hover:underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        <ActionButton type="submit" variant="primary" size="block" className="!py-2.5 text-sm">
          Create Account
        </ActionButton>

        <p className="text-center text-xs text-body pt-0.5">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-secondary hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
