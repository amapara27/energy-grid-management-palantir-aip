/**
 * Pure utility functions for the Grid 360 COP Dashboard.
 *
 * All functions return new arrays — inputs are never mutated.
 */

import type {
  RiskColor,
  TransformerWithGeo,
  MaintenanceWorkOrder,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Risk color mapping (Requirement 2.2, 3.4)
// ---------------------------------------------------------------------------

/** Map a numeric risk score to a color band. */
export function riskColor(score: number): RiskColor {
  if (score < 40) return "green";
  if (score < 70) return "amber";
  return "red";
}

// ---------------------------------------------------------------------------
// Transformer sorting (Requirement 3.1)
// ---------------------------------------------------------------------------

/** Return a new array of transformers sorted by riskScore descending. */
export function sortByRiskDesc(
  transformers: TransformerWithGeo[],
): TransformerWithGeo[] {
  return [...transformers].sort((a, b) => b.riskScore - a.riskScore);
}

// ---------------------------------------------------------------------------
// Work order sorting (Requirement 4.2)
// ---------------------------------------------------------------------------

const PRIORITY_RANK: Record<MaintenanceWorkOrder["priority"], number> = {
  Critical: 0,
  High: 1,
};

/**
 * Return a new array of work orders sorted by priority descending
 * (Critical before High), then by createdTimestamp ascending.
 */
export function sortWorkOrders(
  orders: MaintenanceWorkOrder[],
): MaintenanceWorkOrder[] {
  return [...orders].sort((a, b) => {
    const pDiff = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (pDiff !== 0) return pDiff;
    // Same priority — sort by timestamp ascending (ISO 8601 string compare)
    return a.createdTimestamp < b.createdTimestamp
      ? -1
      : a.createdTimestamp > b.createdTimestamp
        ? 1
        : 0;
  });
}

// ---------------------------------------------------------------------------
// Work order filtering (Requirement 4.1)
// ---------------------------------------------------------------------------

/** Return only work orders with status "Pending_Approval". */
export function filterPendingApproval(
  orders: MaintenanceWorkOrder[],
): MaintenanceWorkOrder[] {
  return orders.filter((o) => o.status === "Pending_Approval");
}

// ---------------------------------------------------------------------------
// Work order filter by transformer (Requirement 6.4 / Property 6)
// ---------------------------------------------------------------------------

/** Return only work orders belonging to the given transformer. */
export function filterWorkOrdersByTransformer(
  orders: MaintenanceWorkOrder[],
  transformerId: string,
): MaintenanceWorkOrder[] {
  return orders.filter((o) => o.transformerId === transformerId);
}
