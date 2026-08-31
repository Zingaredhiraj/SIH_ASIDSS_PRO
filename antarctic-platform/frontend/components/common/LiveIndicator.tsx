import React from 'react'

export function LiveIndicator({ status }: { status: 'live' | 'reconnecting' | 'offline' | 'connecting' | 'error' }) {
  if (status === 'live') {
    return (
      <div className="flex items-center space-x-1 text-green-500">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping absolute" />
        <div className="w-2 h-2 rounded-full bg-green-500 relative" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">LIVE</span>
      </div>
    );
  }
  
  if (status === 'reconnecting' || status === 'connecting') {
    return (
      <div className="flex items-center space-x-1 text-amber-500">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-widest">RECONNECTING...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-red-500">
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <span className="text-[10px] font-mono font-bold uppercase tracking-widest">OFFLINE</span>
    </div>
  );
}
