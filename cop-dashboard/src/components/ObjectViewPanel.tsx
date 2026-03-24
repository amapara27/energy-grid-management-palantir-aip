"use client";

import React, { useMemo } from "react";
import { useDashboard } from "./DashboardContext";
import { riskColor } from "../lib/utils";
import type {
  TransformerWithGeo,
  Circuit,
  WeatherForecast,
  MaintenanceWorkOrder,
} from "../lib/types";

// ---------------------------------------------------------------------------
// ObjectViewPanel
// ---------------------------------------------------------------------------

export function ObjectViewPanel() {
  const { state, dispatch } = useDashboard();
  const {
    transformers,
    circuits,
    workOrders,
    forecasts,
    transformerCircuitMap,
    selectedTransformerId,
  } = state;

  const transformer = useMemo(
    () => transformers.find((t) => t.transformerId === selectedTransformerId) ?? null,
    [transformers, selectedTransformerId],
  );

  const circuit = useMemo(() => {
    if (!transformer) return null;
    const circuitId = transformerCircuitMap[transformer.transformerId];
    return circuits.find((c) => c.circuitId === circuitId) ?? null;
  }, [transformer, circuits, transformerCircuitMap]);

  const linkedForecasts = useMemo(() => {
    if (!circuit) return [];
    return forecasts
      .filter((f) => f.circuitId === circuit.circuitId)
      .sort((a, b) => a.forecastTimestamp.localeCompare(b.forecastTimestamp));
  }, [circuit, forecasts]);

  const linkedWorkOrders = useMemo(() => {
    if (!transformer) return [];
    return workOrders.filter((wo) => wo.transformerId === transformer.transformerId);
  }, [transformer, workOrders]);

  const isOpen = selectedTransformerId !== null;

  return (
    <div
      className={`ovp ${isOpen ? "ovp--open" : ""}`}
      data-testid="object-view-panel"
      role="complementary"
      aria-label="Transformer detail panel"
    >
      {!transformer ? (
        <EmptyState />
      ) : (
        <>
          <div className="ovp__header">
            <h2 className="ovp__title">{transformer.transformerId}</h2>
            <button
              className="ovp__close"
              data-testid="ovp-close"
              aria-label="Close panel"
              onClick={() => dispatch({ type: "SELECT_TRANSFORMER", id: null })}
            >
              ✕
            </button>
          </div>
          <div className="ovp__body">
            <TransformerSection transformer={transformer} />
            {circuit && <CircuitSection circuit={circuit} />}
            <ForecastSection forecasts={linkedForecasts} />
            <WorkOrderSection workOrders={linkedWorkOrders} />
            <PropertyHistorySection transformer={transformer} />
          </div>
        </>
      )}
    </div>
  );
}


// ---------------------------------------------------------------------------
// Empty State (Requirement 6.5)
// ---------------------------------------------------------------------------

