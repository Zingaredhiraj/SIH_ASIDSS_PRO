import React from 'react'
import { AlertTriangle, RefreshCcw } from 'lucide-react'

export function ErrorFallback({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center h-full">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4 opacity-80" />
      <p className="text-red-400 font-mono text-sm mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="flex items-center px-4 py-2 bg-navy-800 border border-polar-border hover:bg-navy-700 text-gray-300 rounded text-sm transition-colors"
        >
          <RefreshCcw className="w-4 h-4 mr-2" />
          Retry
        </button>
      )}
    </div>
  );
}
