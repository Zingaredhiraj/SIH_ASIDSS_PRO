import React from 'react'

export function LoadingState({ rows = 3, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="h-10 skeleton rounded w-full"></div>
      ))}
    </div>
  );
}
