"use client";

import React from "react";
import {
  DashboardProvider,
  type DashboardState,
} from "./DashboardContext";
import { KPIBanner } from "./KPIBanner";
import { MapWidget } from "./MapWidget";
import { ObjectTable } from "./ObjectTable";
import { ActionInbox } from "./ActionInbox";
import { ObjectViewPanel } from "./ObjectViewPanel";
import ToastProvider from "./ToastProvider";
import type {
  TransformerWithGeo,
  Circuit,
  MaintenanceWorkOrder,
  WeatherForecast,
} from "../lib/types";

export interface DashboardShellProps {
  transformers: TransformerWithGeo[];
  circuits: Circuit[];
  workOrders: MaintenanceWorkOrder[];
  forecasts: WeatherForecast[];
  transformerCircuitMap: Record<string, string>;
}

export function DashboardShell({
  transformers,
  circuits,
  workOrders,
  forecasts,
  transformerCircuitMap,
}: DashboardShellProps) {
  const initialState: DashboardState = {
    transformers,
    circuits,
    workOrders,
    forecasts,
    transformerCircuitMap,
    selectedTransformerId: null,
    toasts: [],
  };

  return (
    <DashboardProvider initialState={initialState}>
      <div className="dashboard-shell">
        <div className="anim-banner-enter">
          <KPIBanner />
        </div>
        <div className="dashboard-shell__body">
          <aside className="dashboard-shell__sidebar-left anim-panel-enter-1">
            <ObjectTable />
          </aside>
          <main className="dashboard-shell__map anim-panel-enter-2">
            <MapWidget />
          </main>
          <aside className="dashboard-shell__sidebar-right anim-panel-enter-3">
            <ActionInbox />
          </aside>
        </div>
        <ObjectViewPanel />
        <ToastProvider />
      </div>
    </DashboardProvider>
  );
}
