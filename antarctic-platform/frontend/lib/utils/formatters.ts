import { format, formatDistanceToNow } from 'date-fns';

export function formatTemperature(c?: number | null): string {
  if (c === undefined || c === null || isNaN(Number(c))) return '--°C';
  return `${Number(c).toFixed(1)}°C`;
}

export function formatWindSpeed(kmh?: number | null): string {
  if (kmh === undefined || kmh === null || isNaN(Number(kmh))) return '-- km/h';
  return `${Number(kmh).toFixed(1)} km/h`;
}

export function formatPower(kw?: number | null): string {
  if (kw === undefined || kw === null || isNaN(Number(kw))) return '-- kW';
  return `${Number(kw).toFixed(1)} kW`;
}

export function formatPercent(pct?: number | null): string {
  if (pct === undefined || pct === null || isNaN(Number(pct))) return '--%';
  return `${Number(pct).toFixed(1)}%`;
}

export function formatTimestamp(iso?: string | null): string {
  if (!iso) return '--';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return format(d, 'dd MMM yyyy, HH:mm');
  } catch (e) {
    return String(iso);
  }
}

export function formatRelativeTime(iso?: string | null): string {
  if (!iso) return '--';
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return String(iso);
    return formatDistanceToNow(d, { addSuffix: true });
  } catch (e) {
    return String(iso);
  }
}

export function formatDuration(minutes?: number | null): string {
  if (minutes === undefined || minutes === null || isNaN(Number(minutes))) return '--';
  const mins = Math.max(0, Math.floor(Number(minutes)));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) {
    return `${h}h ${m}m`;
  }
  return `${m}m`;
}

export function getStatusColor(status?: string | null): string {
  if (!status) return 'text-gray-400';
  const s = String(status).toUpperCase();
  if (s === 'OK' || s === 'SECURE' || s === 'SAFE' || s === 'ON_DUTY' || s === 'DELIVERED' || s === 'OPERATIONAL' || s === 'RESOLVED' || s === 'AVAILABLE') {
    return 'text-green-500';
  }
  if (s === 'LOW' || s === 'WARNING' || s === 'ALERT' || s === 'IN_FIELD_OPS' || s === 'EN_ROUTE' || s === 'MISSING' || s === 'MONITORING') {
    return 'text-amber-500';
  }
  if (s === 'CRITICAL' || s === 'DENIED' || s === 'ACTIVE' || s === 'UNAVAILABLE') {
    return 'text-red-500';
  }
  return 'text-gray-400';
}

export function getSeverityColor(level?: number | null): string {
  const l = Number(level);
  if (l === 1) return 'text-amber-500';
  if (l === 2) return 'text-orange-500';
  if (l === 3) return 'text-red-500';
  return 'text-gray-400';
}

export function getHealthGradeColor(grade?: string | null): string {
  if (!grade) return 'text-gray-400';
  const g = String(grade).toUpperCase();
  if (g === 'A') return 'text-green-500';
  if (g === 'B') return 'text-ice-400';
  if (g === 'C') return 'text-amber-500';
  if (g === 'D') return 'text-orange-500';
  if (g === 'F') return 'text-red-500';
  return 'text-gray-400';
}
