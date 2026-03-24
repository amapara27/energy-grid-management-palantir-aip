"use client";

import React, { useMemo } from "react";
import { useDashboard } from "./DashboardContext";
import { computeKPIMetrics } from "@/lib/kpi";
import { riskColor } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Warning thresholds
// ---------------------------------------------------------------------------
const ALERT_THRESHOLD = 3;
const PENDING_WO_THRESHOLD = 5;
const INSPECTED_LOW_THRESHOLD = 5;
const CIRCUIT_RISK_THRESHOLD = 60;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function KPIBanner() {
  const { state } = useDashboard();
  const { transformers, workOrders, circuits, transformerCircuitMap } = state;

  const kpi = useMemo(
    () => computeKPIMetrics(transformers, workOrders, circuits, transformerCircuitMap),
    [transformers, workOrders, circuits, transformerCircuitMap],
  );

  const alertWarning = kpi.activeExtremeAlerts >= ALERT_THRESHOLD;
  const pendingWarning = kpi.pendingWorkOrders >= PENDING_WO_THRESHOLD;
  const inspectedWarning = kpi.inspectedThisWeek < INSPECTED_LOW_THRESHOLD;

  return (
    <header className="kpi-banner" role="banner" aria-label="Fleet KPI Summary">
      {/* Active Extreme Alerts */}
      <div
        className={`kpi-card${alertWarning ? " kpi-card--warning" : ""}`}
        data-testid="kpi-active-alerts"
      >
        <span className="kpi-icon" aria-hidden="true">⚡</span>
        <div className="kpi-content">
          <span className="kpi-value">{kpi.activeExtremeAlerts}</span>
          <span className="kpi-label">Extreme Alerts</span>
        </div>
        {alertWarning && <span className="kpi-warning-dot" data-testid="alert-warning" aria-label="Warning: high alert count" />}
      </div>

      {/* Pending Work Orders */}
      <div
        className={`kpi-card${pendingWarning ? " kpi-card--warning" : ""}`}
        data-testid="kpi-pending-wo"
      >
        <span className="kpi-icon" aria-hidden="true">📋</span>
        <div className="kpi-content">
          <span className="kpi-value">{kpi.pendingWorkOrders}</span>
          <span className="kpi-label">Pending Orders</span>
        </div>
        {pendingWarning && <span className="kpi-warning-dot" data-testid="pending-warning" aria-label="Warning: many pending orders" />}
      </div>

      {/* Inspected This Week */}
      <div
        className={`kpi-card${inspectedWarning ? " kpi-card--warning" : ""}`}
        data-testid="kpi-inspected"
      >
        <span className="kpi-icon" aria-hidden="true">🔍</span>
        <div className="kpi-content">
          <span className="kpi-value">{kpi.inspectedThisWeek}</span>
          <span className="kpi-label">Inspected This Week</span>
        </div>
        {inspectedWarning && <span className="kpi-warning-dot" data-testid="inspected-warning" aria-label="Warning: low inspection count" />}
      </div>

      {/* Avg Risk by Circuit */}
      <div className="kpi-card kpi-card--wide" data-testid="kpi-avg-risk">
        <span className="kpi-icon" aria-hidden="true">📊</span>
        <div className="kpi-content">
          <span className="kpi-label">Avg Risk by Circuit</span>
          <div className="kpi-badges">
            {kpi.avgRiskByCircuit.length === 0 && (
              <span className="kpi-badge kpi-badge--empty">No data</span>
            )}
            {kpi.avgRiskByCircuit.map((c) => {
              const color = riskColor(c.avgRisk);
              const isWarning = c.avgRisk >= CIRCUIT_RISK_THRESHOLD;
              return (
                <span
                  key={c.circuitId}
                  className={`kpi-badge kpi-badge--${color}`}
                  data-testid={`circuit-badge-${c.circuitId}`}
                  title={`${c.circuitName}: ${c.avgRisk.toFixed(1)}`}
                >
                  {c.circuitName.split(" ")[0]} {c.avgRisk.toFixed(0)}
                  {isWarning && <span className="kpi-warning-dot" data-testid={`circuit-warning-${c.circuitId}`} aria-label={`Warning: high risk for ${c.circuitName}`} />}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}
