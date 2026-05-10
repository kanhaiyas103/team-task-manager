interface StatCardProps {
  title: string;
  value: number;
  hint?: string;
}

export const StatCard = ({ title, value, hint }: StatCardProps) => {
  return (
    <div className="card p-5">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-100">{value}</p>
      {hint ? <p className="mt-2 text-xs text-slate-500">{hint}</p> : null}
    </div>
  );
};
