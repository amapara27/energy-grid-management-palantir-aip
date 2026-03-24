"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
} from "react";
import type {
  TransformerWithGeo,
  Circuit,
  MaintenanceWorkOrder,
  WeatherForecast,
  Toast,
} from "../lib/types";

// ---------------------------------------------------------------------------
// State & Action types
// ---------------------------------------------------------------------------

export interface DashboardState {
  transformers: TransformerWithGeo[];
  circuits: Circuit[];
  workOrders: MaintenanceWorkOrder[];
  forecasts: WeatherForecast[];
  transformerCircuitMap: Record<string, string>;
  selectedTransformerId: string | null;
  toasts: Toast[];
}

export type DashboardAction =
  | { type: "SELECT_TRANSFORMER"; id: string | null }
  | { type: "REMOVE_WORK_ORDER"; woId: string }
  | { type: "UPDATE_WORK_ORDER"; workOrder: MaintenanceWorkOrder }
  | { type: "ADD_TOAST"; toast: Toast }
  | { type: "DISMISS_TOAST"; id: string };

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function dashboardReducer(
  state: DashboardState,
  action: DashboardAction,
): DashboardState {
  switch (action.type) {
    case "SELECT_TRANSFORMER":
      return { ...state, selectedTransformerId: action.id };

    case "REMOVE_WORK_ORDER":
      return {
        ...state,
        workOrders: state.workOrders.filter((wo) => wo.woId !== action.woId),
      };

    case "UPDATE_WORK_ORDER":
      return {
        ...state,
        workOrders: state.workOrders.map((wo) =>
          wo.woId === action.workOrder.woId ? action.workOrder : wo,
        ),
      };

    case "ADD_TOAST":
      return { ...state, toasts: [...state.toasts, action.toast] };

    case "DISMISS_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.id),
      };

    default:
      return state;
  }
}


// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const DashboardContext = createContext<
  | { state: DashboardState; dispatch: React.Dispatch<DashboardAction> }
  | undefined
>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export interface DashboardProviderProps {
  initialState: DashboardState;
  children: ReactNode;
}

export function DashboardProvider({
  initialState,
  children,
}: DashboardProviderProps) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardContext.Provider value={{ state, dispatch }}>
      {children}
    </DashboardContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return ctx;
}
