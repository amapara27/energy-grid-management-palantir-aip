/**
 * MaintenanceWorkOrder Ontology Object Type
 *
 * Represents a maintenance request authorizing work on a transformer.
 *
 * @see Requirements 2.4
 */

export type WorkOrderStatus =
  | "Pending_Approval"
  | "Approved"
  | "Rejected"
  | "Dispatched"
  | "ERP_Error"
  | "ERP_Pending";

export type WorkOrderPriority = "Critical" | "High";

export interface MaintenanceWorkOrder {
  /** Primary key — unique work order identifier */
  woId: string;
  /** Foreign key referencing the target Transformer */
  transformerId: string;
  /** Priority derived from Risk_Score */
  priority: WorkOrderPriority;
  /** Current lifecycle status */
  status: WorkOrderStatus;
  /** Assigned maintenance crew (required on approval) */
  assignedCrew: string;
  /** Creation timestamp in ISO 8601 datetime format */
  createdTimestamp: string;
  /** ERP system reference ID, null until ERP confirms receipt */
  erpReferenceId: string | null;
}
