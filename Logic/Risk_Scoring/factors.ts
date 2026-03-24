/**
 * Individual risk factor evaluators.
 *
 * Each function evaluates a single risk factor and returns its point contribution.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 */

/**
 * Evaluate oil temperature contribution.
 * Returns 40 if oilTempC > 90, otherwise 0.
 */
export function evaluateOilTemp(oilTempC: number): number {
  throw new Error("Not implemented");
}

/**
 * Evaluate transformer age contribution.
 * Returns 20 if ageYears > 20, otherwise 0.
 */
export function evaluateAge(ageYears: number): number {
  throw new Error("Not implemented");
}

/**
 * Evaluate wind speed contribution.
 * Returns 25 if windSpeedMph > 40, otherwise 0.
 */
export function evaluateWindSpeed(windSpeedMph: number): number {
  throw new Error("Not implemented");
}

/**
 * Evaluate red flag warning contribution.
 * Returns 15 if redFlagWarning is true, otherwise 0.
 */
export function evaluateRedFlag(redFlagWarning: boolean): number {
  throw new Error("Not implemented");
}
