import { useState } from "react";
import { Link, useNavigate } from "react-router";
import AuthLayout from "../components/AuthLayout";
import { ShieldIcon, AlertIcon } from "../components/Icons";
import { register } from "../api";

const inputClass =
  "h-12 w-full rounded-[10px] border border-slate-300 bg-white px-3.5 text-[15px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      Icon={ShieldIcon}
      heading="Start your"
      highlight="private vault."
      text="Create an account and every note you write is tied to you alone."
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">Create your account</h1>
        <p className="text-[15px] text-slate-600">It only takes an email and a password.</p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
        >
          <AlertIcon className="w-[18px] h-[18px] shrink-0" strokeWidth={2.2} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
          <p className="text-[13px] text-slate-600">At least 6 characters.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 h-12 rounded-[10px] bg-blue-600 text-[15px] font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link to="/login" className="font-bold text-blue-600 hover:text-blue-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;