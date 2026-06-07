"use client";

interface CategoryInfo {
  id: string;
  label_en: string;
  label_zh: string;
  count: number;
}

interface Props {
  categories: CategoryInfo[];
  totalCount: number;
  practiceProgress: { done: number; total: number; rounds: number };
  onSelect: (categoryId: string | "all") => void;
  onBack: () => void;
}

export default function CategorySelectScreen({
  categories,
  totalCount,
  practiceProgress,
  onSelect,
  onBack,
}: Props) {
  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back 返回
        </button>
        <h2 className="text-xl font-bold text-gray-900">選擇練習分類</h2>
      </div>

      <div className="space-y-3">
        {/* All questions */}
        <button
          type="button"
          onClick={() => onSelect("all")}
          className="w-full rounded-xl bg-blue-600 px-5 py-4 text-left text-white transition hover:bg-blue-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-lg">All Questions 全部題目</p>
              <p className="text-sm opacity-80">共 {totalCount} 題</p>
            </div>
            <span className="text-2xl">📚</span>
          </div>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs opacity-80">
              <span>已練習 {practiceProgress.done} / {practiceProgress.total} 題</span>
              {practiceProgress.rounds > 0 && (
                <span>第 {practiceProgress.rounds + 1} 輪</span>
              )}
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-blue-400">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{
                  width: `${Math.round(
                    (practiceProgress.done / practiceProgress.total) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </button>

        {/* Category buttons */}
        <div className="grid grid-cols-1 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelect(cat.id)}
              className="flex items-center justify-between rounded-xl border-2 border-gray-200 bg-white px-5 py-3.5 text-left transition hover:border-blue-400 hover:bg-blue-50"
            >
              <div>
                <p className="font-semibold text-gray-900">{cat.label_en}</p>
                <p className="text-sm text-gray-500">{cat.label_zh}</p>
              </div>
              <span className="ml-4 shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                {cat.count} 題
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
