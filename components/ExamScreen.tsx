"use client";

import { useMemo, useState } from "react";
import type { Question, AnsweredQuestion } from "@/lib/types";
import { pickExam } from "@/lib/quiz";
import QuestionCard from "@/components/QuestionCard";

interface Props {
  bank: Question[];
  onSubmit: (answers: AnsweredQuestion[]) => void;
  onExit: () => void;
}

export default function ExamScreen({ bank, onSubmit, onExit }: Props) {
  const questions = useMemo(() => pickExam(bank), [bank]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(questions.length).fill(null)
  );

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const selected = answers[index];

  function choose(i: number) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = i;
      return copy;
    });
  }

  function submit() {
    const result: AnsweredQuestion[] = questions.map((q, i) => ({
      question: q,
      selected: answers[i],
    }));
    onSubmit(result);
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
        <span>
          {index + 1} / {questions.length}
        </span>
        <button type="button" onClick={onExit} className="text-blue-600 hover:underline">
          Quit 離開
        </button>
      </div>
      <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <QuestionCard question={current} selected={selected} onSelect={choose} />

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 disabled:opacity-40"
        >
          Previous 上一題
        </button>
        {!isLast ? (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Next 下一題
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Submit 交卷
          </button>
        )}
      </div>
    </div>
  );
}
