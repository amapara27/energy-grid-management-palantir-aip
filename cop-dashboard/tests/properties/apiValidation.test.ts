/**
 * Feature: grid-360-cop-dashboard
 * Property 8: API structural validity
 *
 * Validates: Requirements 1.3, 10.1, 10.2, 10.3
 *
 * Verifies that all placeholder API fetch functions return structurally valid
 * data with correct types and ranges for every field.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as fc from "fast-check";
import {
  fetchTransformers,
  fetchCircuits,
  fetchWorkOrders,
  fetchAllForecasts,
} from "@/lib/api/index";
import type {
  WorkOrderStatus,
  WorkOrderPriority,
} from "@/lib/types";

const VALID_ALERT_STATUSES = ["Active", "Acknowledged", "Cleared", null] as const;
const VALID_WO_STATUSES: WorkOrderStatus[] = [
  "Pending_Approval",
  "Approved",
  "Rejected",
  "Dispatched",
  "ERP_Error",
  "ERP_Pending",
  "Deferred",
  "Info_Requested",
];
const VALID_PRIORITIES: WorkOrderPriority[] = ["Critical", "High"];

describe("Property 8: Placeholder API returns structurally valid data", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  /** Helper: call an async API fn while advancing fake timers so setTimeout resolves. */
  async function callWithTimers<T>(fn: () => Promise<T>): Promise<T> {
    const promise = fn();
    vi.advanceTimersByTime(500);
    return promise;
  }

  it("fetchTransformers returns objects with correct types and ranges", async () => {
    await fc.assert(
      fc.asyncProperty(fc.nat(), async () => {
        const transformers = await callWithTimers(fetchTransformers);

        expect(transformers.length).toBeGreaterThan(0);

        for (const t of transformers) {
          // Non-empty transformerId
          expect(typeof t.transformerId).toBe("string");
          expect(t.transformerId.length).toBeGreaterThan(0);

          // Numeric oilTemp
          expect(typeof t.oilTemp).toBe("number");
          expect(Number.isFinite(t.oilTemp)).toBe(true);

          // Numeric loadCurrent
          expect(typeof t.loadCurrent).toBe("number");
          expect(Number.isFinite(t.loadCurrent)).toBe(true);

          // Numeric ageYears
          expect(typeof t.ageYears).toBe("number");
          expect(Number.isFinite(t.ageYears)).toBe(true);

          // String lastInspectionDate
          expect(typeof t.lastInspectionDate).toBe("string");
          expect(t.lastInspectionDate.length).toBeGreaterThan(0);

          // riskScore in [0, 100]
          expect(typeof t.riskScore).toBe("number");
          expect(t.riskScore).toBeGreaterThanOrEqual(0);
          expect(t.riskScore).toBeLessThanOrEqual(100);

          // alertStatus is one of valid values or null
          expect(
            VALID_ALERT_STATUSES.includes(t.alertStatus as any)
          ).toBe(true);

          // latitude in [-90, 90]
          expect(typeof t.latitude).toBe("number");
          expect(t.latitude).toBeGreaterThanOrEqual(-90);
          expect(t.latitude).toBeLessThanOrEqual(90);

          // longitude in [-180, 180]
          expect(typeof t.longitude).toBe("number");
          expect(t.longitude).toBeGreaterThanOrEqual(-180);
          expect(t.longitude).toBeLessThanOrEqual(180);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("fetchCircuits returns objects with correct types and non-empty fields", async () => {
    await fc.assert(
      fc.asyncProperty(fc.nat(), async () => {
        const circuits = await callWithTimers(fetchCircuits);

        expect(circuits.length).toBeGreaterThan(0);

        for (const c of circuits) {
          // Non-empty circuitId
          expect(typeof c.circuitId).toBe("string");
          expect(c.circuitId.length).toBeGreaterThan(0);

          // Non-empty circuitName
          expect(typeof c.circuitName).toBe("string");
          expect(c.circuitName.length).toBeGreaterThan(0);

          // Non-empty voltageLevel
          expect(typeof c.voltageLevel).toBe("string");
          expect(c.voltageLevel.length).toBeGreaterThan(0);

          // Non-empty geographicZone
          expect(typeof c.geographicZone).toBe("string");
          expect(c.geographicZone.length).toBeGreaterThan(0);

          // Numeric maxWindThresholdMph
          expect(typeof c.maxWindThresholdMph).toBe("number");
          expect(Number.isFinite(c.maxWindThresholdMph)).toBe(true);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("fetchWorkOrders returns objects with correct types and valid enums", async () => {
    await fc.assert(
      fc.asyncProperty(fc.nat(), async () => {
        const workOrders = await callWithTimers(fetchWorkOrders);

        expect(workOrders.length).toBeGreaterThan(0);

        for (const wo of workOrders) {
          // Non-empty woId
          expect(typeof wo.woId).toBe("string");
          expect(wo.woId.length).toBeGreaterThan(0);

          // Non-empty transformerId
          expect(typeof wo.transformerId).toBe("string");
          expect(wo.transformerId.length).toBeGreaterThan(0);

          // Priority is "Critical" or "High"
          expect(VALID_PRIORITIES).toContain(wo.priority);

          // Status is a valid WorkOrderStatus
          expect(VALID_WO_STATUSES).toContain(wo.status);

          // Non-empty assignedCrew
          expect(typeof wo.assignedCrew).toBe("string");
          expect(wo.assignedCrew.length).toBeGreaterThan(0);

          // String createdTimestamp
          expect(typeof wo.createdTimestamp).toBe("string");
          expect(wo.createdTimestamp.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });

  it("fetchAllForecasts returns objects with correct types and ranges", async () => {
    await fc.assert(
      fc.asyncProperty(fc.nat(), async () => {
        const forecasts = await callWithTimers(fetchAllForecasts);

        expect(forecasts.length).toBeGreaterThan(0);

        for (const f of forecasts) {
          // Non-empty forecastId
          expect(typeof f.forecastId).toBe("string");
          expect(f.forecastId.length).toBeGreaterThan(0);

          // Non-empty circuitId
          expect(typeof f.circuitId).toBe("string");
          expect(f.circuitId.length).toBeGreaterThan(0);

          // Numeric windSpeedMph >= 0
          expect(typeof f.windSpeedMph).toBe("number");
          expect(f.windSpeedMph).toBeGreaterThanOrEqual(0);

          // humidityPct in [0, 100]
          expect(typeof f.humidityPct).toBe("number");
          expect(f.humidityPct).toBeGreaterThanOrEqual(0);
          expect(f.humidityPct).toBeLessThanOrEqual(100);

          // Boolean redFlagWarning
          expect(typeof f.redFlagWarning).toBe("boolean");

          // String forecastTimestamp
          expect(typeof f.forecastTimestamp).toBe("string");
          expect(f.forecastTimestamp.length).toBeGreaterThan(0);
        }
      }),
      { numRuns: 100 }
    );
  });
});
