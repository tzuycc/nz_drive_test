"use client";

import { useCallback, useEffect, useState } from "react";
import { shuffle } from "@/lib/quiz";

const STORAGE_KEY = "nz-practice-session";

interface ProgressState {
  order: number[]; // Question IDs in shuffled order
  index: number;   // Current position (0-based); = number of questions completed
  rounds: number;  // Number of completed full rounds
}

function createFresh(ids: number[]): ProgressState {
  return { order: shuffle([...ids]), index: 0, rounds: 0 };
}

export function usePracticeProgress(allIds: number[]) {
  const [state, setState] = useState<ProgressState>(() => {
    if (typeof window === "undefined") return createFresh(allIds);
    try {
      const saved: ProgressState = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "null"
      );
      // Restore only if question count matches (guards against bank size changes)
      if (saved?.order?.length === allIds.length) return saved;
    } catch { /* ignore parse errors */ }
    return createFresh(allIds);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  /**
   * Save progress at the given index.
   * If newIndex >= total, the round is complete — triggers reshuffle for the next round.
   */
  const saveIndex = useCallback(
    (newIndex: number) => {
      setState((prev) => {
        if (newIndex >= prev.order.length) {
          return { order: shuffle([...allIds]), index: 0, rounds: prev.rounds + 1 };
        }
        return { ...prev, index: newIndex };
      });
    },
    [allIds]
  );

  const reset = useCallback(() => setState(createFresh(allIds)), [allIds]);

  return {
    orderedIds: state.order,
    currentIndex: state.index,
    completedRounds: state.rounds,
    saveIndex,
    reset,
  };
}
