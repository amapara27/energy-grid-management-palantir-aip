/**
 * ObjectTable — Transformer listing table widget.
 *
 * Displays all Transformer objects with columns:
 *   Transformer_ID, Circuit_Name, Oil_Temp, Load_Current,
 *   Age_Years, Risk_Score, Alert_Status.
 *
 * @see Requirements 5.3
 */

import type { Transformer } from "../../Ontology/Objects/Transformer.js";

/** A single row in the object table. */
export interface ObjectTableRow {
  transformerId: string;
  circuitName: string;
  oilTemp: number;
  loadCurrent: number;
  ageYears: number;
  riskScore: number;
  alertStatus: string | null;
}

/** Interface for the transformer object table widget. */
export interface IObjectTable {
  /** Render the table with the given transformer data. */
  render(rows: ObjectTableRow[]): void;
  /** Handle operator selecting a row. */
  onRowSelect(transformerId: string): void;
}

/** Placeholder object table implementation. */
export function createObjectTable(): IObjectTable {
  throw new Error("Not implemented");
}
