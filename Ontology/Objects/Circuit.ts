/**
 * Circuit Ontology Object Type
 *
 * Represents a logical grouping of transformers and cables within a geographic zone.
 *
 * @see Requirements 2.2
 */

export interface Circuit {
  /** Primary key — unique circuit identifier from GIS data */
  circuitId: string;
  /** Human-readable circuit name */
  circuitName: string;
  /** Voltage level designation (e.g. "12kV", "69kV") */
  voltageLevel: string;
  /** Geographic zone the circuit belongs to */
  geographicZone: string;
  /** Maximum wind speed threshold in mph before risk escalation (> 0) */
  maxWindThresholdMph: number;
}
