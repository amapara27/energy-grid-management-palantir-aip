/**
 * KPI computation for the Grid 360 COP Dashboard.
 *
 * Pure function — no side effects, no imports from mock data.
 * Requirements: 7.1, 7.2, 7.3, 7.4
 */

import type {
  TransformerWithGeo,
  MaintenanceWorkOrder,
  Circuit,
  KPIMetrics,
} from "@/lib/types";

const MS_PER_DAY = 86_400_000;
const DAYS_IN_WEEK = 7;

/**
 * Compute fleet-level KPI metrics from the current data arrays.
 *
 * @param transformers  All transformer records
 * @param workOrders    All maintenance work orders
 * @param circuits      All circuit records
 * @param transformerCircuitMap  Mapping of transformerId → circuitId
 * @param now           Reference date (defaults to current time)
 */
export function computeKPIMetrics(
  transformers: TransformerWithGeo[],
  workOrders: MaintenanceWorkOrder[],
  circuits: Circuit[],
  transformerCircuitMap: Record<string, string>,
  now: Date = new Date(),
): KPIMetrics {
  // 7.1 — Active extreme alerts: alertStatus "Active" AND riskScore >= 70
  const activeExtremeAlerts = transformers.filter(
    (t) => t.alertStatus === "Active" && t.riskScore >= 70,
  ).length;

  // 7.2 — Pending work orders: status "Pending_Approval"
  const pendingWorkOrders = workOrders.filter(
    (wo) => wo.status === "Pending_Approval",
  ).length;

  // 7.3 — Inspected this week: lastInspectionDate within 7 days of `now`
  const weekAgoMs = now.getTime() - DAYS_IN_WEEK * MS_PER_DAY;
  const inspectedThisWeek = transformers.filter((t) => {
    const inspDate = new Date(t.lastInspectionDate).getTime();
    return !isNaN(inspDate) && inspDate >= weekAgoMs && inspDate <= now.getTime();
  }).length;

  // 7.4 — Average risk by circuit
  const circuitNameMap = new Map(circuits.map((c) => [c.circuitId, c.circuitName]));

  // Accumulate risk scores per circuit
  const circuitRiskSums = new Map<string, { sum: number; count: number }>();

  for (const t of transformers) {
    const circuitId = transformerCircuitMap[t.transformerId];
    if (!circuitId) continue;

    const entry = circuitRiskSums.get(circuitId);
    if (entry) {
      entry.sum += t.riskScore;
      entry.count += 1;
    } else {
      circuitRiskSums.set(circuitId, { sum: t.riskScore, count: 1 });
    }
  }

  const avgRiskByCircuit = Array.from(circuitRiskSums.entries()).map(
    ([circuitId, { sum, count }]) => ({
      circuitId,
      circuitName: circuitNameMap.get(circuitId) ?? circuitId,
      avgRisk: sum / count,
    }),
  );

  return {
    activeExtremeAlerts,
    pendingWorkOrders,
    inspectedThisWeek,
    avgRiskByCircuit,
  };
}
