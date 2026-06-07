// lib/types.ts

/** One answer choice, shown English-over-Chinese. */
export interface Option {
  en: string;
  zh: string;
}

/** A single multiple-choice question. */
export interface Question {
  id: number;
  category: "core" | "signs" | "parking" | "emergency" | "specialist";
  question_en: string;
  question_zh: string;
  options: Option[];        // exactly 4
  correct: number;          // 0-based index into options
  explanation_en: string;
  explanation_zh: string;
}

/** A question paired with the index the user selected (null = unanswered). */
export interface AnsweredQuestion {
  question: Question;
  selected: number | null;
}
