
export interface DecisionState {
  title: string;
  description: string;
  options: Option[];
  opportunityCost: string;
  marginalAnalysis: MarginalFactor;
  incentives: string[];
}

export interface Option {
  id: string;
  label: string;
  benefits: string[];
  costs: string[];
}

export interface MarginalFactor {
  action: string;
  currentLevel: number;
  marginalBenefit: string;
  marginalCost: string;
}

export enum Principle {
  TRADE_OFFS = "人们面临权衡取舍",
  OPPORTUNITY_COST = "某种东西的成本是为了得到它所放弃的东西",
  MARGINAL_THINKING = "理性人考虑边际量",
  INCENTIVES = "人们会对激励做出反应"
}

export interface AIAdvice {
  summary: string;
  critique: string;
  recommendation: string;
  score: number;
}
