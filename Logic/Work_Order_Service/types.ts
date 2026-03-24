/**
 * Work Order Service types and interfaces.
 *
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
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
  woId: string;
  transformerId: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedCrew: string;
  createdTimestamp: string;
  erpReferenceId: string | null;
}

export interface ApprovalAction {
  operatorId: string;
  assignedCrew: string;
  priority: WorkOrderPriority;
  timestamp: string;
}

export interface RejectionAction {
  operatorId: string;
  reason: string;
  timestamp: string;
}

export interface IWorkOrderService {
  createDraftWorkOrder(transformerId: string, riskScore: number): MaintenanceWorkOrder;
  approveWorkOrder(woId: string, action: ApprovalAction): MaintenanceWorkOrder;
  rejectWorkOrder(woId: string, action: RejectionAction): MaintenanceWorkOrder;
}
