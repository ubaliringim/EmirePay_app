import { useState, useEffect, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthShell } from "@/components/auth-shell";
import { ActionButton, Field } from "@/components/ui-kit";
import { useAuth, authErrorMessage } from "@/lib/auth";

export function SignUp() {
  const navigate = useNavigate();
  const { user, signUp } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  const validate = () => {
    if (!fullName) return "Please enter your full name.";
    if (!/\S+@\S+\.\S+/.test(email)) return "Please enter a valid email.";
    if (!/^0[789][01]\d{8}$/.test(phone)) return "Please enter a valid Nigerian phone number.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirm) return "Passwords do not match.";
    if (!acceptTerms) return "Please accept the Terms & Conditions.";
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, fullName);
    } catch (err) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Sign up"
      title="Create your account"
      subtitle="It takes under a minute to start paying bills with Emir Pay."
    >
      <form className="w-full max-w-full space-y-3.5 overflow-hidden" onSubmit={handleSubmit}>
        <Field
          id="name"
          label="Full Name"
          placeholder="Amina Yusuf"
          autoComplete="name"
          className="!py-2 !px-3 text-sm"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            id="email"
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            className="!py-2 !px-3 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            id="phone"
            label="Phone Number"
            type="tel"
            placeholder="0801 234 5678"
            autoComplete="tel"
            className="!py-2 !px-3 text-sm"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Field
            id="confirm"
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            className="!py-2 !px-3 text-sm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
        </div>

        {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}

        <label className="flex items-start gap-2 text-xs text-body cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-0.5 h-3.5 w-3.5 rounded border-border accent-[var(--color-secondary)] shrink-0"
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
          <span className="break-words leading-relaxed">
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

        <ActionButton
          type="submit"
          variant="primary"
          size="block"
          className="!py-2.5 text-sm"
          disabled={loading}
        >
          {loading ? "Creating account…" : "Create Account"}
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
