import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export default function LoginPage() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password });
      showToast("success", "Login successful");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-slate-100">Login</h1>
        <p className="mt-1 text-sm text-slate-400">Access your Team Task Manager workspace.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="input"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="input"
              required
            />
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          No account?{" "}
          <Link href="/auth/signup" className="text-sky-400 hover:text-sky-300">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
