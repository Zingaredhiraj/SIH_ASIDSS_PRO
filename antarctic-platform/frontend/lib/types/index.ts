export interface Station { station_id: string; name: string; coordinates: {lat: number; lng: number}; status: string; }
export interface TelemetryData { station_id: string; timestamp: string; solar_kw: number; wind_kw: number; diesel_kw: number; load_kw: number; fuel_pct: number; water_pct: number; food_pct: number; consumables_pct: number; health_index?: HealthIndex; anomalies?: Anomaly[]; burn_rates?: BurnRates; }
export interface HealthIndex { score: number; grade: string; factors: HealthFactor[]; reason: string; }
export interface HealthFactor { name: string; value: number; weight: number; score: number; }
export interface Anomaly { metric: string; type: string; value: number; threshold: number; severity: 'LOW'|'MEDIUM'|'HIGH'; message: string; }
export interface BurnRates { fuel_burn_per_day_pct: number; water_burn_per_day_pct: number; food_burn_per_day_pct: number; }
export interface PersonnelMember { crew_id: string; name: string; role: string; department: string; station_id: string; status: 'ON_DUTY'|'OFF_DUTY'|'IN_FIELD_OPS'; shift: string; sector: string; }
export interface ShiftSchedule { station_id: string; shift_name: string; crew_ids: string[]; window: string; }
export interface OperationalReadiness { readiness_pct: number; on_duty_count: number; off_duty_count: number; in_field_count: number; by_department: Record<string, number>; risk_level: 'LOW'|'MEDIUM'|'HIGH'; }
export interface AccessPoint { point_id: string; station_id: string; point_name: string; status: 'SECURE'|'OPEN'|'ALERT'; access_level: number; risk_level: 'LOW'|'MEDIUM'|'HIGH'; last_event_time: string; last_crew: string; }
export interface AccessEvent { event_id: string; station_id: string; point_id: string; crew_id: string; crew_name: string; timestamp: string; event_type: 'ENTRY'|'EXIT'|'DENIED'; }
export interface SecurityRisk { overall_risk: string; risk_score: number; alerts: SecurityAlert[]; }
export interface SecurityAlert { point: string; reason: string; severity: string; }
export interface ResupplyShipment { shipment_id: string; station_id: string; type: 'air'|'sea'; eta: string; status: 'DELIVERED'|'EN_ROUTE'|'PLANNED'; cargo_manifest: CargoItem[]; weather_dependency_flag: boolean; }
export interface CargoItem { item: string; quantity: number; unit: string; }
export interface InventoryItem { item_id: string; station_id: string; item: string; category: string; current_stock: number; unit: string; reorder_threshold: number; days_remaining?: number; status?: 'OK'|'LOW'|'CRITICAL'; }
export interface WeatherReading { station_id: string; timestamp: string; temperature: number; wind_speed: number; wind_direction: number; visibility: number; snowfall: number; pressure: number; }
export interface HazardThreshold { threshold_id: string; station_id: string; metric: string; threshold_value: number; comparison: 'gt'|'lt'; linked_alert_type: string; }
export interface Incident { incident_id: string; station_id: string; type: 'FIRE'|'GAS_LEAK'|'MEDICAL'|'STRUCTURAL'|'STORM'; severity: 1|2|3; escalation_level: 1|2|3; status: 'ACTIVE'|'RESOLVED'|'MONITORING'; description: string; triggered_at: string; timeline: IncidentEvent[]; }
export interface IncidentEvent { timestamp: string; action: string; user: string; }
export interface MusterEntry { crew_id: string; name: string; status: 'SAFE'|'MISSING'|'AT_MUSTER'; updated_at: string; }
export interface EvacuationRoute { zone: string; path_geometry: [number,number][]; assembly_point: string; }
export interface Asset3D { asset_id: string; station_id: string; parent_area: string; name: string; type: string; model_ref: string; position: {x: number; y: number; z: number}; }
export interface AssetStatus { asset_id: string; status: 'OPERATIONAL'|'WARNING'|'CRITICAL'; metrics: Record<string, number>; last_update: string; }
export interface User { user_id: string; name: string; email: string; role: string; station_id: string | null; status: string; last_login: string; }
export interface Role { role_name: string; permissions: string[]; }
export interface AuditLog { log_id: string; timestamp: string; user_id: string; role: string; action: string; resource: string; result: 'SUCCESS'|'FAILURE'; metadata?: Record<string, unknown>; }
export interface ChatMessage { role: 'user'|'assistant'; content: string; sources?: SOPChunk[]; source_type?: 'groq'|'offline'; timestamp: string; }
export interface SOPChunk { doc_id: string; title: string; chunk_text: string; score: number; }
export interface ApiResponse<T> { data: T; dataSource: string; isSimulation: boolean; dataDisclaimer: string; timestamp: string; }
