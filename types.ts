
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  amount: number;
  date: string;
  description: string;
}

export interface CategoryBudget {
  category: string;
  budget: number;
  spent: number;
}

// Fixed: Made uri and title optional to match @google/genai GroundingChunkWeb type
export interface GroundingSource {
  web?: {
    uri?: string;
    title?: string;
  };
}
