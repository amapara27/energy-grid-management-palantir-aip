/**
 * GridFilters — Filter interface for the COP.
 *
 * Supports filtering by Circuit, Geographic_Zone, Alert_Status,
 * and Risk_Score range. When applied, the map, object table, and
 * action inbox update to show only matching Transformer objects.
 *
 * @see Requirements 5.7
 */

import type { Transformer, AlertStatus } from "../../Ontology/Objects/Transformer.js";

/** Filter criteria that can be applied to the COP views. */
export interface GridFilterCriteria {
  circuitIds?: string[];
  geographicZones?: string[];
  alertStatuses?: (AlertStatus | null)[];
  riskScoreMin?: number;
  riskScoreMax?: number;
}

/** Interface for the grid filter component. */
export interface IGridFilters {
  /** Apply filter criteria and return matching transformers. */
  apply(transformers: Transformer[], criteria: GridFilterCriteria): Transformer[];
  /** Reset all filters to default (show all). */
  reset(): void;
}

/** Placeholder grid filters implementation. */
export function createGridFilters(): IGridFilters {
  throw new Error("Not implemented");
}