function EmptyState() {
  return (
    <div className="ovp__empty" data-testid="ovp-empty">
      <span className="ovp__empty-icon" aria-hidden="true">⬡</span>
      <p className="ovp__empty-text">
        Select a transformer from the map or table to view details
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section 1: Transformer Properties (Requirement 6.1)
// ---------------------------------------------------------------------------

function TransformerSection({ transformer }: { transformer: TransformerWithGeo }) {
  const color = riskColor(transformer.riskScore);

  return (
    <section className="ovp__section" data-testid="ovp-transformer-section">
      <h3 className="ovp__section-title">Transformer Properties</h3>
      <dl className="ovp__dl">
        <div className="ovp__dl-row">
          <dt>ID</dt>
          <dd data-testid="ovp-transformer-id">{transformer.transformerId}</dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Oil Temp</dt>
          <dd data-testid="ovp-oil-temp">{transformer.oilTemp}°C</dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Load Current</dt>
          <dd data-testid="ovp-load-current">{transformer.loadCurrent} A</dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Age</dt>
          <dd data-testid="ovp-age">{transformer.ageYears} yrs</dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Last Inspection</dt>
          <dd data-testid="ovp-last-inspection">
            {new Date(transformer.lastInspectionDate).toLocaleDateString()}
          </dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Risk Score</dt>
          <dd data-testid="ovp-risk-score" className={`risk-${color}`}>
            {transformer.riskScore}
          </dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Alert Status</dt>
          <dd data-testid="ovp-alert-status">
            {transformer.alertStatus ?? "None"}
          </dd>
        </div>
      </dl>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 2: Linked Circuit (Requirement 6.2)
// ---------------------------------------------------------------------------

function CircuitSection({ circuit }: { circuit: Circuit }) {
  return (
    <section className="ovp__section" data-testid="ovp-circuit-section">
      <h3 className="ovp__section-title">Linked Circuit</h3>
      <dl className="ovp__dl">
        <div className="ovp__dl-row">
          <dt>Circuit ID</dt>
          <dd data-testid="ovp-circuit-id">{circuit.circuitId}</dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Name</dt>
          <dd data-testid="ovp-circuit-name">{circuit.circuitName}</dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Voltage</dt>
          <dd data-testid="ovp-voltage">{circuit.voltageLevel}</dd>
        </div>
        <div className="ovp__dl-row">
          <dt>Zone</dt>
          <dd data-testid="ovp-zone">{circuit.geographicZone}</dd>
        </div>
      </dl>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 3: Weather Forecast Timeline (Requirement 6.3)
// ---------------------------------------------------------------------------

function ForecastSection({ forecasts }: { forecasts: WeatherForecast[] }) {
  return (
    <section className="ovp__section" data-testid="ovp-forecast-section">
      <h3 className="ovp__section-title">Weather Forecast</h3>
      {forecasts.length === 0 ? (
        <p className="ovp__muted">No forecasts available</p>
      ) : (
        <div className="ovp__forecast-list">
          {forecasts.map((f) => (
            <div
              key={f.forecastId}
              className={`ovp__forecast-card ${f.redFlagWarning ? "ovp__forecast-card--warning" : ""}`}
              data-testid={`ovp-forecast-${f.forecastId}`}
            >
              <span className="ovp__forecast-time">
                {new Date(f.forecastTimestamp).toLocaleString()}
              </span>
              <div className="ovp__forecast-details">
                <span data-testid={`ovp-wind-${f.forecastId}`}>
                  {f.windSpeedMph} mph
                </span>
                <span data-testid={`ovp-humidity-${f.forecastId}`}>
                  {f.humidityPct}%
                </span>
                {f.redFlagWarning && (
                  <span
                    className="ovp__red-flag"
                    data-testid={`ovp-redflag-${f.forecastId}`}
                  >
                    ⚑ Red Flag
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}


// ---------------------------------------------------------------------------
// Section 4: Work Order History (Requirement 6.4)
// ---------------------------------------------------------------------------

function WorkOrderSection({ workOrders }: { workOrders: MaintenanceWorkOrder[] }) {
  return (
    <section className="ovp__section" data-testid="ovp-workorder-section">
      <h3 className="ovp__section-title">Work Order History</h3>
      {workOrders.length === 0 ? (
        <p className="ovp__muted">No work orders</p>
      ) : (
        <div className="ovp__wo-list">
          {workOrders.map((wo) => (
            <div
              key={wo.woId}
              className="ovp__wo-row"
              data-testid={`ovp-wo-${wo.woId}`}
            >
              <span className="ovp__wo-id">{wo.woId}</span>
              <span
                className={`ovp__wo-priority ovp__wo-priority--${wo.priority.toLowerCase()}`}
                data-testid={`ovp-wo-priority-${wo.woId}`}
              >
                {wo.priority}
              </span>
              <span data-testid={`ovp-wo-status-${wo.woId}`}>{wo.status}</span>
              <span data-testid={`ovp-wo-crew-${wo.woId}`}>{wo.assignedCrew}</span>
              <span className="ovp__wo-time">
                {new Date(wo.createdTimestamp).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section 5: Property History Sparkline (Requirement 6.6)
// ---------------------------------------------------------------------------

function PropertyHistorySection({ transformer }: { transformer: TransformerWithGeo }) {
  // Generate synthetic history points for Oil Temp and Risk Score.
  // In production this would come from a time-series API; here we derive
  // a small set of plausible past values from the current reading.
  const oilHistory = useMemo(() => generateHistory(transformer.oilTemp, 6), [transformer.oilTemp]);
  const riskHistory = useMemo(() => generateHistory(transformer.riskScore, 6), [transformer.riskScore]);

  return (
    <section className="ovp__section" data-testid="ovp-history-section">
      <h3 className="ovp__section-title">Property History</h3>
      <div className="ovp__sparklines">
        <div className="ovp__sparkline-group">
          <span className="ovp__sparkline-label">Oil Temp</span>
          <Sparkline values={oilHistory} color="var(--color-risk-amber)" testId="ovp-spark-oil" />
        </div>
        <div className="ovp__sparkline-group">
          <span className="ovp__sparkline-label">Risk Score</span>
          <Sparkline values={riskHistory} color="var(--color-risk-red)" testId="ovp-spark-risk" />
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sparkline (SVG mini-chart)
// ---------------------------------------------------------------------------

function Sparkline({
  values,
  color,
  testId,
}: {
  values: number[];
  color: string;
  testId: string;
}) {
  if (values.length < 2) return null;

  const width = 120;
  const height = 32;
  const padding = 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = padding + (i / (values.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((v - min) / range) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="ovp__sparkline-svg"
      data-testid={testId}
      role="img"
      aria-label={`Sparkline showing values: ${values.join(", ")}`}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Generate a small synthetic history ending at `current`. */
function generateHistory(current: number, count: number): number[] {
  const result: number[] = [];
  let val = Math.max(0, current - count * 3);
  for (let i = 0; i < count - 1; i++) {
    result.push(Math.round(val));
    val += (current - val) / (count - i);
  }
  result.push(current);
  return result;
}


