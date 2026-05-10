import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { UserRole } from "../../types";

export default function SignupPage() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup({ name, email, password, role });
      showToast("success", "Account created successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell flex min-h-screen items-center justify-center px-4">
      <div className="card w-full max-w-md p-6">
        <h1 className="text-2xl font-semibold text-slate-100">Create Account</h1>
        <p className="mt-1 text-sm text-slate-400">Join your team workspace and start tracking tasks.</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="input" required />
          </div>
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
              minLength={6}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="input"
            >
              <option value="Member">Member</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          Already registered?{" "}
          <Link href="/auth/login" className="text-sky-400 hover:text-sky-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
