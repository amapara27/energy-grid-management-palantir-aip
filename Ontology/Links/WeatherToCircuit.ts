/**
 * WeatherToCircuit Link Type
 *
 * Defines a one-to-one relationship: each WeatherForecast is associated with exactly
 * one Circuit, and each Circuit has at most one active WeatherForecast.
 *
 * @see Requirements 2.6
 */

import type { WeatherForecast } from "../Objects/WeatherForecast.js";
import type { Circuit } from "../Objects/Circuit.js";

export interface WeatherToCircuitLink {
  /** The weather forecast (one side) */
  weatherForecast: WeatherForecast;
  /** The associated circuit (one side) */
  circuit: Circuit;
}

/**
 * Resolves the Circuit associated with a given WeatherForecast.
 * Stub — throws until implemented.
 */
export function getCircuitForForecast(_forecastId: string): Circuit {
  throw new Error("Not implemented");
}

/**
 * Resolves the active WeatherForecast for a given Circuit, if any.
 * Stub — throws until implemented.
 */
export function getForecastForCircuit(_circuitId: string): WeatherForecast | null {
  throw new Error("Not implemented");
}
