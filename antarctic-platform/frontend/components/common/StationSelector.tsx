'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

interface StationContextType {
  stationId: string;
  setStationId: (id: string) => void;
}

export const StationContext = createContext<StationContextType>({
  stationId: 'maitri',
  setStationId: () => {},
});

export function StationProvider({ children }: { children: ReactNode }) {
  const [stationId, setStationId] = useState('maitri');

  return (
    <StationContext.Provider value={{ stationId, setStationId }}>
      {children}
    </StationContext.Provider>
  );
}

export function useStation() {
  return useContext(StationContext);
}

export function StationSelector() {
  const { stationId, setStationId } = useStation();

  return (
    <div className="flex items-center space-x-2 mt-4 px-2">
      <button 
        onClick={() => setStationId('maitri')}
        className={`flex-1 py-1 px-2 rounded text-xs font-mono border ${stationId === 'maitri' || stationId === 'STA-001' ? 'bg-ice-500 border-ice-400 text-navy-900 font-bold' : 'border-polar-border text-gray-400 hover:text-white'}`}
      >
        MAITRI
      </button>
      <button 
        onClick={() => setStationId('bharati')}
        className={`flex-1 py-1 px-2 rounded text-xs font-mono border ${stationId === 'bharati' || stationId === 'STA-002' ? 'bg-ice-500 border-ice-400 text-navy-900 font-bold' : 'border-polar-border text-gray-400 hover:text-white'}`}
      >
        BHARATI
      </button>
    </div>
  );
}
