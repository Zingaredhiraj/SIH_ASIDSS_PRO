'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/AuthContext'
import { login, register } from '@/lib/api/admin'

const ROLES = [
  { id: 'operator',         label: 'Operations Officer',      desc: 'Telemetry, life support & sector energy control' },
  { id: 'scientist',        label: 'Research Scientist',      desc: 'Scientific instruments, experiments & field logs' },
  { id: 'security_officer', label: 'Security Officer',        desc: 'Access control, muster rolls & security alarms' },
  { id: 'admin',            label: 'Station Administrator',   desc: 'Full system control, incident escalation & policy' },
  { id: 'ncpor_hq',         label: 'NCPOR Headquarters',      desc: 'Strategic oversight, MoES dispatch & analytics' },
]

const STATIONS = [
  { id: 'maitri',  name: 'Maitri Station' },
  { id: 'bharati', name: 'Bharati Station' },
  { id: 'hq',      name: 'NCPOR Goa (HQ)' },
]

// High-resolution reliable polar research station & Antarctic landscape image
const ANTARCTIC_BG = 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=85'
const ANTARCTIC_BACKUP = 'https://images.unsplash.com/photo-1483181957632-8bda974cbc91?auto=format&fit=crop&w=1600&q=85'

export default function LoginPage() {
  const [tab, setTab]                         = useState<'login' | 'register'>('login')
  const [name, setName]                       = useState('')
  const [selectedRole, setSelectedRole]       = useState('operator')
  const [selectedStation, setSelectedStation] = useState('maitri')
  const [email, setEmail]                     = useState('')
  const [password, setPassword]               = useState('')
  const [showPassword, setShowPassword]       = useState(false)
  const [error, setError]                     = useState('')
  const [success, setSuccess]                 = useState('')
  const [loading, setLoading]                 = useState(false)
  const { login: setAuth }                    = useAuth()
  const router                                = useRouter()

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter both your email and password.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await login(email.trim(), password)

      // Role verification check
      if (res.user && res.user.role && res.user.role !== selectedRole) {
        setError(`Access Denied: This account is registered as "${res.user.role}", but you selected "${selectedRole}". Please switch the role dropdown to "${res.user.role}".`)
        setLoading(false)
        return
      }

      setAuth(res.access_token, res.user)
      router.push('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials. If this is your first time, please click "Create Account".')
    } finally {
      setLoading(false)
    }
  }

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (password.length < 5) {
      setError('Password must be at least 5 characters long.')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await register({
        name: name.trim(),
        email: email.trim(),
        password: password,
        role: selectedRole,
        station: selectedStation
      })

      setSuccess('Account created successfully! Redirecting to station operations...')
      setAuth(res.access_token, res.user)
      setTimeout(() => {
        router.push('/dashboard')
      }, 700)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 flex bg-white overflow-hidden font-sans">

      {/* ── Left: Photo Visual ─────────────────────── */}
      <div className="relative w-[46%] min-w-[400px] overflow-hidden bg-[#0c2436] hidden md:block">
        {/* Background photo */}
        <img
          src={ANTARCTIC_BG}
          alt="Antarctic Research Station"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'saturate(1.1) contrast(1.05)', transform: 'scale(1.02)' }}
          onError={(e) => {
            const target = e.target as HTMLImageElement
            if (target.src !== ANTARCTIC_BACKUP) {
              target.src = ANTARCTIC_BACKUP
            }
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(195deg, rgba(6,16,28,0.30) 0%, rgba(6,16,28,0.45) 45%, rgba(4,10,20,0.85) 100%)',
        }} />
        {/* Aurora effect */}
        <div className="login-aurora" />

        {/* Station window lights */}
        <div className="absolute z-20 left-[9%] bottom-[16%] flex gap-[5px]">
          {[9, 6, 11].map((h, i) => (
            <span key={i} style={{ width: 5, height: h, background: 'rgba(255,196,120,0.85)', boxShadow: '0 0 6px rgba(255,196,120,0.7)', display: 'block' }} />
          ))}
        </div>

        {/* Content overlay */}
        <div className="relative z-30 h-full flex flex-col justify-between p-11 text-[#F4FBFF]">
          {/* Brand */}
          <div className="flex items-center gap-2.5 font-display font-extrabold text-[15px] tracking-wide">
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M2 18l6-9 4 5 3-4 7 8H2z" fill="#fff"/>
            </svg>
            ANTARCTICA — ASIDSS
          </div>

          {/* Headline */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-[11px] font-bold mb-3.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              NCPOR OPERATIONS NETWORK
            </div>
            <h1 className="font-display font-extrabold text-[clamp(22px,2.5vw,30px)] leading-[1.2] max-w-[360px]">
              AI-Powered Research<br />Station Management
            </h1>
            <p className="mt-3 text-[13.5px] leading-[1.6] text-white/80 max-w-[340px]">
              Intelligent resource management and digital twin monitoring for India&apos;s extreme polar environments.
            </p>
          </div>

          {/* Station list */}
          <div className="flex gap-6 text-[12px] text-white/75 font-medium">
            {['Maitri Research Station', 'Bharati Research Station'].map(s => (
              <span key={s} className="flex items-center gap-2">
                <span className="w-[6px] h-[6px] rounded-full bg-[#17A88E] shadow-[0_0_6px_#17A88E]" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Auth Panel ──────────────────────── */}
      <div className="flex-1 flex items-center justify-center bg-[#F8FAFC] px-8 sm:px-12 overflow-y-auto">
        <div className="w-full max-w-[400px] py-8">

          {/* Brand header */}
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-[#12233B] flex items-center justify-center text-white shadow-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M2 18l6-9 4 5 3-4 7 8H2z" fill="currentColor"/>
              </svg>
            </div>
            <div>
              <span className="font-display font-black text-[15px] tracking-wide text-[#12233B]">ANTARCTICA — ASIDSS</span>
              <p className="text-[10.5px] text-slate-400 font-medium">Ministry of Earth Sciences · MoES</p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex rounded-xl bg-slate-200/80 p-1 mb-5 border border-slate-200">
            <button
              type="button"
              onClick={() => { setTab('login'); setError(''); setSuccess('') }}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${
                tab === 'login'
                  ? 'bg-white text-[#12233B] shadow-sm'
                  : 'text-slate-500 hover:text-[#12233B]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); setError(''); setSuccess('') }}
              className={`flex-1 py-2 text-[13px] font-bold rounded-lg transition-all ${
                tab === 'register'
                  ? 'bg-white text-[#12233B] shadow-sm'
                  : 'text-slate-500 hover:text-[#12233B]'
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-5">
            <h1 className="font-display text-[21px] font-extrabold text-[#12233B] mb-1">
              {tab === 'login' ? 'Station Authentication' : 'Personnel Registration'}
            </h1>
            <p className="text-[12.5px] text-[#64748B]">
              {tab === 'login'
                ? 'Enter your role and credentials to access platform operations'
                : 'Enroll as new station personnel to access digital twin & telemetry'}
            </p>
          </div>

          {/* ── Form ── */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              
              {/* Role Selector */}
              <div>
                <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                  Select Your Role <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedRole}
                  onChange={e => { setSelectedRole(e.target.value); setError('') }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[13px] font-medium outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm cursor-pointer"
                >
                  {ROLES.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Station Location */}
              <div>
                <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                  Station Location
                </label>
                <select
                  value={selectedStation}
                  onChange={e => setSelectedStation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[13px] font-medium outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm cursor-pointer"
                >
                  {STATIONS.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email / ID */}
              <div>
                <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                  Email Address / ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[13px] outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm placeholder:text-slate-400"
                    required
                    autoComplete="email"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[13px] outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm placeholder:text-slate-400"
                    required
                    autoComplete="current-password"
                  />
                  <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
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

              {error && (
                <div className="text-[#DC5B54] text-[12.5px] font-semibold bg-red-50 border border-red-200/80 rounded-xl p-3 flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-[#12233B] hover:bg-[#1b3457] text-white text-[13.5px] font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setTab('register'); setError(''); setSuccess('') }}
                  className="text-[12px] font-semibold text-[#2F8FE0] hover:underline"
                >
                  Don&apos;t have an account? Create an Account →
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* Full Name */}
              <div>
                <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setError('') }}
                  placeholder="e.g. Naman Dhanwala"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[13px] outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Role & Station Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                    Assigned Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[12.5px] font-medium outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm cursor-pointer"
                  >
                    {ROLES.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                    Station Location
                  </label>
                  <select
                    value={selectedStation}
                    onChange={e => setSelectedStation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[12.5px] font-medium outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm cursor-pointer"
                  >
                    {STATIONS.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                  Official Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder="e.g. namandhanwala@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[13px] outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[12px] font-bold mb-1 text-[#12233B]">
                  Create Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    placeholder="Min 5 characters"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#12233B] text-[13px] outline-none focus:border-[#2F8FE0] focus:ring-2 focus:ring-[#2F8FE0]/20 transition-all shadow-sm placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                    tabIndex={-1}
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

              {error && (
                <div className="text-[#DC5B54] text-[12.5px] font-semibold bg-red-50 border border-red-200/80 rounded-xl p-3 flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="text-emerald-700 text-[12.5px] font-semibold bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 flex items-start gap-2">
                  <svg className="w-4 h-4 flex-shrink-0 mt-0.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span>{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-700 via-cyan-700 to-[#12233B] hover:opacity-95 text-white text-[13.5px] font-bold shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
              >
                {loading ? 'Creating Account...' : 'Register & Enter Station'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setTab('login'); setError(''); setSuccess('') }}
                  className="text-[12px] font-semibold text-[#2F8FE0] hover:underline"
                >
                  Already have an account? Sign In →
                </button>
              </div>
            </form>
          )}

          {/* Security Footer */}
          <div className="mt-8 pt-4 border-t border-slate-200/80 flex items-center justify-center gap-2 text-[11.5px] text-slate-400">
            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Level 4 Encrypted · NCPOR Research Ops · MoES</span>
          </div>

        </div>
      </div>
    </div>
  )
}
