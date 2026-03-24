/**
 * Risk Scoring types and interfaces.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5
 */

export interface RiskFactorInput {
  oilTempC: number;
  ageYears: number;
  windSpeedMph: number;
  redFlagWarning: boolean;
}

export interface RiskFactorBreakdown {
  oilTempContribution: number;   // 0 or 40
  ageContribution: number;       // 0 or 20
  windContribution: number;      // 0 or 25
  redFlagContribution: number;   // 0 or 15
}

export interface RiskScoreResult {
  transformerId: string;
  score: number;                 // 0–100
  factors: RiskFactorBreakdown;
  evaluatedAt: string;           // ISO 8601 timestamp
}

export interface IRiskScoringEngine {
  computeRiskScore(transformerId: string, input: RiskFactorInput): RiskScoreResult;
}
