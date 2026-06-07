"use client";

import type { AnsweredQuestion } from "@/lib/types";
import { scoreExam } from "@/lib/quiz";
import QuestionCard from "@/components/QuestionCard";
import ExplanationPanel from "@/components/ExplanationPanel";

interface Props {
  answers: AnsweredQuestion[];
  onRetry: () => void;
  onHome: () => void;
  isFavorited: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
}

export default function ResultScreen({ answers, onRetry, onHome, isFavorited, onToggleFavorite }: Props) {
  const { correct, total, passed } = scoreExam(answers);

  // Split into wrong first, then correct
  const wrong = answers.filter((a) => a.selected !== a.question.correct);
  const right = answers.filter((a) => a.selected === a.question.correct);

  const renderQuestion = (a: AnsweredQuestion, i: number, label: string) => (
    <div key={a.question.id}>
      <p className="mb-2 text-sm font-semibold text-gray-500">{label}{i + 1}</p>
      <QuestionCard
        key={a.question.id}
        question={a.question}
        selected={a.selected}
        revealCorrect
        onSelect={() => {}}
        isFavorited={isFavorited(a.question.id)}
        onToggleFavorite={onToggleFavorite}
      />
      <ExplanationPanel question={a.question} selected={a.selected} />
    </div>
  );

  return (
    <div className="mx-auto max-w-xl">
      <div
        className={`rounded-2xl p-8 text-center text-white ${
          passed ? "bg-emerald-600" : "bg-red-600"
        }`}
      >
        <p className="text-lg">{passed ? "PASS 通過" : "FAIL 未通過"}</p>
        <p className="mt-2 text-5xl font-bold">
          {correct} / {total}
        </p>
        <p className="mt-2 text-sm opacity-90">Pass mark 及格標準: 32 / 35</p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Try Again 再考一次
        </button>
        <button
          type="button"
          onClick={onHome}
          className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700"
        >
          Home 回首頁
        </button>
      </div>

      {wrong.length > 0 && (
        <>
          <h2 className="mt-8 mb-4 text-xl font-bold text-red-600">
            ❌ 答錯的題目（{wrong.length} 題）
          </h2>
          <div className="space-y-6">
            {wrong.map((a, i) => renderQuestion(a, i, "✗ Q"))}
          </div>
        </>
      )}

      {right.length > 0 && (
        <>
          <h2 className="mt-8 mb-4 text-xl font-bold text-emerald-600">
            ✅ 答對的題目（{right.length} 題）
          </h2>
          <div className="space-y-6">
            {right.map((a, i) => renderQuestion(a, i, "✓ Q"))}
          </div>
        </>
      )}
    </div>
  );
}
