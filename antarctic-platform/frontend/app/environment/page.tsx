'use client'
import { useEffect, useState } from 'react'
import { useStation } from '@/components/common/StationSelector'
import { fetchWeather, fetchWeatherHistory, fetchHazards } from '@/lib/api/environment'
import { WeatherReading, HazardThreshold } from '@/lib/types'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { CurrentWeatherPanel } from '@/components/environment/CurrentWeatherPanel'
import { WeatherTrendChart } from '@/components/environment/WeatherTrendChart'
import { HazardThresholdBanner } from '@/components/environment/HazardThresholdBanner'

export default function EnvironmentPage() {
  const { stationId } = useStation()
  const [weather, setWeather] = useState<WeatherReading | null>(null)
  const [history, setHistory] = useState<WeatherReading[]>([])
  const [hazards, setHazards] = useState<HazardThreshold[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const loadData = async () => {
    try {
      const [w, hist, haz] = await Promise.all([
        fetchWeather(stationId),
        fetchWeatherHistory(stationId),
        fetchHazards(stationId)
      ])
      setWeather(w.data)
      setHistory(hist.data)
      setHazards(haz.data)
      setError(false)
    } catch (e) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const interval = setInterval(loadData, 60000) // update every minute
    return () => clearInterval(interval)
  }, [stationId])

  if (error) return <ErrorFallback message="Failed to load environmental data" onRetry={loadData} />

  // Basic active hazard check based on current weather
  const activeHazards = weather ? hazards.filter(h => {
    const val = (weather as any)[h.metric];
    if (val === undefined) return false;
    return h.comparison === 'gt' ? val > h.threshold_value : val < h.threshold_value;
  }) : [];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <header className="border-b border-polar-border pb-4 flex-shrink-0">
        <h1 className="text-3xl font-bold text-white tracking-wide">Environmental Monitoring</h1>
        <p className="text-gray-400 font-mono text-sm mt-1">MODULE 5 • {stationId}</p>
      </header>

      {activeHazards.length > 0 && (
        <HazardThresholdBanner hazards={activeHazards} currentWeather={weather!} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-1 h-full">
          <CurrentWeatherPanel data={weather} loading={loading} />
        </div>
        <div className="lg:col-span-3 h-[500px] lg:h-full">
          <WeatherTrendChart data={history} loading={loading} />
        </div>
      </div>
    </div>
  )
}
