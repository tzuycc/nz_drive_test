"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import { shuffle } from "@/lib/quiz";
import { trackPracticeCompleted, trackQuestionMastered } from "@/lib/analytics";
import QuestionCard from "@/components/QuestionCard";
import ExplanationPanel from "@/components/ExplanationPanel";

interface Props {
  bank: Question[];
  onExit: () => void;
  isFavorited: (id: number) => boolean;
  onToggleFavorite: (id: number) => void;
  /** Which practice mode — used for analytics */
  mode?: "all" | "favorites" | "wrong";
  /** If provided, show "✓ 學會了" button when answered correctly (wrong-bank mode) */
  onMastered?: (id: number) => void;
}

export default function PracticeScreen({ bank, onExit, isFavorited, onToggleFavorite, mode = "all", onMastered }: Props) {
  // Shuffle once on mount using lazy initializer — stable across re-renders
  const [questions] = useState<Question[]>(() => shuffle(bank));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const current = questions[index];

  // Safety guard: should not happen with a non-empty bank
  if (!current) {
    return (
      <div className="mx-auto max-w-xl text-center text-gray-500">
        <p>No questions available. 沒有可用的題目。</p>
        <button type="button" onClick={onExit} className="mt-4 text-blue-600 hover:underline">
          Back 返回
        </button>
      </div>
    );
  }

  const answered = selected !== null;
  const isLast = index === questions.length - 1;
  // Questions answered so far: index + 1 if current is answered, else index
  const questionsAnswered = answered ? index + 1 : index;

  function exit() {
    trackPracticeCompleted(mode, questionsAnswered, questions.length);
    onExit();
  }

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
        <button type="button" onClick={exit} className="text-blue-600 hover:underline">
          End Practice 結束練習
        </button>
      </div>

      {/* key={current.id} resets QuestionCard internal state (showChinese) on question change */}
      <QuestionCard
        key={current.id}
        question={current}
        selected={selected}
        revealCorrect={answered}
        onSelect={(i) => !answered && setSelected(i)}
        isFavorited={isFavorited(current.id)}
        onToggleFavorite={onToggleFavorite}
      />

      {answered && <ExplanationPanel question={current} selected={selected} />}

      {answered && (
        <div className="mt-6 flex flex-col gap-3">
          {/* Wrong-bank mode: show "✓ 學會了" when answered correctly */}
          {onMastered && selected === current.correct && (
            <button
              type="button"
              onClick={() => {
                trackQuestionMastered(current.id);
                onMastered(current.id);
                if (isLast) exit();
                else next();
              }}
              className="w-full rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
            >
              ✓ 學會了，從錯題庫移除
            </button>
          )}

          {/* Next / Finish */}
          {!isLast ? (
            <button
              type="button"
              onClick={next}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              {onMastered && selected === current.correct ? "繼續練習（保留在錯題庫）" : "Next Question 下一題"}
            </button>
          ) : (
            <button
              type="button"
              onClick={exit}
              className="w-full rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              Finish 完成練習
            </button>
          )}
        </div>
      )}
    </div>
  );
}
