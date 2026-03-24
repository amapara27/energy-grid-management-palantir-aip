/**
 * RejectWorkOrder — Reject action handler.
 *
 * Requires the operator to provide a rejection reason before finalizing.
 * Updates the work order Status to "Rejected" with operator identity,
 * rejection reason, and timestamp.
 *
 * @see Requirements 6.4, 6.5
 */

import type { MaintenanceWorkOrder } from "../../../Ontology/Objects/MaintenanceWorkOrder.js";
import type { RejectionAction } from "../../../Logic/Work_Order_Service/types.js";

/** Input collected from the operator during rejection. */
export interface RejectionInput {
  operatorId: string;
  reason: string;
}

/** Interface for the reject work order action handler. */
export interface IRejectWorkOrderAction {
  /** Execute the rejection flow for a given work order. */
  execute(woId: string, input: RejectionInput): MaintenanceWorkOrder;
}

/** Placeholder reject action handler. */
export function createRejectWorkOrderAction(): IRejectWorkOrderAction {
  throw new Error("Not implemented");
}
