import { FormEvent, useEffect, useMemo, useState } from "react";
import { AppLayout } from "../../components/layout/AppLayout";
import { ProtectedRoute } from "../../components/layout/ProtectedRoute";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/LoadingState";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { api, getErrorMessage } from "../../lib/api";
import { getEntityId } from "../../lib/ids";
import { Project, Task, TaskStatus, User } from "../../types";

const statusOptions: TaskStatus[] = ["Todo", "In Progress", "Done"];

export default function TasksPage() {
  const { showToast } = useToast();
  const { user } = useAuth();
  const isAdmin = user?.role === "Admin";

  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === projectId),
    [projects, projectId]
  );

  const assignableUsers = useMemo(() => {
    if (!selectedProject) {
      return [];
    }
    return selectedProject.members;
  }, [selectedProject]);

  const loadTasks = async () => {
    const response = await api.get<{ success: boolean; tasks: Task[] }>("/tasks");
    setTasks(response.data.tasks);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await loadTasks();
        if (isAdmin) {
          const projectsResp = await api.get<{ projects: Project[] }>("/projects");
          setProjects(projectsResp.data.projects);

          const usersMap = new Map<string, User>();
          projectsResp.data.projects.forEach((project) => {
            project.members.forEach((member) => {
              const memberId = getEntityId(member);
              if (memberId) {
                usersMap.set(memberId, member);
              }
            });
          });
          setUsers(Array.from(usersMap.values()));
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

  const handleCreateTask = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    try {
      await api.post("/tasks", {
        title,
        description,
        project: projectId,
        assignedTo,
        dueDate: new Date(dueDate).toISOString()
      });
      setTitle("");
      setDescription("");
      setProjectId("");
      setAssignedTo("");
      setDueDate("");
      await loadTasks();
      showToast("success", "Task created successfully");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast("error", message);
    }
  };

  const handleStatusUpdate = async (taskId: string, status: TaskStatus) => {
    setError("");
    try {
      await api.patch(`/tasks/${taskId}/status`, { status });
      await loadTasks();
      showToast("success", "Task status updated");
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      showToast("error", message);
    }
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <section>
          <h2 className="text-2xl font-semibold text-slate-100">Tasks</h2>
          <p className="mt-1 text-sm text-slate-400">Manage assignments, due dates, and status updates.</p>
        </section>

        {isAdmin ? (
          <form onSubmit={handleCreateTask} className="card mt-6 grid gap-4 p-5">
            <h3 className="text-lg font-semibold text-slate-100">Create Task</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input"
                placeholder="Task title"
                required
              />
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input"
                placeholder="Task description"
                required
              />
              <select
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  setAssignedTo("");
                }}
                className="input"
                required
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.title}
                  </option>
                ))}
              </select>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="input"
                required
                disabled={!projectId}
              >
                <option value="">Assign to member</option>
                {assignableUsers.map((member) => (
                  <option key={getEntityId(member)} value={getEntityId(member)}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <button
                className="btn-primary"
                disabled={!title.trim() || !description.trim() || !projectId || !assignedTo || !dueDate}
              >
                Create Task
              </button>
            </div>
          </form>
        ) : null}

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

        <section className="card mt-6 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[840px]">
              <thead className="table-head">
                <tr>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Project</th>
                  <th className="px-4 py-3 text-left">Assigned To</th>
                  <th className="px-4 py-3 text-left">Due Date</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Update</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td className="table-cell" colSpan={6}>
                      <LoadingState message="Loading tasks..." />
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td className="table-cell" colSpan={6}>
                      <EmptyState
                        title="No tasks yet"
                        description="Create a task and assign it to a project member to start tracking delivery."
                      />
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr key={task._id} className="hover:bg-slate-900/60">
                      <td className="table-cell align-top">
                        <p className="font-medium text-slate-100">{task.title}</p>
                        <p className="text-xs text-slate-400">{task.description}</p>
                      </td>
                      <td className="table-cell align-top">{task.project?.title || "-"}</td>
                      <td className="table-cell align-top">{task.assignedTo?.name || "-"}</td>
                      <td className="table-cell align-top">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </td>
                      <td className="table-cell align-top">
                        <StatusBadge status={task.status} />
                      </td>
                      <td className="table-cell align-top">
                        <select
                          value={task.status}
                          onChange={(e) => handleStatusUpdate(task._id, e.target.value as TaskStatus)}
                          className="input max-w-[160px]"
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
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
