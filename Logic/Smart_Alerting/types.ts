/**
 * Smart Alerting types and interfaces.
 *
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */

import type { RiskFactorBreakdown, RiskScoreResult } from "../Risk_Scoring/types.js";

export interface SmartAlert {
  alertId: string;
  transformerId: string;
  riskScore: number;
  contributingFactors: RiskFactorBreakdown;
  evaluatedAt: string;
  status: "Active" | "Cleared";
}

export interface ISmartAlertingEngine {
  evaluateTransformer(scoreResult: RiskScoreResult, threshold: number): SmartAlert | null;
  clearAlert(transformerId: string, currentScore: number, threshold: number): SmartAlert | null;
}
