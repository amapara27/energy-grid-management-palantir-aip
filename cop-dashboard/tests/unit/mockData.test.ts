import { describe, it, expect } from "vitest";
import {
  mockTransformers,
  mockCircuits,
  mockWorkOrders,
  mockForecasts,
  transformerCircuitMap,
} from "@/lib/api/mockData";

describe("mockData", () => {
  it("has at least 20 transformer records", () => {
    expect(mockTransformers.length).toBeGreaterThanOrEqual(20);
  });

  it("has transformers spanning Green, Amber, and Red risk bands", () => {
    const green = mockTransformers.filter((t) => t.riskScore < 40);
    const amber = mockTransformers.filter(
      (t) => t.riskScore >= 40 && t.riskScore < 70
    );
    const red = mockTransformers.filter((t) => t.riskScore >= 70);
    expect(green.length).toBeGreaterThan(0);
    expect(amber.length).toBeGreaterThan(0);
    expect(red.length).toBeGreaterThan(0);
  });

  it("has varied alertStatus values including null", () => {
    const statuses = new Set(mockTransformers.map((t) => t.alertStatus));
    expect(statuses.has("Active")).toBe(true);
    expect(statuses.has("Acknowledged")).toBe(true);
    expect(statuses.has("Cleared")).toBe(true);
    expect(statuses.has(null)).toBe(true);
  });

  it("has valid latitude/longitude ranges for all transformers", () => {
    for (const t of mockTransformers) {
      expect(t.latitude).toBeGreaterThanOrEqual(-90);
      expect(t.latitude).toBeLessThanOrEqual(90);
      expect(t.longitude).toBeGreaterThanOrEqual(-180);
      expect(t.longitude).toBeLessThanOrEqual(180);
    }
  });

  it("has valid riskScore range [0, 100] for all transformers", () => {
    for (const t of mockTransformers) {
      expect(t.riskScore).toBeGreaterThanOrEqual(0);
      expect(t.riskScore).toBeLessThanOrEqual(100);
    }
  });

  it("has circuit records", () => {
    expect(mockCircuits.length).toBeGreaterThan(0);
  });

  it("has work orders with several Pending_Approval statuses", () => {
    const pending = mockWorkOrders.filter(
      (wo) => wo.status === "Pending_Approval"
    );
    expect(pending.length).toBeGreaterThanOrEqual(3);
  });

  it("has work orders with mixed statuses", () => {
    const statuses = new Set(mockWorkOrders.map((wo) => wo.status));
    expect(statuses.size).toBeGreaterThan(1);
  });

  it("has weather forecast records linked to valid circuits", () => {
    const circuitIds = new Set(mockCircuits.map((c) => c.circuitId));
    expect(mockForecasts.length).toBeGreaterThan(0);
    for (const f of mockForecasts) {
      expect(circuitIds.has(f.circuitId)).toBe(true);
    }
  });

  it("maps every transformer to a valid circuit", () => {
    const circuitIds = new Set(mockCircuits.map((c) => c.circuitId));
    for (const t of mockTransformers) {
      const cid = transformerCircuitMap[t.transformerId];
      expect(cid).toBeDefined();
      expect(circuitIds.has(cid)).toBe(true);
    }
  });

  it("has all work order transformerIds referencing existing transformers", () => {
    const trfIds = new Set(mockTransformers.map((t) => t.transformerId));
    for (const wo of mockWorkOrders) {
      expect(trfIds.has(wo.transformerId)).toBe(true);
    }
  });
});
