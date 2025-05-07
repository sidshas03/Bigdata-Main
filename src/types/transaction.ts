
export interface Transaction {
  id?: string;
  amount?: number;
  date?: string;
  merchant?: string;
  cc_num?: string;
  amt?: number;
  zip?: string;
  lat?: number;
  long?: number;
  city_pop?: number;
  job?: string;
  unix_time?: number;
  [key: string]: any; // For any additional fields in CSV
}

export interface PredictionResponse {
  riskDistribution?: {
    High: number;
    Medium: number;
    Low: number;
  };
  fraudProbabilities?: number[];
  highRiskTransactions?: any[];
  mediumRiskTransactions?: any[];
  lowRiskTransactions?: any[];
}

export interface ProcessedTransaction extends Transaction {
  risk_level: "Low" | "Medium" | "High";
  fraud_probability: number;
}

export interface RiskDistData {
  name: string;
  value: number;
}

// Added new interface for API error handling
export interface ApiError {
  message: string;
  statusCode?: number;
}
