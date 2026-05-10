interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-700 bg-slate-950/40 px-6 py-10 text-center">
      <div className="mb-3 h-10 w-10 rounded-full border border-slate-700 bg-slate-900" />
      <p className="text-base font-medium text-slate-100">{title}</p>
      <p className="mt-1 max-w-md text-sm text-slate-400">{description}</p>
    </div>
  );
};
