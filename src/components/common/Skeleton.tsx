export interface SkeletonProps {
  count?: number;
}

export const Skeleton = ({ count = 9 }: SkeletonProps) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className="h-68 animate-pulse rounded-2xl border border-slate-200/60 bg-white p-5 shadow-sm sm:h-72 sm:p-6 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="h-5 w-3/4 rounded bg-slate-200" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="h-4 w-5/6 rounded bg-slate-100" />
              <div className="h-4 w-2/3 rounded bg-slate-100" />
            </div>
            <div className="flex gap-2 pt-2">
              <div className="h-5 w-14 rounded-full bg-slate-200" />
              <div className="h-5 w-16 rounded-full bg-slate-200" />
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4">
            <div className="h-9 w-full rounded-xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
};
