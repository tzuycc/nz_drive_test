import type { Question } from "@/lib/types";
import SignIcon from "@/components/SignIcon";

interface Props {
  question: Question;
  selected: number | null;
  /** When set, locks choices and colours them (practice/result review). */
  revealCorrect?: boolean;
  onSelect: (index: number) => void;
}

export default function QuestionCard({
  question,
  selected,
  revealCorrect = false,
  onSelect,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      {question.sign && (
        <div className="mb-4">
          <SignIcon sign={question.sign} />
        </div>
      )}
      <p className="text-lg font-semibold text-gray-900">{question.question_en}</p>
      <p className="mt-1 text-base text-gray-500">{question.question_zh}</p>

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
                <span className="block text-sm text-gray-500">{opt.zh}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
