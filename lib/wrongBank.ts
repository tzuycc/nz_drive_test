"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "nz-test-wrong-bank";

export function useWrongBank() {
  const [wrongIds, setWrongIds] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wrongIds));
  }, [wrongIds]);

  /** Merge new wrong IDs into the bank (no duplicates) */
  const addWrong = useCallback((ids: number[]) => {
    setWrongIds((prev) => Array.from(new Set([...prev, ...ids])));
  }, []);

  /** Remove one question (marked as mastered) */
  const removeMastered = useCallback((id: number) => {
    setWrongIds((prev) => prev.filter((x) => x !== id));
  }, []);

  /** Wipe the entire wrong bank */
  const clearAll = useCallback(() => setWrongIds([]), []);

  return { wrongIds, addWrong, removeMastered, clearAll };
}
