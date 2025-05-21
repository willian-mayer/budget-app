// src/types/index.ts

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: string;
}

export interface Account {
  id: string;
  title: string;
  balance: number;
  transactions: Transaction[];
}
