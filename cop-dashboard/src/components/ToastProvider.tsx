"use client";

import { useEffect, useRef } from "react";
import { useDashboard } from "./DashboardContext";

const TOAST_DURATION = 4000;

const ICONS: Record<string, string> = {
  success: "✓",
  info: "ℹ",
  error: "✕",
};

export default function ToastProvider() {
  const { state, dispatch } = useDashboard();
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timers = timersRef.current;

    for (const toast of state.toasts) {
      if (!timers.has(toast.id)) {
        const timer = setTimeout(() => {
          dispatch({ type: "DISMISS_TOAST", id: toast.id });
          timers.delete(toast.id);
        }, TOAST_DURATION);
        timers.set(toast.id, timer);
      }
    }

    // Clean up timers for toasts that no longer exist
    for (const [id, timer] of timers) {
      if (!state.toasts.some((t) => t.id === id)) {
        clearTimeout(timer);
        timers.delete(id);
      }
    }
  }, [state.toasts, dispatch]);

  // Cleanup all timers on unmount
  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      for (const timer of timers.values()) clearTimeout(timer);
      timers.clear();
    };
  }, []);

  if (state.toasts.length === 0) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {state.toasts.map((toast) => (
        <div key={toast.id} className={`toast toast--${toast.type}`}>
          <span className="toast__icon">{ICONS[toast.type]}</span>
          <span className="toast__message">{toast.message}</span>
          <button
            className="toast__dismiss"
            onClick={() => dispatch({ type: "DISMISS_TOAST", id: toast.id })}
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
