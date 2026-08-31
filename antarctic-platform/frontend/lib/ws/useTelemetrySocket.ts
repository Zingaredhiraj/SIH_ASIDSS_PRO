'use client'
import { useState, useEffect, useRef } from 'react'
import { TelemetryData } from '../types'
import { fetchTelemetry } from '../api/energy'

type SocketStatus = 'connecting' | 'live' | 'reconnecting' | 'error'

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

export function useTelemetrySocket(stationId: string): { data: TelemetryData | null; status: SocketStatus } {
  const [data, setData] = useState<TelemetryData | null>(null)
  const [status, setStatus] = useState<SocketStatus>('connecting')
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const backoffRef = useRef(1000)

  // 1. Immediate HTTP fetch on stationId change so dashboard loads instantly
  useEffect(() => {
    if (!stationId) return
    let isMounted = true

    fetchTelemetry(stationId)
      .then(res => {
        if (isMounted && res?.data) {
          setData(res.data)
        }
      })
      .catch(err => {
        console.warn('Initial telemetry fetch fallback:', err)
      })

    return () => {
      isMounted = false
    }
  }, [stationId])

  // 2. Real-time WebSocket connection for live updates
  useEffect(() => {
    if (!stationId) return

    function connect() {
      if (wsRef.current?.readyState === WebSocket.OPEN) return
      
      setStatus(prev => prev === 'live' ? 'reconnecting' : 'connecting')
      const ws = new WebSocket(`${WS_BASE}/ws/telemetry/${stationId}`)
      
      ws.onopen = () => {
        setStatus('live')
        backoffRef.current = 1000
      }

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          // Support both direct object and wrapped { data: ... }
          const payload = message?.data || message
          if (payload && (payload.load_kw !== undefined || payload.station_id)) {
            setData(payload)
            setStatus('live')
          }
        } catch (err) {
          console.error("Failed to parse telemetry socket message", err)
        }
      }

      ws.onerror = () => {
        setStatus('error')
      }

      ws.onclose = () => {
        setStatus('reconnecting')
        const nextBackoff = Math.min(backoffRef.current * 2, 10000)
        backoffRef.current = nextBackoff
        reconnectTimeoutRef.current = setTimeout(connect, nextBackoff)
      }

      wsRef.current = ws
    }

    connect()

    return () => {
      clearTimeout(reconnectTimeoutRef.current)
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [stationId])

  return { data, status }
}
