/**
 * WeatherForecast Ontology Object Type
 *
 * Represents a meteorological prediction associated with a circuit's geographic zone.
 *
 * @see Requirements 2.3
 */

export interface WeatherForecast {
  /** Primary key — unique forecast identifier */
  forecastId: string;
  /** Foreign key referencing the associated Circuit */
  circuitId: string;
  /** Predicted wind speed in miles per hour (>= 0) */
  windSpeedMph: number;
  /** Predicted humidity percentage (0–100) */
  humidityPct: number;
  /** Whether a red-flag fire warning is active */
  redFlagWarning: boolean;
  /** Forecast timestamp in ISO 8601 datetime format */
  forecastTimestamp: string;
}
