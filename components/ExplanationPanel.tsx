import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  selected: number | null;
}

export default function ExplanationPanel({ question, selected }: Props) {
  const isCorrect = selected === question.correct;

  return (
    <div
      className={`mt-4 rounded-xl border-l-4 p-4 ${
        isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
      }`}
    >
      <p className={`font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
        {isCorrect ? "✅ Correct 答對了" : "❌ Incorrect 答錯了"}
      </p>
      <p className="mt-2 text-gray-900">{question.explanation_en}</p>
      <p className="mt-1 text-sm text-gray-600">{question.explanation_zh}</p>
    </div>
  );
}
