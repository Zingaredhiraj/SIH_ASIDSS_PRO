'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { login } from '@/lib/api/admin'

const DEMO_USERS = [
  { email: 'admin@antarctic.in',     password: 'Admin@1234',    role: 'Admin',          roleColor: 'bg-red-500/15 text-red-700 border-red-200' },
  { email: 'operator@antarctic.in',  password: 'Operator@1234', role: 'Operator',       roleColor: 'bg-blue-500/15 text-blue-700 border-blue-200' },
  { email: 'scientist@antarctic.in', password: 'Scientist@1234',role: 'Scientist',      roleColor: 'bg-emerald-500/15 text-emerald-700 border-emerald-200' },
  { email: 'security@antarctic.in',  password: 'Security@1234', role: 'Security',       roleColor: 'bg-amber-500/15 text-amber-700 border-amber-200' },
  { email: 'hq@ncpor.gov.in',        password: 'NCPOR@1234',    role: 'NCPOR HQ',       roleColor: 'bg-purple-500/15 text-purple-700 border-purple-200' },
]

export default function LoginPage() {
  const [mode, setMode]                 = useState<'login' | 'register'>('login')
  const [email, setEmail]               = useState('')
  const [password, setPassword]         = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [selectedStation, setSelectedStation] = useState<'maitri' | 'bharati'>('maitri')
  const [name, setName]                 = useState('')
  const [role, setRole]                 = useState('scientist')
  const [error, setError]               = useState('')
  const [successMsg, setSuccessMsg]     = useState('')
  const [loading, setLoading]           = useState(false)
  const [showDemo, setShowDemo]         = useState(false)
  const { login: setAuth }              = useAuth()
  const router                          = useRouter()

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccessMsg('')
    try {
      const res = await login(email, password)
      setAuth(res.access_token, res.user)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccessMsg('')
    // Fast verification feedback
    setTimeout(() => {
      setLoading(false)
      setSuccessMsg(`Registration request submitted for ${name || email}. Please select your demo role below or sign in.`)
      setMode('login')
    }, 800)
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#061426] overflow-hidden select-none font-sans">
      
      {/* ── Background: High-Res Antarctic Ice & Aurora Landscape ──────────────── */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at top right, rgba(47, 143, 224, 0.35), transparent 60%),
            radial-gradient(ellipse at bottom left, rgba(23, 168, 142, 0.30), transparent 55%),
            linear-gradient(135deg, rgba(6, 20, 38, 0.82) 0%, rgba(8, 28, 54, 0.70) 50%, rgba(3, 12, 24, 0.92) 100%),
            url('https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=2000&q=85')
          `,
        }}
      />

      {/* Dynamic Aurora & Atmospheric Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-[32rem] h-[32rem] bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Polar Grid Coordinate Lines */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* ── Main 90% Glassmorphic Shell ────────────────────────────────────────── */}
      <div className="relative z-10 w-[94%] max-w-[1140px] h-[92vh] max-h-[720px] rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-[0_25px_70px_rgba(0,0,0,0.55)] border border-white/20 backdrop-blur-2xl bg-white/[0.08]">
        
        {/* ── LEFT PANEL: 90% Frosted Glass Hero Visual ────────────────────────── */}
        <div className="relative w-full md:w-[48%] h-full p-8 md:p-10 flex flex-col justify-between overflow-hidden border-b md:border-b-0 md:border-r border-white/15 bg-gradient-to-b from-slate-950/75 via-slate-900/65 to-sky-950/80 backdrop-blur-3xl text-white">
          
          {/* Subtle frosted glass ambient highlight */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-400 p-[1.5px] shadow-[0_0_20px_rgba(47,143,224,0.4)]">
                <div className="w-full h-full bg-[#07172c]/90 backdrop-blur-sm rounded-[14px] flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 19h20L12 2zm0 4.5l5.5 9.5h-11L12 6.5z"/>
                  </svg>
                </div>
              </div>
              <div>
                <span className="text-[14px] font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-300">
                  ANTARCTICA · ASIDSS
                </span>
                <p className="text-[10.5px] font-semibold text-cyan-200/70 tracking-wider">
                  MoES · NCPOR · DIGITAL TWIN PLATFORM
                </p>
              </div>
            </div>
          </div>

          {/* Center Showcase */}
          <div className="relative z-10 my-auto py-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 text-[11.5px] font-bold mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>POLAR TELEMETRY LIVE</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold leading-[1.2] text-white tracking-tight">
              Extreme Environment <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-teal-200">
                Decision Support System
              </span>
            </h1>

            <p className="mt-3 text-[13px] leading-relaxed text-slate-300/85 max-w-[390px]">
              Real-time multi-station digital twin, automated disaster mitigation, polar life-support monitoring, and Groq-accelerated autonomous emergency intelligence.
            </p>

            {/* Live Station Micro-Cards */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {/* Maitri Card */}
              <div className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                    Maitri Station
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">-28.4°C</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Power Load</span>
                  <span className="font-mono text-white font-semibold">68 kW · Normal</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full w-[78%]" />
                </div>
              </div>

              {/* Bharati Card */}
              <div className="p-3.5 rounded-2xl bg-white/[0.07] border border-white/15 backdrop-blur-xl hover:border-cyan-400/40 transition-all duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_#2dd4bf]" />
                    Bharati Station
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">-19.2°C</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-300">
                  <span>SATCOM Link</span>
                  <span className="font-mono text-emerald-300 font-semibold">99.8% Online</span>
                </div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-full w-[95%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Coordinates & Security Indicator */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span className="font-mono">70°46&apos;00&quot; S · 11°44&apos;00&quot; E</span>
            <span className="flex items-center gap-1.5 text-cyan-300 font-medium">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              Level 4 Clearance Encrypted
            </span>
          </div>
        </div>

        {/* ── RIGHT PANEL: 90% Glassmorphic Login & Registration Card ──────────── */}
        <div className="relative w-full md:w-[52%] h-full p-8 md:p-11 flex flex-col justify-between overflow-y-auto bg-white/[0.88] dark:bg-slate-900/[0.88] backdrop-blur-3xl">
          
          <div className="max-w-[400px] w-full mx-auto my-auto">
            
            {/* Mode Switcher Pills (Sign In / Register) */}
            <div className="p-1 rounded-2xl bg-slate-200/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-300/60 dark:border-slate-700/60 flex items-center mb-6 shadow-inner">
              <button
                type="button"
                onClick={() => { setMode('login'); setError(''); setSuccessMsg('') }}
                className={`flex-1 py-2 text-[13px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  mode === 'login'
                    ? 'bg-white dark:bg-slate-900 text-[#12233B] dark:text-cyan-400 shadow-[0_4px_12px_rgba(0,0,0,0.10)] border border-slate-200/80 dark:border-slate-700'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                </svg>
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); setSuccessMsg('') }}
                className={`flex-1 py-2 text-[13px] font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 ${
                  mode === 'register'
                    ? 'bg-white dark:bg-slate-900 text-[#12233B] dark:text-cyan-400 shadow-[0_4px_12px_rgba(0,0,0,0.10)] border border-slate-200/80 dark:border-slate-700'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM19 8v6M22 11h-6"/>
                </svg>
                Operator Register
              </button>
            </div>

            {/* Header Text */}
            <div className="mb-6">
              <h2 className="text-[22px] font-black text-[#12233B] dark:text-white tracking-tight">
                {mode === 'login' ? 'Station Access Sign In' : 'Station Personnel Enrollment'}
              </h2>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 mt-1">
                {mode === 'login'
                  ? 'Enter your certified NCPOR/MoES credentials to enter operations'
                  : 'Register a new expedition researcher, officer, or technician'}
              </p>
            </div>

            {/* Notifications */}
            {error && (
              <div className="mb-4 text-[12.5px] font-semibold text-rose-600 bg-rose-500/10 border border-rose-200/80 rounded-2xl p-3 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 text-[12.5px] font-semibold text-emerald-700 bg-emerald-500/10 border border-emerald-200/80 rounded-2xl p-3 flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <span>{successMsg}</span>
              </div>
            )}

            {/* ── Form Section ────────────────────────────────────────────── */}
            {mode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#12233B] dark:text-slate-200 mb-1.5">
                    Official Email / Personnel ID
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. admin@antarctic.in"
                      className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-[13.5px] text-[#12233B] dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all shadow-sm"
                      required
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-bold text-[#12233B] dark:text-slate-200">
                      Security Passcode
                    </label>
                    <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold cursor-pointer hover:underline" onClick={() => setShowDemo(true)}>
                      Need credentials?
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-[13.5px] text-[#12233B] dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all shadow-sm"
                      required
                    />
                    <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#102744] via-[#1a3a60] to-[#0d507b] hover:from-[#173b66] hover:to-[#0f6299] text-white text-[13.5px] font-bold shadow-[0_8px_20px_rgba(18,35,59,0.30)] hover:shadow-[0_10px_24px_rgba(15,98,153,0.40)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"/>
                      </svg>
                      Authenticating System...
                    </span>
                  ) : (
                    <>
                      <span>Sign In to Station Operations</span>
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[12px] font-bold text-[#12233B] dark:text-slate-200 mb-1">
                    Personnel Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Dr. Rajesh Sharma"
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-[13px] text-[#12233B] dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-[#12233B] dark:text-slate-200 mb-1">
                      Assigned Station
                    </label>
                    <select
                      value={selectedStation}
                      onChange={e => setSelectedStation(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-[12.5px] text-[#12233B] dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/40"
                    >
                      <option value="maitri">Maitri Station</option>
                      <option value="bharati">Bharati Station</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-[#12233B] dark:text-slate-200 mb-1">
                      Role / Clearance
                    </label>
                    <select
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      className="w-full px-3 py-2 rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-[12.5px] text-[#12233B] dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/40"
                    >
                      <option value="scientist">Scientist</option>
                      <option value="operator">Operator</option>
                      <option value="security_officer">Security Officer</option>
                      <option value="station_commander">Station Commander</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#12233B] dark:text-slate-200 mb-1">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="user@antarctic.in"
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-[13px] text-[#12233B] dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#12233B] dark:text-slate-200 mb-1">
                    Create Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-3.5 py-2 rounded-2xl border border-slate-300/80 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 text-[13px] text-[#12233B] dark:text-white outline-none focus:ring-2 focus:ring-cyan-500/40 shadow-sm"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-700 hover:from-teal-500 hover:to-blue-600 text-white text-[13.5px] font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? 'Submitting Application...' : 'Register Station Personnel'}
                </button>
              </form>
            )}

            {/* ── Demo Credentials Glass Drawer ───────────────────────────── */}
            <div className="mt-6 pt-4 border-t border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowDemo(!showDemo)}
                  className="inline-flex items-center gap-2 text-[12px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#12233B] dark:hover:text-cyan-400 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-600 dark:text-cyan-300">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                    </svg>
                  </div>
                  <span>1-Click Demo Accounts</span>
                  <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${showDemo ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <span className="text-[11px] font-mono text-slate-400">Pre-seeded</span>
              </div>

              {showDemo && (
                <div className="mt-3 grid grid-cols-1 gap-1.5 p-2 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 backdrop-blur-md animate-fadeIn">
                  {DEMO_USERS.map(u => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => {
                        setEmail(u.email)
                        setPassword(u.password)
                        setMode('login')
                        setError('')
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-xl hover:bg-white dark:hover:bg-slate-700/90 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span className="text-[12px] font-mono text-slate-700 dark:text-slate-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-300">
                          {u.email}
                        </span>
                      </div>
                      <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold border ${u.roleColor}`}>
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Footer Security Badge */}
          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span>Ministry of Earth Sciences (MoES) · NCPOR Antarctic Ops Network</span>
          </div>

        </div>

      </div>

    </div>
  )
}
