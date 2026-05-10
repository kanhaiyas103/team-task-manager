import { TaskStatus } from "../../types";

const statusStyles: Record<TaskStatus, string> = {
  Todo: "border border-slate-600 bg-slate-700/70 text-slate-100",
  "In Progress": "border border-amber-500/40 bg-amber-500/20 text-amber-200",
  Done: "border border-emerald-500/40 bg-emerald-500/20 text-emerald-200"
};

export const StatusBadge = ({ status }: { status: TaskStatus }) => {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};
