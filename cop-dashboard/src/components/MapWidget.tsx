"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { useDashboard } from "./DashboardContext";
import { riskColor } from "../lib/utils";
import type { RiskColor } from "../lib/types";

// ---------------------------------------------------------------------------
// Color map (matches globals.css risk tokens)
// ---------------------------------------------------------------------------

const RISK_HEX: Record<RiskColor, string> = {
  green: "#22d67a",
  amber: "#f5a623",
  red: "#ef4056",
};

// Marker radius: 8px desktop, 22px mobile (≥44px diameter touch target)
const MARKER_RADIUS_DESKTOP = 8;
const MARKER_RADIUS_MOBILE = 22;
const MOBILE_BREAKPOINT = 1024;

// ---------------------------------------------------------------------------
// MapWidget
// ---------------------------------------------------------------------------

export function MapWidget() {
  const { state, dispatch } = useDashboard();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const markerRadius = isMobile ? MARKER_RADIUS_MOBILE : MARKER_RADIUS_DESKTOP;

  return (
    <div className="map-widget" data-testid="map-widget">
      <MapContainer
        center={[32.78, -96.8]}
        zoom={10}
        scrollWheelZoom
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {state.transformers.map((t) => {
          const color = riskColor(t.riskScore);
          const hex = RISK_HEX[color];

          return (
            <CircleMarker
              key={t.transformerId}
              center={[t.latitude, t.longitude]}
              radius={markerRadius}
              pathOptions={{
                color: hex,
                fillColor: hex,
                fillOpacity: 0.85,
                weight: 2,
              }}
              eventHandlers={{
                click: () =>
                  dispatch({ type: "SELECT_TRANSFORMER", id: t.transformerId }),
              }}
            >
              <Tooltip direction="top" offset={[0, -8]} opacity={0.95}>
                <span className="map-tooltip">
                  <strong>{t.transformerId}</strong> — Risk: {t.riskScore}
                </span>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
