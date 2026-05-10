import { FormEvent, useEffect, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { api, getErrorMessage } from "../../lib/api";
import { getEntityId } from "../../lib/ids";
import { Project, User } from "../../types";

interface ProjectsResponse {
  success: boolean;
  projects: Project[];
}

export default function ProjectsPage() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [memberQuery, setMemberQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAdmin = user?.role === "Admin";

  const loadProjects = async () => {
    const response = await api.get<ProjectsResponse>("/projects");
    setProjects(response.data.projects);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadProjects();
        if (isAdmin) {
          const usersResp = await api.get<{ success: boolean; users: User[] }>("/auth/users");
          setUsers(usersResp.data.users);
        }
      } catch (err) {
        const message = getErrorMessage(err);
        setError(message);
        showToast("error", message);
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, [isAdmin]);

  const toggleMember = (id: string) => {
    setMemberIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  const filteredUsers = users.filter((member) => {
    const normalized = memberQuery.trim().toLowerCase();
    if (!normalized) {
      return true;
    }
    return (
      member.name.toLowerCase().includes(normalized) ||
      member.email.toLowerCase().includes(normalized) ||
      member.role.toLowerCase().includes(normalized)
    );
  });

  const handleCreateProject = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/projects", { title, description, members: memberIds });
      setTitle("");
      setDescription("");
      setMemberIds([]);
      setMemberQuery("");
      await loadProjects();
      showToast("success", "Project created successfully");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast("error", message);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <section className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-100">Projects</h2>
            <p className="mt-1 text-sm text-slate-400">Track project ownership and team members.</p>
          </div>
        </section>

        {isAdmin ? (
          <form onSubmit={handleCreateProject} className="card mt-6 grid gap-4 p-5">
            <h3 className="text-lg font-semibold text-slate-100">Create Project</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Project title"
                required
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                placeholder="Project description"
                required
              />
            </div>
            <div>
              <p className="mb-2 text-sm text-slate-300">Add members (optional)</p>
              <input
                value={memberQuery}
                onChange={(e) => setMemberQuery(e.target.value)}
                className="input mb-3"
                placeholder="Search by name, email, or role"
              />
              <div className="max-h-48 space-y-2 overflow-y-auto rounded-md border border-slate-800 bg-slate-950/60 p-3">
                {users.length === 0 ? (
                  <p className="text-sm text-slate-500">No users found.</p>
                ) : filteredUsers.length === 0 ? (
                  <p className="text-sm text-slate-500">No users match your search.</p>
                ) : (
                  filteredUsers.map((member) => {
                    const memberId = getEntityId(member);
                    if (!memberId) {
                      return null;
                    }
                    const selected = memberIds.includes(memberId);
                    return (
                      <label
                        key={memberId}
                        className={`flex cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-sm ${
                          selected
                            ? "border-sky-400 bg-sky-500/20 text-sky-300"
                            : "border-slate-700 text-slate-300"
                        }`}
                      >
                        <div>
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-slate-400">{member.email}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleMember(memberId)}
                          className="h-4 w-4 accent-sky-500"
                        />
                      </label>
                    );
                  })
                )}
              </div>
              {memberIds.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {memberIds.map((id) => {
                    const selectedUser = users.find((entry) => getEntityId(entry) === id);
                    return (
                      <span
                        key={id}
                        className="rounded-full border border-sky-500/50 bg-sky-500/15 px-2.5 py-1 text-xs text-sky-200"
                      >
                        {selectedUser?.name || id}
                      </span>
                    );
                  })}
                </div>
              ) : null}
            </div>
            <div>
              <button className="btn-primary" disabled={!title.trim() || !description.trim()}>
                Create Project
              </button>
            </div>
          </form>
        ) : null}

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <section className="card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Description</th>
                  <th className="px-4 py-3 text-left">Owner</th>
                  <th className="px-4 py-3 text-left">Members</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="table-cell" colSpan={4}>
                      <LoadingState message="Loading projects..." />
                    </td>
                  </tr>
                ) : projects.length === 0 ? (
                  <tr>
                    <td className="table-cell" colSpan={4}>
                      <EmptyState
                        title="No projects yet"
                        description="Create your first project to start assigning tasks and tracking team progress."
                      />
                    </td>
                  </tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project._id} className="hover:bg-slate-900/60">
                      <td className="table-cell align-top">
                        <p className="font-medium text-slate-100">{project.title}</p>
                      </td>
                      <td className="table-cell align-top text-slate-300">{project.description}</td>
                      <td className="table-cell align-top">{project.createdBy.name}</td>
                      <td className="table-cell align-top">
                        <div className="flex flex-wrap gap-1.5">
                          {project.members.map((m) => (
                            <span
                              key={getEntityId(m)}
                              className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs"
                            >
                              {m.name}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </AppLayout>
    </ProtectedRoute>
  );
}
