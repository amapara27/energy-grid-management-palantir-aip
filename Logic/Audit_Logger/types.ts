/**
 * Audit Logger types and interfaces.
 *
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */

export type AuditEventType =
  | "RiskScoreComputed"
  | "AlertGenerated"
  | "AlertCleared"
  | "WorkOrderCreated"
  | "WorkOrderApproved"
  | "WorkOrderRejected"
  | "ERPWritebackAttempt"
  | "AIAssistantQuery";

export interface AuditRecord {
  eventId: string;
  eventType: AuditEventType;
  timestamp: string;
  payload: Record<string, unknown>;
}

export interface IAuditLogger {
  log(eventType: AuditEventType, payload: Record<string, unknown>): AuditRecord;
}
