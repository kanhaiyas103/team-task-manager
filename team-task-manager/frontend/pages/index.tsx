import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return;
    }
    router.replace(user ? "/dashboard" : "/auth/login");
  }, [loading, user, router]);

  return (
    <div className="app-shell flex min-h-screen items-center justify-center">
      <p className="text-slate-300">Redirecting...</p>
    </div>
  );
}
