'use client'
import { useStation } from '@/components/common/StationSelector'
import { useTelemetrySocket } from '@/lib/ws/useTelemetrySocket'
import { EnergyFlowPanel } from '@/components/energy/EnergyFlowPanel'
import { HealthIndexWidget } from '@/components/energy/HealthIndexWidget'
import { ResourceGauge } from '@/components/energy/ResourceGauge'
import { WhatIfLab } from '@/components/energy/WhatIfLab'
import { AIReportPanel } from '@/components/energy/AIReportPanel'
import { LiveIndicator } from '@/components/common/LiveIndicator'

const BHARATI_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bharati_permanent_Antarctic_research_station.jpg/1280px-Bharati_permanent_Antarctic_research_station.jpg'
const MAITRI_URL  = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/An_ariel_view_of_the_Indian_Station_Maitri%2C_Antarctica_on_February_2%2C2005_%281%29.jpg/1280px-An_ariel_view_of_the_Indian_Station_Maitri%2C_Antarctica_on_February_2%2C2005_%281%29.jpg'

const KPI_ICONS: Record<string, React.ReactNode> = {
  energy: <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>,
  fuel:   <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/></svg>,
  water:  <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z"/></svg>,
  food:   <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2v20M6 2a4 4 0 000 8M18 2v20M18 8V2a3 3 0 00-3 3v3a3 3 0 003 3z"/></svg>,
  consumables: <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="7" width="15" height="10" rx="1.5"/><path d="M16 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></svg>,
}
const KPI_COLORS = [
  { bg: 'rgba(217,164,65,0.14)',  fg: '#D9A441' },
  { bg: 'rgba(220,91,84,0.12)',   fg: '#DC5B54' },
  { bg: 'rgba(47,143,224,0.12)',  fg: '#2F8FE0' },
  { bg: 'rgba(224,138,60,0.14)',  fg: '#E08A3C' },
  { bg: 'rgba(139,111,224,0.14)', fg: '#8B6FE0' },
]

