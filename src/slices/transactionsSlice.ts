import { createSlice } from "@reduxjs/toolkit";

export type Transaction = {
  id: string;
  summary: string;
  bank: string;
  externalId: string;
  date: Date;
  kind: "income" | "expense";
  amount: number;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  parentId: string;
}

// Food -> delivery

interface TransactionsState {
  transactions: Transaction[];
  categories: Category[];
}

const initialState: TransactionsState = {
  transactions: [],
  categories: [],
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  selectors: {},
});

const { actions, reducer } = transactionsSlice;

export const {} = actions;

export default reducer;
