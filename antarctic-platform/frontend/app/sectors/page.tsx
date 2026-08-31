'use client'
import Link from 'next/link'

const BHARATI_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bharati_permanent_Antarctic_research_station.jpg/1280px-Bharati_permanent_Antarctic_research_station.jpg'

const SECTORS = [
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z"/>
      </svg>
    ),
    title: 'Energy Management',
    desc: 'Power generation, microgrid mix, consumption tracking, and renewable optimization',
    href: '/dashboard',
    bg: 'rgba(47,143,224,0.12)',
    fg: '#2F8FE0'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v20M6 2a4 4 0 000 8M18 2v20M18 8V2a3 3 0 00-3 3v3a3 3 0 003 3z"/>
      </svg>
    ),
    title: 'Food & Supplies',
    desc: 'Rations, nutritional inventory, resupply schedules, and perishables tracking',
    href: '/logistics',
    bg: 'rgba(224,138,60,0.14)',
    fg: '#E08A3C'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2s7 8 7 13a7 7 0 11-14 0c0-5 7-13 7-13z"/>
      </svg>
    ),
    title: 'Water Management',
    desc: 'Snowmelt plant yield, tank reserves, greywater recycling, and consumption rates',
    href: '/dashboard',
    bg: 'rgba(47,143,224,0.12)',
    fg: '#2F8FE0'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09a1.7 1.7 0 00-1-1.55 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-1.55-1H3a2 2 0 110-4h.09A1.7 1.7 0 004.6 9a1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-1.55V3a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.4 9c.14.36.5.94 1.55 1H21a2 2 0 110 4h-.09a1.7 1.7 0 00-1.51 1z"/>
      </svg>
    ),
    title: 'Equipment & Inventory',
    desc: 'Critical spares, scientific instruments, generator status, and stock alerts',
    href: '/logistics',
    bg: 'rgba(18,35,59,0.08)',
    fg: '#12233B'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="7" width="15" height="10" rx="1.5"/>
        <path d="M16 10h4l3 3v4h-7z"/>
        <circle cx="6" cy="19" r="2"/>
        <circle cx="18" cy="19" r="2"/>
      </svg>
    ),
    title: 'Logistics & Transportation',
    desc: 'Air / sea transport windows, icebreaker shipments, and convoy route management',
    href: '/logistics',
    bg: 'rgba(47,143,224,0.12)',
    fg: '#2F8FE0'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>
        <circle cx="12" cy="12" r="4"/>
      </svg>
    ),
    title: 'Environmental Monitoring',
    desc: 'Surface temperature, blizzard warnings, barometric trends, and hazard thresholds',
    href: '/environment',
    bg: 'rgba(23,168,142,0.13)',
    fg: '#17A88E'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4"/>
        <path d="M2 21v-2a5 5 0 015-5h4a5 5 0 015 5v2"/>
        <path d="M17 3.13a4 4 0 010 7.75M22 21v-2a4 4 0 00-3-3.87"/>
      </svg>
    ),
    title: 'Scientist & Station Ops',
    desc: 'Personnel readiness, shift matrices, access control, and expedition tracking',
    href: '/personnel',
    bg: 'rgba(47,143,224,0.12)',
    fg: '#2F8FE0'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"/>
        <path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>
      </svg>
    ),
    title: 'AI Insights & Emergency',
    desc: 'Polar AI assistant, SOP neural search, incident escalation, and muster tracking',
    href: '/polar-ai',
    bg: 'rgba(139,111,224,0.14)',
    fg: '#8B6FE0'
  },
]

export default function SectorsPage() {
  return (
    <div className="space-y-6">
      {/* ── Banner ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-[20px] p-8 md:p-10 bg-[#12233B] shadow-card">
        <img
          src={BHARATI_URL}
          alt="Bharati Station"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#12233B] via-[#12233B]/90 to-transparent" />
        
        <div className="relative z-10 max-w-xl">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#17A88E] bg-[rgba(23,168,142,0.15)] px-2.5 py-1 rounded-full">
            Station Operations Architecture
          </span>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white mt-3 mb-2">
            Select an Operational Sector
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            Direct access to dedicated remote management modules for Indian Antarctic Research Stations Maitri & Bharati.
          </p>
        </div>
      </div>

      {/* ── Sector Grid ─────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SECTORS.map(s => (
          <Link
            key={s.title}
            href={s.href}
            className="sector-card flex flex-col justify-between group"
          >
            <div>
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                style={{ background: s.bg, color: s.fg }}
              >
                {s.icon}
              </div>
              <h4 className="font-display font-extrabold text-[15px] text-[#12233B] mb-1.5 group-hover:text-[#2F8FE0] transition-colors">
                {s.title}
              </h4>
              <p className="text-xs text-[#64748B] leading-relaxed">
                {s.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-[#F5F8FB] flex items-center justify-between text-xs font-semibold text-[#2F8FE0]">
              <span>Open Sector</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
