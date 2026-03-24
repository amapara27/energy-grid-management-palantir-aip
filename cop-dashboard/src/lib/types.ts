/**
 * Shared TypeScript interfaces for the Grid 360 COP Dashboard.
 *
 * These types mirror the Ontology schemas (Ontology/Objects/*) and extend them
 * where the frontend requires additional fields (e.g. geo-coordinates on Transformer).
 * WorkOrderStatus is a superset of the Ontology type, adding "Deferred" and
 * "Info_Requested" to support dashboard-specific actions.
 */

// ---------------------------------------------------------------------------
// Enums / Union Types
// ---------------------------------------------------------------------------

export type RiskColor = "green" | "amber" | "red";

export type WorkOrderStatus =
  | "Pending_Approval"
  | "Approved"
  | "Rejected"
  | "Dispatched"
  | "ERP_Error"
  | "ERP_Pending"
  | "Deferred"
  | "Info_Requested";

export type WorkOrderPriority = "Critical" | "High";

// ---------------------------------------------------------------------------
// Domain Interfaces
// ---------------------------------------------------------------------------

/** Extends the Ontology Transformer with geographic coordinates for map rendering. */
export interface TransformerWithGeo {
  transformerId: string;
  oilTemp: number;
  loadCurrent: number;
  ageYears: number;
  lastInspectionDate: string; // ISO 8601
  riskScore: number; // 0–100
  alertStatus: "Active" | "Acknowledged" | "Cleared" | null;
  latitude: number;
  longitude: number;
}

export interface Circuit {
  circuitId: string;
  circuitName: string;
  voltageLevel: string;
  geographicZone: string;
  maxWindThresholdMph: number;
}

export interface MaintenanceWorkOrder {
  woId: string;
  transformerId: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedCrew: string;
  createdTimestamp: string; // ISO 8601
  erpReferenceId: string | null;
}

export interface WeatherForecast {
  forecastId: string;
  circuitId: string;
  windSpeedMph: number;
  humidityPct: number;
  redFlagWarning: boolean;
  forecastTimestamp: string; // ISO 8601
}

// ---------------------------------------------------------------------------
// UI Types
// ---------------------------------------------------------------------------

export interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "error";
  createdAt: number;
}

export interface KPIMetrics {
  activeExtremeAlerts: number;
  pendingWorkOrders: number;
  inspectedThisWeek: number;
  avgRiskByCircuit: Array<{
    circuitId: string;
    circuitName: string;
    avgRisk: number;
  }>;
}
