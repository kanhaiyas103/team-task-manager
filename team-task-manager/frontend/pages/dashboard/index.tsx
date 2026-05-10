import { useEffect, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { StatCard } from "../../components/ui/StatCard";
import { useToast } from "../../contexts/ToastContext";
import { api, getErrorMessage } from "../../lib/api";
import { DashboardStats } from "../../types";

export default function DashboardPage() {
  const { showToast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get<{ success: boolean; stats: DashboardStats }>("/dashboard/stats");
        setStats(response.data.stats);
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        showToast("error", message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <ProtectedRoute>
      <AppLayout>
        <section>
          <h2 className="text-2xl font-semibold text-slate-100">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-400">Monitor current workload and team progress.</p>
        </section>
        {loading ? <div className="mt-6"><LoadingState message="Loading dashboard metrics..." /></div> : null}
        {error ? <p className="mt-6 text-rose-300">{error}</p> : null}
        {stats ? (
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Projects" value={stats.totalProjects} />
            <StatCard title="Total Tasks" value={stats.totalTasks} />
            <StatCard title="Completed" value={stats.completedTasks} />
            <StatCard title="Pending" value={stats.pendingTasks} />
            <StatCard title="Overdue" value={stats.overdueTasks} />
          </section>
        ) : !loading && !error ? (
          <div className="mt-6">
            <EmptyState
              title="No dashboard data yet"
              description="Create your first project and assign tasks to start seeing analytics here."
            />
          </div>
        ) : null}
      </AppLayout>
    </ProtectedRoute>
  );
}
