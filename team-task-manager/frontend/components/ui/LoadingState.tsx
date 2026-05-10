export const LoadingState = ({ message = "Loading..." }: { message?: string }) => {
  return (
    <div className="flex items-center gap-3 rounded-md border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-300">
      <span className="h-3 w-3 animate-spin rounded-full border-2 border-slate-600 border-t-sky-400" />
      <span>{message}</span>
    </div>
  );
};
