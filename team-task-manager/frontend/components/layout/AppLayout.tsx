import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../contexts/AuthContext";

const navLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects", label: "Projects" },
  { href: "/tasks", label: "Tasks" }
];

const activeClasses = "bg-sky-500 text-slate-950";
const idleClasses = "text-slate-200 hover:bg-slate-800";

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl">
        <aside className="hidden w-64 border-r border-slate-800 bg-slate-950/80 px-4 py-6 md:block">
          <h1 className="text-xl font-semibold text-sky-400">Team Task Manager</h1>
          <p className="mt-1 text-sm text-slate-400">Role: {user?.role}</p>
          <nav className="mt-8 space-y-2">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block rounded-md px-3 py-2 text-sm font-medium transition ${
                    isActive ? activeClasses : idleClasses
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-8">
          <header className="card mb-6 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Welcome back</p>
              <p className="text-lg font-semibold text-slate-100">{user?.name}</p>
            </div>
            <button onClick={logout} className="btn-secondary">
              Logout
            </button>
          </header>
          <nav className="card mb-6 flex gap-2 p-2 md:hidden">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex-1 rounded-md px-3 py-2 text-center text-sm font-medium transition ${
                    isActive ? activeClasses : idleClasses
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          {children}
        </main>
      </div>
    </div>
  );
};
