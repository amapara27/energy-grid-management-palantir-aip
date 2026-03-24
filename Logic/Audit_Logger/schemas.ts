/**
 * Audit record schemas per event type.
 *
 * Each schema defines the required payload fields for its corresponding
 * AuditEventType. These are used to validate audit record completeness.
 *
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5
 */

import type { AuditEventType } from "./types.js";

/** Required payload fields for each audit event type. */
export const auditRecordSchemas: Record<AuditEventType, readonly string[]> = {
  /** Requirement 9.1 — Risk score computation audit fields. */
  RiskScoreComputed: [
    "transformerId",
    "inputValues",
    "contributingFactors",
    "computedScore",
    "timestamp",
  ],

  /** Requirement 9.2 — Alert generation audit fields. */
  AlertGenerated: [
    "transformerId",
    "riskScore",
    "alertStatusTransition",
    "timestamp",
  ],

  /** Requirement 9.2 — Alert clearance audit fields. */
  AlertCleared: [
    "transformerId",
    "riskScore",
    "alertStatusTransition",
    "timestamp",
  ],

  /** Requirement 9.3 — Work order creation audit fields. */
  WorkOrderCreated: [
    "woId",
    "previousStatus",
    "newStatus",
    "timestamp",
  ],

  /** Requirement 9.3 — Work order approval audit fields. */
  WorkOrderApproved: [
    "woId",
    "previousStatus",
    "newStatus",
    "operatorId",
    "timestamp",
  ],

  /** Requirement 9.3 — Work order rejection audit fields. */
  WorkOrderRejected: [
    "woId",
    "previousStatus",
    "newStatus",
    "operatorId",
    "timestamp",
  ],

  /** Requirement 9.4 — ERP writeback attempt audit fields. */
  ERPWritebackAttempt: [
    "woId",
    "erpEndpoint",
    "transmissionStatus",
    "erpReferenceId",
    "errorDetails",
    "timestamp",
  ],

  /** Requirement 9.5 — AI assistant query audit fields. */
  AIAssistantQuery: [
    "operatorId",
    "queryText",
    "responseText",
    "citedObjects",
    "timestamp",
  ],
};
