export type Bank = "rakuten" | "mufg" | "smbc";

export type Transaction = {
  summary: string;
  bank: Bank;
  externalId: string;
  date: string;
  amount: number;
};

export type Category = {
  id: string;
  name: string;
  substrings: string[];
};
