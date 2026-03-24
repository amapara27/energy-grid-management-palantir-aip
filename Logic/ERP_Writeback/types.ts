/**
 * ERP Writeback types and interfaces.
 *
 * Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5
 */

import type { WorkOrderPriority } from "../Work_Order_Service/types.js";

export interface ERPPayload {
  woId: string;
  transformerId: string;
  priority: WorkOrderPriority;
  assignedCrew: string;
  approvalTimestamp: string;
}

export interface ERPResponse {
  success: boolean;
  erpReferenceId?: string;
  errorMessage?: string;
}

export interface IERPWritebackService {
  transmitWorkOrder(payload: ERPPayload): Promise<ERPResponse>;
}
