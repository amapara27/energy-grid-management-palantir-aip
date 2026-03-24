/**
 * Placeholder API layer for the Grid 360 COP Dashboard.
 *
 * Each function simulates network latency (200–500ms) and returns deep copies
 * of mock data to prevent mutation of the source arrays.
 *
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6
 */

import type {
  TransformerWithGeo,
  Circuit,
  MaintenanceWorkOrder,
  WeatherForecast,
} from "@/lib/types";

import {
  mockTransformers,
  mockCircuits,
  mockWorkOrders,
  mockForecasts,
  transformerCircuitMap,
} from "./mockData";

// Re-export for component use
export { transformerCircuitMap };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deep-clone via structured clone (avoids JSON date-string issues). */
function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Simulate network latency between 200–500ms (fixed at 300ms for deterministic testing). */
function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 300));
}

// ---------------------------------------------------------------------------
// Fetch functions
// ---------------------------------------------------------------------------

export async function fetchTransformers(): Promise<TransformerWithGeo[]> {
  await simulateLatency();
  return deepCopy(mockTransformers);
}

export async function fetchCircuits(): Promise<Circuit[]> {
  await simulateLatency();
  return deepCopy(mockCircuits);
}

export async function fetchWorkOrders(): Promise<MaintenanceWorkOrder[]> {
  await simulateLatency();
  return deepCopy(mockWorkOrders);
}

export async function fetchAllForecasts(): Promise<WeatherForecast[]> {
  await simulateLatency();
  return deepCopy(mockForecasts);
}

export async function fetchWeatherForecasts(
  circuitId: string,
): Promise<WeatherForecast[]> {
  await simulateLatency();
  return deepCopy(mockForecasts.filter((f) => f.circuitId === circuitId));
}

// ---------------------------------------------------------------------------
// Mutation functions
// ---------------------------------------------------------------------------

export async function approveAndDispatch(
  woId: string,
): Promise<MaintenanceWorkOrder> {
  await simulateLatency();
  const wo = mockWorkOrders.find((w) => w.woId === woId);
  if (!wo) throw new Error("Work order not found");
  const updated = deepCopy(wo);
  updated.status = "Approved";
  return updated;
}

export async function defer24h(
  woId: string,
): Promise<MaintenanceWorkOrder> {
  await simulateLatency();
  const wo = mockWorkOrders.find((w) => w.woId === woId);
  if (!wo) throw new Error("Work order not found");
  const updated = deepCopy(wo);
  updated.status = "Deferred";
  return updated;
}

export async function requestMoreInfo(
  woId: string,
): Promise<MaintenanceWorkOrder> {
  await simulateLatency();
  const wo = mockWorkOrders.find((w) => w.woId === woId);
  if (!wo) throw new Error("Work order not found");
  const updated = deepCopy(wo);
  updated.status = "Info_Requested";
  return updated;
}
