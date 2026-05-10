import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="app-shell flex min-h-screen items-center justify-center">
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
};
