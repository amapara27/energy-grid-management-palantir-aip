/**
 * Work Order Service — priority derivation from risk score.
 *
 * Validates: Requirements 6.1, 6.2
 */

import type { WorkOrderPriority } from "./types.js";

/**
 * Derive work order priority from a risk score.
 * Risk_Score >= 90 → "Critical", Risk_Score >= 70 → "High".
 */
export function derivePriorityFromRiskScore(
  _riskScore: number
): WorkOrderPriority {
  throw new Error("Not implemented");
}
