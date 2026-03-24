"use client";

import React, { useMemo } from "react";
import { useDashboard } from "./DashboardContext";
import { sortByRiskDesc, riskColor } from "../lib/utils";
import type { RiskColor } from "../lib/types";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Look up the latest wind forecast for a transformer's circuit. */
function getWindForecast(
  transformerId: string,
  circuitMap: Record<string, string>,
  forecasts: { circuitId: string; windSpeedMph: number; forecastTimestamp: string }[],
): number | null {
  const circuitId = circuitMap[transformerId];
  if (!circuitId) return null;
  const matching = forecasts
    .filter((f) => f.circuitId === circuitId)
    .sort((a, b) => (a.forecastTimestamp > b.forecastTimestamp ? -1 : 1));
  return matching.length > 0 ? matching[0].windSpeedMph : null;
}

// ---------------------------------------------------------------------------
// ObjectTable
// ---------------------------------------------------------------------------

export function ObjectTable() {
  const { state, dispatch } = useDashboard();
  const { transformers, circuits, forecasts, transformerCircuitMap, selectedTransformerId } = state;

  const sorted = useMemo(() => sortByRiskDesc(transformers), [transformers]);

  const circuitNameMap = useMemo(() => {
    const map: Record<string, string> = {};
    for (const c of circuits) {
      map[c.circuitId] = c.circuitName;
    }
    return map;
  }, [circuits]);

  return (
    <div className="object-table" data-testid="object-table" role="table" aria-label="Transformer Fleet Table">
      <div className="object-table__header" role="row">
        <span className="object-table__th" role="columnheader">ID</span>
        <span className="object-table__th" role="columnheader">Circuit</span>
        <span className="object-table__th object-table__th--num" role="columnheader">Oil °C</span>
        <span className="object-table__th object-table__th--num" role="columnheader">Wind mph</span>
        <span className="object-table__th object-table__th--num" role="columnheader">Risk</span>
        <span className="object-table__th" role="columnheader">Alert</span>
      </div>

      <div className="object-table__body" role="rowgroup">
        {sorted.map((t) => {
          const color: RiskColor = riskColor(t.riskScore);
          const circuitId = transformerCircuitMap[t.transformerId];
          const circuitName = circuitId ? circuitNameMap[circuitId] ?? "—" : "—";
          const wind = getWindForecast(t.transformerId, transformerCircuitMap, forecasts);
          const isSelected = t.transformerId === selectedTransformerId;

          return (
            <div
              key={t.transformerId}
              className={`object-table__row object-table__row--${color}${isSelected ? " object-table__row--selected" : ""}`}
              role="row"
              data-testid={`table-row-${t.transformerId}`}
              tabIndex={0}
              onClick={() => dispatch({ type: "SELECT_TRANSFORMER", id: t.transformerId })}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  dispatch({ type: "SELECT_TRANSFORMER", id: t.transformerId });
                }
              }}
            >
              <span className="object-table__cell" role="cell" data-testid="cell-id">{t.transformerId}</span>
              <span className="object-table__cell" role="cell" data-testid="cell-circuit">{circuitName}</span>
              <span className="object-table__cell object-table__cell--num" role="cell" data-testid="cell-oil">{t.oilTemp}°</span>
              <span className="object-table__cell object-table__cell--num" role="cell" data-testid="cell-wind">{wind !== null ? `${wind}` : "—"}</span>
              <span className={`object-table__cell object-table__cell--num risk-${color}`} role="cell" data-testid="cell-risk">{t.riskScore}</span>
              <span className="object-table__cell" role="cell" data-testid="cell-alert">{t.alertStatus ?? "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
