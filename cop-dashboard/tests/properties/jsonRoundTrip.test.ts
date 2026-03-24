/**
 * Feature: grid-360-cop-dashboard
 * Property 11: JSON round-trip
 *
 * Validates: Requirements 10.7
 *
 * For any TransformerWithGeo object, serializing to JSON and deserializing
 * back SHALL produce an equivalent object (round-trip property).
 */

import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import type { TransformerWithGeo } from "@/lib/types";

/**
 * Helper: JSON.stringify converts -0 to "0", so JSON.parse produces +0.
 * We normalise -0 → +0 in generated doubles to keep the round-trip clean.
 */
const noNegZero = (n: number): number => (Object.is(n, -0) ? 0 : n);

/** Arbitrary that generates valid TransformerWithGeo objects. */
const transformerWithGeoArb: fc.Arbitrary<TransformerWithGeo> = fc.record({
  transformerId: fc.string({ minLength: 1 }),
  oilTemp: fc.double({ min: 0, max: 200, noNaN: true }).map(noNegZero),
  loadCurrent: fc.double({ min: 0, max: 1000, noNaN: true }).map(noNegZero),
  ageYears: fc.nat({ max: 100 }),
  lastInspectionDate: fc.date().map((d) => d.toISOString()),
  riskScore: fc.integer({ min: 0, max: 100 }),
  alertStatus: fc.oneof(
    fc.constant("Active" as const),
    fc.constant("Acknowledged" as const),
    fc.constant("Cleared" as const),
    fc.constant(null),
  ),
  latitude: fc.double({ min: -90, max: 90, noNaN: true }).map(noNegZero),
  longitude: fc.double({ min: -180, max: 180, noNaN: true }).map(noNegZero),
});

describe("Property 11: Transformer JSON serialization round-trip", () => {
  it("JSON.parse(JSON.stringify(t)) deep-equals original for any transformer", () => {
    fc.assert(
      fc.property(transformerWithGeoArb, (t: TransformerWithGeo) => {
        const roundTripped = JSON.parse(JSON.stringify(t));
        expect(roundTripped).toEqual(t);
      }),
      { numRuns: 100 },
    );
  });
});
