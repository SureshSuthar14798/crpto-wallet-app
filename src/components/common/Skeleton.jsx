/**
 * Skeleton loading placeholders
 */
export function SkeletonLine({ width = 'full', height = '4', className = '' }) {
  return (
    <div
      className={`skeleton h-${height} rounded-lg ${width === 'full' ? 'w-full' : `w-${width}`} ${className}`}
      style={typeof width === 'string' && width.includes('%') ? { width } : {}}
    />
  );
}

export function SkeletonCircle({ size = 10, className = '' }) {
  return <div className={`skeleton rounded-full w-${size} h-${size} ${className}`} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`solid-card p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <SkeletonCircle size={10} />
        <div className="flex-1 space-y-2">
          <SkeletonLine width="2/3" height="4" />
          <SkeletonLine width="1/3" height="3" />
        </div>
      </div>
      <SkeletonLine height="3" />
      <SkeletonLine width="4/5" height="3" />
    </div>
  );
}

export function SkeletonBalance() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-4 w-24 rounded-lg" />
      <div className="skeleton h-10 w-48 rounded-xl" />
      <div className="skeleton h-4 w-32 rounded-lg" />
    </div>
  );
}

export function SkeletonAssetRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="skeleton w-11 h-11 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-24 rounded" />
        <div className="skeleton h-3 w-16 rounded" />
      </div>
      <div className="text-right space-y-2">
        <div className="skeleton h-4 w-20 rounded" />
        <div className="skeleton h-3 w-14 rounded" />
      </div>
    </div>
  );
}
