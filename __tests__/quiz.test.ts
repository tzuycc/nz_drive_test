import { describe, it, expect } from "vitest";
import { shuffle, pickExam, scoreExam, EXAM_SIZE, PASS_MARK } from "@/lib/quiz";
import type { Question, AnsweredQuestion } from "@/lib/types";

function makeQuestions(n: number): Question[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    category: "core" as const,
    question_en: `Q${i}`,
    question_zh: `題${i}`,
    options: [
      { en: "a", zh: "甲" },
      { en: "b", zh: "乙" },
      { en: "c", zh: "丙" },
      { en: "d", zh: "丁" },
    ],
    correct: 0,
    explanation_en: "e",
    explanation_zh: "解",
  }));
}

describe("shuffle", () => {
  it("returns a new array with the same elements", () => {
    const input = makeQuestions(10);
    const out = shuffle(input);
    expect(out).toHaveLength(10);
    expect(new Set(out.map((q) => q.id))).toEqual(new Set(input.map((q) => q.id)));
    expect(out).not.toBe(input);
  });
});

describe("pickExam", () => {
  it("returns exactly EXAM_SIZE unique questions", () => {
    const bank = makeQuestions(80);
    const exam = pickExam(bank);
    expect(exam).toHaveLength(EXAM_SIZE);
    expect(new Set(exam.map((q) => q.id)).size).toBe(EXAM_SIZE);
  });

  it("returns all questions when bank is smaller than EXAM_SIZE", () => {
    const bank = makeQuestions(20);
    const exam = pickExam(bank);
    expect(exam).toHaveLength(20);
  });
});

describe("scoreExam", () => {
  it("counts correct answers", () => {
    const answered: AnsweredQuestion[] = makeQuestions(35).map((q, i) => ({
      question: q,
      selected: i < 33 ? 0 : 1,
    }));
    const result = scoreExam(answered);
    expect(result.correct).toBe(33);
    expect(result.total).toBe(35);
    expect(result.passed).toBe(true);
  });

  it("fails below the pass mark", () => {
    const answered: AnsweredQuestion[] = makeQuestions(35).map((q, i) => ({
      question: q,
      selected: i < 31 ? 0 : 1,
    }));
    expect(scoreExam(answered).passed).toBe(false);
  });

  it("treats unanswered (null) as incorrect", () => {
    const answered: AnsweredQuestion[] = makeQuestions(35).map((q) => ({
      question: q,
      selected: null,
    }));
    expect(scoreExam(answered).correct).toBe(0);
  });
});

describe("constants", () => {
  it("matches NZTA exam spec", () => {
    expect(EXAM_SIZE).toBe(35);
    expect(PASS_MARK).toBe(32);
  });
});
