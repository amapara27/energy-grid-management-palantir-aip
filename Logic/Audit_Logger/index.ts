/**
 * Audit Logger — centralized audit logging entry point.
 *
 * Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7
 */

import type { AuditEventType, AuditRecord } from "./types.js";

export function log(
  eventType: AuditEventType,
  payload: Record<string, unknown>,
): AuditRecord {
  throw new Error("Not implemented");
}
