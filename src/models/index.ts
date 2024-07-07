export type Transaction = {
  id: string;
  summary: string;
  bank: string;
  externalId: string;
  date: Date;
  kind: TransactionKind;
  amount: number;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  parentId?: string;
};

export type TransactionKind = "income" | "expense";
