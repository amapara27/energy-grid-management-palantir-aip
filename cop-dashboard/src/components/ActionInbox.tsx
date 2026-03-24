"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useDashboard } from "./DashboardContext";
import { filterPendingApproval, sortWorkOrders } from "../lib/utils";
import { approveAndDispatch, defer24h, requestMoreInfo } from "../lib/api";
import type { MaintenanceWorkOrder } from "../lib/types";

// ---------------------------------------------------------------------------
// ActionInbox
// ---------------------------------------------------------------------------

export function ActionInbox() {
  const { state, dispatch } = useDashboard();

  const pendingOrders = useMemo(
    () => sortWorkOrders(filterPendingApproval(state.workOrders)),
    [state.workOrders],
  );

  // Track in-flight actions per work order + action type
  const [loadingMap, setLoadingMap] = useState<Record<string, string | null>>({});

  const setLoading = useCallback((woId: string, action: string | null) => {
    setLoadingMap((prev) => ({ ...prev, [woId]: action }));
  }, []);

  const addToast = useCallback(
    (message: string, type: "success" | "info" | "error") => {
      dispatch({
        type: "ADD_TOAST",
        toast: {
          id: crypto.randomUUID(),
          message,
          type,
          createdAt: Date.now(),
        },
      });
    },
    [dispatch],
  );

  const handleApprove = useCallback(
    async (woId: string) => {
      setLoading(woId, "approve");
      try {
        await approveAndDispatch(woId);
        dispatch({ type: "REMOVE_WORK_ORDER", woId });
        addToast(`WO ${woId} approved`, "success");
      } catch {
        addToast(`Action failed — please retry`, "error");
      } finally {
        setLoading(woId, null);
      }
    },
    [dispatch, addToast, setLoading],
  );

  const handleDefer = useCallback(
    async (woId: string) => {
      setLoading(woId, "defer");
      try {
        const updated = await defer24h(woId);
        dispatch({ type: "UPDATE_WORK_ORDER", workOrder: updated });
        addToast(`WO ${woId} deferred 24h`, "info");
      } catch {
        addToast(`Action failed — please retry`, "error");
      } finally {
        setLoading(woId, null);
      }
    },
    [dispatch, addToast, setLoading],
  );

  const handleRequestInfo = useCallback(
    async (woId: string) => {
      setLoading(woId, "info");
      try {
        const updated = await requestMoreInfo(woId);
        dispatch({ type: "UPDATE_WORK_ORDER", workOrder: updated });
        addToast(`Info requested for WO ${woId}`, "info");
      } catch {
        addToast(`Action failed — please retry`, "error");
      } finally {
        setLoading(woId, null);
      }
    },
    [dispatch, addToast, setLoading],
  );

  return (
    <div className="action-inbox" data-testid="action-inbox">
      <h2 className="action-inbox__title">Action Inbox</h2>

      {pendingOrders.length === 0 ? (
        <p className="action-inbox__empty" data-testid="action-inbox-empty">
          No pending approvals
        </p>
      ) : (
        <div className="action-inbox__list" data-testid="action-inbox-list">
          {pendingOrders.map((wo) => (
            <WorkOrderCard
              key={wo.woId}
              wo={wo}
              loadingAction={loadingMap[wo.woId] ?? null}
              onApprove={handleApprove}
              onDefer={handleDefer}
              onRequestInfo={handleRequestInfo}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// WorkOrderCard (internal)
// ---------------------------------------------------------------------------

interface WorkOrderCardProps {
  wo: MaintenanceWorkOrder;
  loadingAction: string | null;
  onApprove: (woId: string) => void;
  onDefer: (woId: string) => void;
  onRequestInfo: (woId: string) => void;
}

function WorkOrderCard({ wo, loadingAction, onApprove, onDefer, onRequestInfo }: WorkOrderCardProps) {
  const priorityClass =
    wo.priority === "Critical"
      ? "action-inbox__badge--critical"
      : "action-inbox__badge--high";

  return (
    <div className="action-inbox__card" data-testid={`wo-card-${wo.woId}`}>
      <div className="action-inbox__card-header">
        <span className="action-inbox__wo-id">{wo.woId}</span>
        <span className={`action-inbox__badge ${priorityClass}`}>{wo.priority}</span>
      </div>
      <div className="action-inbox__card-body">
        <span className="action-inbox__field" data-testid="wo-transformer">
          Transformer: {wo.transformerId}
        </span>
        <span className="action-inbox__field" data-testid="wo-crew">
          Crew: {wo.assignedCrew}
        </span>
        <span className="action-inbox__field" data-testid="wo-timestamp">
          Created: {new Date(wo.createdTimestamp).toLocaleString()}
        </span>
      </div>
      <div className="action-inbox__actions">
        <button
          className="action-inbox__btn action-inbox__btn--approve"
          data-testid={`btn-approve-${wo.woId}`}
          disabled={loadingAction !== null}
          onClick={() => onApprove(wo.woId)}
        >
          {loadingAction === "approve" ? "…" : "Approve & Dispatch"}
        </button>
        <button
          className="action-inbox__btn action-inbox__btn--defer"
          data-testid={`btn-defer-${wo.woId}`}
          disabled={loadingAction !== null}
          onClick={() => onDefer(wo.woId)}
        >
          {loadingAction === "defer" ? "…" : "Defer 24h"}
        </button>
        <button
          className="action-inbox__btn action-inbox__btn--info"
          data-testid={`btn-info-${wo.woId}`}
          disabled={loadingAction !== null}
          onClick={() => onRequestInfo(wo.woId)}
        >
          {loadingAction === "info" ? "…" : "Request More Info"}
        </button>
      </div>
    </div>
  );
}
