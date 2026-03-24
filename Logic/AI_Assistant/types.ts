/**
 * AI Assistant query/response types and interfaces.
 *
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 8.6
 */

export interface AssistantQuery {
  operatorId: string;
  queryText: string;
  timestamp: string;
}

export interface AssistantResponse {
  responseText: string;
  citedObjects: Array<{ objectType: string; objectId: string; properties: string[] }>;
  timestamp: string;
}

export interface IAIAssistant {
  handleQuery(query: AssistantQuery): Promise<AssistantResponse>;
}
