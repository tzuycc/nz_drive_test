"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { shuffle } from "@/lib/quiz";

const STORAGE_KEY = "nz-practice-session";

interface ProgressState {
  order: number[];     // Fixed shuffled order for the current round
  practiced: number[]; // IDs practiced this round (any mode counts)
  rounds: number;      // Completed full rounds
}

function createFresh(ids: number[]): ProgressState {
  return { order: shuffle([...ids]), practiced: [], rounds: 0 };
}

export function usePracticeProgress(allIds: number[]) {
  const [state, setState] = useState<ProgressState>(() => {
    if (typeof window === "undefined") return createFresh(allIds);
    try {
      const saved: ProgressState = JSON.parse(
        localStorage.getItem(STORAGE_KEY) ?? "null"
      );
      // Validate new format (must have practiced array, not old index-based format)
      if (
        saved?.order?.length === allIds.length &&
        Array.isArray(saved?.practiced)
      ) return saved;
    } catch { /* ignore */ }
    return createFresh(allIds);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const practicedSet = useMemo(() => new Set(state.practiced), [state.practiced]);

  /**
   * Mark a question as practiced (any mode).
   * When all questions are marked, automatically starts a new round.
   */
  const markPracticed = useCallback(
    (id: number) => {
      setState((prev) => {
        if (prev.practiced.includes(id)) return prev; // already counted
        const next = [...prev.practiced, id];
        if (next.length >= allIds.length) {
          // Full round complete — reshuffle for the next round
          return { order: shuffle([...allIds]), practiced: [], rounds: prev.rounds + 1 };
        }
        return { ...prev, practiced: next };
      });
    },
    [allIds]
  );

  const reset = useCallback(() => setState(createFresh(allIds)), [allIds]);

  return {
    orderedIds: state.order,      // Shuffled order for "All Questions" mode
    practicedIds: practicedSet,   // Set of IDs practiced this round
    practicedCount: state.practiced.length,
    completedRounds: state.rounds,
    markPracticed,
    reset,
  };
}
