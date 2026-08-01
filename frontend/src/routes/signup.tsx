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
        className="space-y-5"
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/app");
        }}
      >
        <Field id="name" label="Full Name" placeholder="Amina Yusuf" autoComplete="name" />
        <Field
          id="email"
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
        />
        <Field
          id="phone"
          label="Phone Number"
          type="tel"
          placeholder="0801 234 5678"
          autoComplete="tel"
        />
        <Field
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          hint="Use at least 8 characters with a number and a symbol."
        />
        <Field
          id="confirm"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <label className="flex items-start gap-3 text-sm text-body">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 rounded border-border accent-[var(--color-secondary)]"
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

        <ActionButton type="submit" variant="primary" size="block">
          Create Account
        </ActionButton>

        <p className="text-center text-sm text-body">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-secondary hover:underline">
            Log In
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