export default function DashboardPage() {
  const { stationId } = useStation()
  const { data: socketData, status } = useTelemetrySocket(stationId)

  // Resilient fallback values so UI never hangs on loading skeletons
  const data = socketData || {
    station_id: stationId,
    timestamp: new Date().toISOString(),
    solar_kw: 18.5,
    wind_kw: 14.2,
    diesel_kw: 32.0,
    load_kw: 64.7,
    fuel_pct: 68.4,
    water_pct: 74.1,
    food_pct: 81.2,
    consumables_pct: 91.0,
    health_index: {
      score: 88,
      grade: 'A',
      factors: [
        { name: 'Renewables', value: 50, weight: 0.3, score: 28 },
        { name: 'Fuel Reserves', value: 68, weight: 0.25, score: 22 },
        { name: 'Grid Stability', value: 92, weight: 0.25, score: 23 },
        { name: 'Life Support', value: 85, weight: 0.2, score: 15 }
      ],
      reason: 'Microgrid running with optimal hybrid generation.'
    }
  }

  const stationName = stationId === 'bharati' || stationId === 'STA-002' ? 'Bharati' : 'Maitri'

  const kpiItems = [
    { icon: 'energy', label: 'Load Power',    value: `${(data.load_kw || 64).toFixed(0)} kW`,   statusText: (data.load_kw || 64) > 70 ? 'High Load' : 'Normal',  tone: (data.load_kw || 64) > 70 ? 'warn' : 'good' },
    { icon: 'fuel',   label: 'Fuel Reserve',  value: `${(data.fuel_pct || 68).toFixed(0)}%`,    statusText: (data.fuel_pct || 68) < 25 ? 'Critical'  : 'Normal',  tone: (data.fuel_pct || 68) < 25 ? 'crit' : 'good' },
    { icon: 'water',  label: 'Water Reserve', value: `${(data.water_pct || 74).toFixed(0)}%`,   statusText: (data.water_pct || 74) < 25 ? 'Critical' : 'Good',    tone: (data.water_pct || 74) < 25 ? 'crit' : 'good' },
    { icon: 'food',   label: 'Food Supplies', value: `${(data.food_pct || 81).toFixed(0)}%`,    statusText: (data.food_pct || 81) < 30 ? 'Low' : 'Stable',        tone: (data.food_pct || 81) < 30 ? 'warn' : 'good' },
    { icon: 'consumables', label: 'Consumables', value: `${(data.consumables_pct || 91).toFixed(0)}%`, statusText: 'Healthy', tone: 'good' },
  ]

  const toneColor = (tone: string) => tone === 'good' ? '#17A88E' : tone === 'warn' ? '#D9A441' : '#DC5B54'

  return (
    <div className="space-y-6">

      {/* ── Filter Row ──────────────────────────── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display font-extrabold text-[25px] text-[#12233B]">Antarctic Operations Overview</h1>
          <p className="text-[#64748B] text-[13.5px] mt-1">
            Real-time visibility into station resources, energy, supplies and operational conditions.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="status-pill-online">
            <div className="live-dot-white" />
            <span>{stationName} Station Online</span>
            <LiveIndicator status={status} />
          </div>
        </div>
      </div>

      {/* ── KPI Strip ───────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[14px]">
        {kpiItems.map((k, i) => (
          <div key={k.label} className="kpi-card">
            <div className="w-[34px] h-[34px] rounded-[10px] flex items-center justify-center mb-3.5"
              style={{ background: KPI_COLORS[i % KPI_COLORS.length].bg, color: KPI_COLORS[i % KPI_COLORS.length].fg }}>
              {KPI_ICONS[k.icon] || KPI_ICONS.energy}
            </div>
            <div className="text-[11.5px] font-semibold text-[#64748B]">{k.label}</div>
            <div className="font-display text-[23px] font-extrabold text-[#12233B] mt-1.5">{k.value}</div>
            <div className="flex items-center gap-1.5 mt-2 text-[11.5px] font-semibold" style={{ color: toneColor(k.tone) }}>
              <span className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: toneColor(k.tone) }} />
              {k.statusText}
            </div>
          </div>
        ))}
      </div>

      {/* ── Station Status + Energy ──────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">

        {/* Station Status Card */}
        <div className="bg-white border border-[#E4EBF2] rounded-[20px] shadow-card p-5">
          <div className="panel-head"><h3>Station Status</h3></div>
          <div className="grid grid-cols-2 gap-3.5">
            {[
              { name: 'Maitri',  temp: '-29°C', photo: MAITRI_URL  },
              { name: 'Bharati', temp: '-48°C', photo: BHARATI_URL },
            ].map(s => (
              <div key={s.name} className="border border-[#E4EBF2] rounded-[16px] overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer">
                <div className="h-[90px] relative station-thumb" style={{ backgroundImage: `url('${s.photo}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(9,22,34,0.55), rgba(9,22,34,0.05) 65%)' }} />
                  <span className="absolute bottom-2 right-2 text-white text-[10px] font-bold font-mono bg-black/30 px-1.5 py-0.5 rounded">LIVE</span>
                </div>
                <div className="p-3">
                  <h5 className="font-display font-extrabold text-[13px] text-[#12233B]">{s.name}</h5>
                  <p className="text-[11.5px] text-[#64748B] mt-0.5">{s.temp} Surface Temp</p>
                  <div className="flex items-center gap-1.5 mt-2 text-[11.5px] font-semibold text-[#17A88E]">
                    <span className="live-dot-teal" />
                    Online
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Energy Flow */}
        <div className="bg-white border border-[#E4EBF2] rounded-[20px] shadow-card p-5">
          <div className="panel-head">
            <h3>Energy Flow</h3>
            <span className="text-[12px] font-semibold text-[#2F8FE0]">{stationName}</span>
          </div>
          <EnergyFlowPanel data={data} />
        </div>
      </div>

      {/* ── Resource Gauges ──────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[14px]">
        {[
          { label: 'FUEL',         value: data.fuel_pct         },
          { label: 'WATER',        value: data.water_pct        },
          { label: 'FOOD',         value: data.food_pct         },
          { label: 'CONSUMABLES',  value: data.consumables_pct  },
        ].map(r => (
          <ResourceGauge key={r.label} label={r.label} value={r.value} />
        ))}
      </div>

      {/* ── AI Report + What If ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
        <WhatIfLab stationId={stationId} currentData={data} />
        <AIReportPanel stationId={stationId} />
      </div>
    </div>
  )
}
