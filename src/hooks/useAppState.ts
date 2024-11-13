import { useEffect, useState } from "react";
import { BaseDirectory, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { Category, Transaction } from "@models";
import { invoke } from '@tauri-apps/api/core'

interface AppState {
  transactions: Transaction[],
  categories: Category[],
}

interface LoadCsvResult {
  success: boolean;
  transactions: Transaction[];
  error: string;
}

const uniqueOnly = (items: Transaction[]): Transaction[] => {
  const idMap = new Map<string, Transaction>();
  items.forEach(t => idMap.set(t.externalId, t));
  return [...idMap.values()];
}

export const useAppState = () => {
  const [firstTime, setFirstTime] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  async function loadStateFromDisk() {
    try {
      const content = await readTextFile("data.json", { baseDir: BaseDirectory.AppLocalData });
      const state: AppState = JSON.parse(content);
      setTransactions(state.transactions);
      setCategories(state.categories);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    async function save() {
      try {
        const state: AppState = { transactions, categories };
        const content = JSON.stringify(state);
        await writeTextFile("data.json", content, { baseDir: BaseDirectory.AppLocalData });
      } catch (e) {
        alert(e);
      }
    }
    if (!firstTime) {
      save();
    }
  }, [transactions, categories]);

  async function importCsv(path: string) {
    const result: LoadCsvResult = await invoke("load_csv", { path });
    if (result.success) {
      setTransactions(t => uniqueOnly([...t, ...result.transactions]));
    } else {
      alert(result.error);
    }
  }

  function upsertCategory(category: Category) {
    setCategories(c => c.filter(item => item.id != category.id).concat([category]));
  }

  function deleteCategory(category: Category) {
    setCategories(c => c.filter(item => item.id != category.id));
  }

  // loading initial state
  useEffect(() => {
    loadStateFromDisk();
    setFirstTime(false);
  }, []);

  return { transactions, categories, importCsv, upsertCategory, deleteCategory };
};
