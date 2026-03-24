/**
 * Transformer Ontology Object Type
 *
 * Represents a physical electrical transformer asset in the grid.
 * Properties sourced from SCADA telemetry, GIS data, and computed by Risk_Scoring / Smart_Alerting.
 *
 * @see Requirements 2.1
 */

export type AlertStatus = "Active" | "Cleared" | "Data_Incomplete";

export interface Transformer {
  /** Primary key — unique transformer identifier from GIS + SCADA join */
  transformerId: string;
  /** Current oil temperature in Celsius (>= 0), from SCADA telemetry */
  oilTemp: number;
  /** Current load current in amps (>= 0), from SCADA telemetry */
  loadCurrent: number;
  /** Asset age in whole years (>= 0), from GIS data */
  ageYears: number;
  /** Last inspection date in ISO 8601 format, from GIS data */
  lastInspectionDate: string;
  /** Computed risk score (0–100), set by Risk_Scoring engine */
  riskScore: number;
  /** Alert status set by Smart_Alerting engine, or null if no alert */
  alertStatus: AlertStatus | null;
}
