"use client";

import { useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import { shuffle } from "@/lib/quiz";
import QuestionCard from "@/components/QuestionCard";
import ExplanationPanel from "@/components/ExplanationPanel";

interface Props {
  bank: Question[];
  onExit: () => void;
}

export default function PracticeScreen({ bank, onExit }: Props) {
  const questions = useMemo(() => shuffle(bank), [bank]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const current = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;

  function next() {
    setSelected(null);
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          Question {index + 1} / {questions.length}　第 {index + 1} 題 / 共{" "}
          {questions.length} 題
        </span>
        <button type="button" onClick={onExit} className="text-blue-600 hover:underline">
          End Practice 結束練習
        </button>
      </div>

      <QuestionCard
        question={current}
        selected={selected}
        revealCorrect={answered}
        onSelect={(i) => !answered && setSelected(i)}
      />

      {answered && <ExplanationPanel question={current} selected={selected} />}

      {answered && !isLast && (
        <button
          type="button"
          onClick={next}
          className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Next Question 下一題
        </button>
      )}

      {answered && isLast && (
        <button
          type="button"
          onClick={onExit}
          className="mt-6 w-full rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Finish 完成練習
        </button>
      )}
    </div>
  );
}
