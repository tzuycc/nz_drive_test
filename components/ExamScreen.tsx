"use client";

import { useState } from "react";
import type { Question, AnsweredQuestion } from "@/lib/types";
import { pickExam } from "@/lib/quiz";
import QuestionCard from "@/components/QuestionCard";

interface Props {
  bank: Question[];
  onSubmit: (answers: AnsweredQuestion[]) => void;
  onExit: () => void;
}

type Phase = "intro" | "exam";

export default function ExamScreen({ bank, onSubmit, onExit }: Props) {
  const [phase, setPhase] = useState<Phase>("intro");
  // Stable on mount — useMemo was unstable in React 19 across re-renders
  const [questions] = useState<Question[]>(() => pickExam(bank));
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(questions.length).fill(null)
  );

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const selected = answers[index];
  const progress = ((index + 1) / questions.length) * 100;

  function choose(i: number) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = i;
      return copy;
    });
  }

  function next() {
    setIndex((i) => i + 1);
  }

  function submit() {
    const result: AnsweredQuestion[] = questions.map((q, i) => ({
      question: q,
      selected: answers[i],
    }));
    onSubmit(result);
  }

  // ── Intro screen ──────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-xl">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          模擬考試 Exam Simulation
        </h2>
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-md">
          <p className="font-semibold text-gray-700">考試說明</p>
          <ul className="mt-3 space-y-3 text-sm text-gray-600">
            <li className="flex gap-2">
              <span>📝</span>
              <span>共 <strong>35 題</strong>，答對 <strong>32 題以上</strong>才算通過</span>
            </li>
            <li className="flex gap-2">
              <span>✏️</span>
              <span>點選答案後仍可更改，按「下一題」後<strong>答案即鎖定</strong>，無法修改</span>
            </li>
            <li className="flex gap-2">
              <span>🚫</span>
              <span>進入下一題後<strong>無法回到上一題</strong></span>
            </li>
            <li className="flex gap-2">
              <span>✅</span>
              <span>作答完最後一題後，按「交卷」查看成績</span>
            </li>
          </ul>
          <p className="mt-5 text-center text-sm font-medium text-gray-500">
            本模式模仿真實 NZTA 筆試環境，請謹慎作答。
          </p>
        </div>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onExit}
            className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
          >
            離開
          </button>
          <button
            type="button"
            onClick={() => setPhase("exam")}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            開始考試
          </button>
        </div>
      </div>
    );
  }

  // ── Exam screen ───────────────────────────────────────────────────────────
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

      <div className="mt-6">
        {!isLast ? (
          <button
            type="button"
            disabled={selected === null}
            onClick={next}
            className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next 下一題
          </button>
        ) : (
          <button
            type="button"
            disabled={selected === null}
            onClick={submit}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Submit 交卷
          </button>
        )}
        {selected === null && (
          <p className="mt-2 text-center text-xs text-gray-400">請先選擇答案才能繼續</p>
        )}
      </div>
    </div>
  );
}
