/**
 * ActionInbox — Pending work order queue widget.
 *
 * Lists all draft Maintenance_Work_Orders with Status "Pending_Approval",
 * sorted by Priority descending (Critical before High) then by
 * Created_Timestamp ascending within the same priority.
 *
 * @see Requirements 5.4, 6.1
 */

import type { MaintenanceWorkOrder } from "../../Ontology/Objects/MaintenanceWorkOrder.js";

/** A single item rendered in the action inbox. */
export interface InboxItem {
  woId: string;
  transformerId: string;
  priority: string;
  createdTimestamp: string;
}

/** Interface for the action inbox widget. */
export interface IActionInbox {
  /** Render the inbox with pending work orders. */
  render(items: InboxItem[]): void;
  /** Handle operator selecting a work order for review. */
  onItemSelect(woId: string): void;
}

/**
 * Sort work orders for inbox display.
 * Priority descending (Critical > High), then Created_Timestamp ascending.
 */
export function sortInboxItems(orders: MaintenanceWorkOrder[]): MaintenanceWorkOrder[] {
  throw new Error("Not implemented");
}

/** Placeholder action inbox implementation. */
export function createActionInbox(): IActionInbox {
  throw new Error("Not implemented");
}
