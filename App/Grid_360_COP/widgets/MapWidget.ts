/**
 * MapWidget — Interactive transformer map with color-coded markers.
 *
 * Displays all Transformer objects at their GIS coordinates.
 * Marker color is derived from Alert_Status:
 *   - "Active"          → red
 *   - "Data_Incomplete"  → yellow
 *   - "Cleared" | null   → green
 *
 * @see Requirements 5.1, 5.2, 5.6
 */

import type { Transformer, AlertStatus } from "../../Ontology/Objects/Transformer.js";

/** GIS coordinate pair for map positioning. */
export interface GeoCoordinate {
  latitude: number;
  longitude: number;
}

/** A single marker rendered on the map. */
export interface TransformerMarker {
  transformerId: string;
  position: GeoCoordinate;
  color: "red" | "yellow" | "green";
  alertStatus: AlertStatus | null;
  riskScore: number;
}

/** Configuration accepted by the map widget. */
export interface MapWidgetConfig {
  /** Initial map center coordinate. */
  center: GeoCoordinate;
  /** Initial zoom level. */
  zoom: number;
}

/** Interface for the interactive map widget. */
export interface IMapWidget {
  /** Render transformer markers on the map. */
  render(transformers: Transformer[], config: MapWidgetConfig): void;
  /** Handle operator selecting a transformer marker. */
  onSelect(transformerId: string): void;
}

/**
 * Derive marker color from Alert_Status.
 * @see Requirements 5.2 — color-coding by Alert_Status
 */
export function markerColor(status: AlertStatus | null): "red" | "yellow" | "green" {
  throw new Error("Not implemented");
}

/** Placeholder map widget implementation. */
export function createMapWidget(): IMapWidget {
  throw new Error("Not implemented");
}
