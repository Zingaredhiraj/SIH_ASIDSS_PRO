import { AlertTriangle } from 'lucide-react'

export function SimulationTag() {
  return (
    <div className="absolute top-0 left-0 right-0 h-8 bg-amber-500/20 border-b border-amber-500/30 flex items-center justify-center z-10 backdrop-blur-sm">
      <AlertTriangle className="w-4 h-4 text-amber-500 mr-2" />
      <span className="text-xs font-mono text-amber-500 font-medium tracking-wide">
        SIMULATION DATA — NOT REAL STATION TELEMETRY — FOR DEMONSTRATION PURPOSES ONLY
      </span>
    </div>
  );
}
