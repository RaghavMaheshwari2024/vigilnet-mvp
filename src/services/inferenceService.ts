import axios from 'axios';

export interface TransactionDetails {
  sender: string;
  receiver: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  txTime: string; // ISO string format or datetime-local
  txType?: string;
  narration?: string;
}

export interface InferenceResponse {
  case_id: string;
  risk_probability: number;
  risk_level: 'Critical' | 'Warning' | 'Low';
  status: string;
}

// Base URL for the local FastAPI server
const API_BASE_URL = 'http://localhost:8005';

export const analyzeTransaction = async (
  details: TransactionDetails
): Promise<InferenceResponse> => {
  const response = await axios.post<InferenceResponse>(
    `${API_BASE_URL}/api/analyze`,
    details
  );
  return response.data;
};
