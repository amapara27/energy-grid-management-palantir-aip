/**
 * LLM prompt templates for the AI Assistant.
 *
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

/** System prompt establishing the assistant's role and Ontology context. */
export const SYSTEM_PROMPT = "You are a grid operations AI assistant. Answer queries using Digital Twin Ontology data.";

/** Template for maintenance history queries (Requirement 8.2). */
export const MAINTENANCE_HISTORY_PROMPT = "Retrieve maintenance history for transformer {{transformerId}}.";

/** Template for crew availability queries (Requirement 8.3). */
export const CREW_AVAILABILITY_PROMPT = "Check crew availability for region {{region}}.";

/** Template for circuit health queries (Requirement 8.4). */
export const CIRCUIT_HEALTH_PROMPT = "Summarize circuit health for circuit {{circuitId}}.";

/** Template for the fallback response when a query cannot be resolved (Requirement 8.6). */
export const UNRESOLVABLE_QUERY_RESPONSE = "The requested information is unavailable. Try asking about transformer maintenance history, crew availability, or circuit health.";
