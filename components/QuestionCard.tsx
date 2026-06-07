"use client";

import { useState } from "react";
import type { Question } from "@/lib/types";
import SignIcon from "@/components/SignIcon";

interface Props {
  question: Question;
  selected: number | null;
  revealCorrect?: boolean;
  onSelect: (index: number) => void;
  /** If provided, show a ⭐ favorite toggle button */
  isFavorited?: boolean;
  onToggleFavorite?: (id: number) => void;
}

export default function QuestionCard({
  question,
  selected,
  revealCorrect = false,
  onSelect,
  isFavorited = false,
  onToggleFavorite,
}: Props) {
  const [showChinese, setShowChinese] = useState(false);

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      {question.sign && (
        <div className="mb-4">
          <SignIcon sign={question.sign} />
        </div>
      )}

      {/* Question header: text + action buttons */}
      <div className="flex items-start justify-between gap-3">
        <p className="text-lg font-semibold text-gray-900">{question.question_en}</p>
        <div className="flex shrink-0 items-center gap-2">
          {/* Chinese toggle */}
          <button
            type="button"
            onClick={() => setShowChinese((v) => !v)}
            className="w-[4rem] shrink-0 rounded-lg border border-gray-200 py-1 text-center text-xs text-gray-500 transition hover:border-blue-300 hover:text-blue-600"
          >
            🌐 {showChinese ? "收起" : "中文"}
          </button>
          {/* Favorite toggle — only if prop provided */}
          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(question.id)}
              className="w-[4.5rem] shrink-0 rounded-lg border border-gray-200 py-1 text-center text-xs leading-none transition hover:border-yellow-400 hover:bg-yellow-50"
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorited ? "⭐ 已收藏" : "☆ 收藏"}
            </button>
          )}
        </div>
      </div>

      {showChinese && (
        <p className="mt-1 text-base text-gray-500">{question.question_zh}</p>
      )}

      <ul className="mt-5 space-y-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correct;

          let style = "border-gray-200 hover:border-blue-400";
          if (revealCorrect && isCorrect) style = "border-green-500 bg-green-50";
          else if (revealCorrect && isSelected && !isCorrect)
            style = "border-red-500 bg-red-50";
          else if (isSelected) style = "border-blue-500 bg-blue-50";

          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealCorrect}
                onClick={() => onSelect(i)}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${style} disabled:cursor-default`}
              >
                <span className="block font-medium text-gray-900">{opt.en}</span>
                {showChinese && (
                  <span className="block text-sm text-gray-500">{opt.zh}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
