const API_BASE = "http://localhost:5000/api";

export interface ClaimData {
  months_as_customer: number;
  policy_state: string;
  policy_deductable: number;
  policy_annual_premium: number;
  umbrella_limit: number;
  insured_age: number;
  insured_sex: string;
  insured_education_level: string;
  insured_occupation: string;
  insured_relationship: string;
  incident_type: string;
  incident_severity: string;
  collision_type: string;
  incident_hour_of_the_day: number;
  number_of_vehicles_involved: number;
  property_damage: string;
  police_report_available: string;
  total_claim_amount: number;
  injury_claim: number;
  property_claim: number;
  vehicle_claim: number;
}

export interface PredictionResult {
  prediction: string;
  fraud_probability: number;
  risk_score: number;
  explanation?: string;
}

export interface HistoricalClaim {
  id: string;
  date: string;
  claim_amount: number;
  fraud_probability: number;
  risk_score: number;
  status: "Fraud" | "Genuine";
}

export async function predictClaim(data: ClaimData): Promise<PredictionResult> {
  const res = await fetch(`${API_BASE}/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Prediction failed");
  return res.json();
}

export async function getClaims(): Promise<HistoricalClaim[]> {
  const res = await fetch(`${API_BASE}/claims`);
  if (!res.ok) throw new Error("Failed to fetch claims");
  return res.json();
}
