import type { AnsweredQuestion } from "@/lib/types";
import { scoreExam } from "@/lib/quiz";
import QuestionCard from "@/components/QuestionCard";
import ExplanationPanel from "@/components/ExplanationPanel";

interface Props {
  answers: AnsweredQuestion[];
  onRetry: () => void;
  onHome: () => void;
}

export default function ResultScreen({ answers, onRetry, onHome }: Props) {
  const { correct, total, passed } = scoreExam(answers);

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

      <h2 className="mt-8 mb-4 text-xl font-bold text-gray-900">Review 題目回顧</h2>
      <div className="space-y-6">
        {answers.map((a, i) => (
          <div key={a.question.id}>
            <p className="mb-2 text-sm font-semibold text-gray-500">Q{i + 1}</p>
            <QuestionCard
              question={a.question}
              selected={a.selected}
              revealCorrect
              onSelect={() => {}}
            />
            <ExplanationPanel question={a.question} selected={a.selected} />
          </div>
        ))}
      </div>
    </div>
  );
}
