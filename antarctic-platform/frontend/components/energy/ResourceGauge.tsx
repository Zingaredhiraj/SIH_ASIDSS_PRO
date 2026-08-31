import React from 'react'

export function ResourceGauge({ label, value = 0 }: { label: string; value?: number }) {
  const safeVal = isNaN(value) ? 0 : Math.max(0, Math.min(100, value));
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeVal / 100) * circumference;

  let color = '#17A88E'; // teal / good
  let bg = 'rgba(23,168,142,0.1)';
  if (safeVal < 25) {
    color = '#DC5B54'; // red
    bg = 'rgba(220,91,84,0.1)';
  } else if (safeVal < 45) {
    color = '#D9A441'; // amber
    bg = 'rgba(217,164,65,0.1)';
  }

  return (
    <div className="bg-white border border-[#E4EBF2] rounded-[20px] shadow-card p-5 flex flex-col items-center justify-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative w-28 h-28">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke="#EEF4F9"
            strokeWidth="7"
            fill="transparent"
          />
          <circle
            cx="56"
            cy="56"
            r={radius}
            stroke={color}
            strokeWidth="7"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-display font-extrabold" style={{ color }}>
            {safeVal.toFixed(0)}%
          </span>
        </div>
      </div>
      <div className="mt-3 text-[11.5px] font-bold tracking-wider text-[#64748B] uppercase">
        {label}
      </div>
    </div>
  )
}
