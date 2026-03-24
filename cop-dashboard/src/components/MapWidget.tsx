"use client";

import React from "react";
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

// ---------------------------------------------------------------------------
// MapWidget
// ---------------------------------------------------------------------------

export function MapWidget() {
  const { state, dispatch } = useDashboard();

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
              radius={8}
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
