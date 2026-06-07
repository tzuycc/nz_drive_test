// lib/quiz.ts
import type { Question, AnsweredQuestion } from "@/lib/types";

export const EXAM_SIZE = 35;
export const PASS_MARK = 32;

/** Fisher–Yates shuffle. Returns a new array; does not mutate input. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Pick EXAM_SIZE random questions (or all, if the bank is smaller). */
export function pickExam(bank: readonly Question[]): Question[] {
  return shuffle(bank).slice(0, Math.min(EXAM_SIZE, bank.length));
}

export interface ExamResult {
  correct: number;
  total: number;
  passed: boolean;
}

/** Count correct answers; null counts as incorrect. */
export function scoreExam(answered: readonly AnsweredQuestion[]): ExamResult {
  const correct = answered.filter(
    (a) => a.selected === a.question.correct
  ).length;
  return {
    correct,
    total: answered.length,
    passed: correct >= PASS_MARK,
  };
}
