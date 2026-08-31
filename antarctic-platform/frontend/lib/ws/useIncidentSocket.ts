'use client'
import { useState, useEffect, useRef } from 'react'
import { Incident } from '../types'

type SocketStatus = 'connecting' | 'live' | 'reconnecting' | 'error'

const WS_BASE = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'

export function useIncidentSocket(stationId: string): { incidents: Incident[]; lastUpdate: string | null; status: SocketStatus } {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [status, setStatus] = useState<SocketStatus>('connecting')
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()
  const backoffRef = useRef(1000)

  useEffect(() => {
    if (!stationId) return;

    function connect() {
      if (wsRef.current?.readyState === WebSocket.OPEN) return;
      
      setStatus(prev => prev === 'live' ? 'reconnecting' : 'connecting');
      const ws = new WebSocket(`${WS_BASE}/ws/incidents/${stationId}`);
      
      ws.onopen = () => {
        setStatus('live');
        backoffRef.current = 1000;
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.data) {
            setIncidents(message.data);
            setLastUpdate(new Date().toISOString());
          }
        } catch (err) {
          console.error("Failed to parse incident socket message", err);
        }
      };

      ws.onerror = () => {
        setStatus('error');
      };

      ws.onclose = () => {
        setStatus('reconnecting');
        const nextBackoff = Math.min(backoffRef.current * 2, 30000);
        backoffRef.current = nextBackoff;
        reconnectTimeoutRef.current = setTimeout(connect, nextBackoff);
      };

      wsRef.current = ws;
    }

    connect();

    return () => {
      clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [stationId]);

  return { incidents, lastUpdate, status };
}
