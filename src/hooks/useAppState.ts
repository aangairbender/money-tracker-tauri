import { useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/api/fs";
import { Category, Transaction } from "@models";

// const uniqueTransactions = action.payload.filter(item => 
//   !state.some(t => t.bank === item.bank && t.externalId === item.externalId)
// );
// state.push(...uniqueTransactions);


export const useAppState = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadStateFromDisk() {
    try {
      const content = await readTextFile("data.json", { dir: BaseDirectory.AppLocalData });
      const json = JSON.parse(content);
      setTransactions(json['transactions']);
      setCategories(json['categories']);
    } catch (e) {
      console.warn(e);
    }
  }

  async function saveStateToDisk() {
    try {
      const json = {
        'transactions': transactions,
        'categories': categories,
      };
      const content = JSON.stringify(json);
      await writeTextFile("data.json", content, { dir: BaseDirectory.AppLocalData });
    } catch (e) {
      console.warn(e);
    }
  }

  async function importCsv(csvPath: string) {

  }

  // loading initial state
  useEffect(() => {
    loadStateFromDisk();
  }, []);

  return { transactions, categories, importCsv };
};
