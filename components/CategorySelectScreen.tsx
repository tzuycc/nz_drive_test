"use client";

interface CategoryInfo {
  id: string;
  label_en: string;
  label_zh: string;
  total: number;
  practiced: number;
}

interface Props {
  categories: CategoryInfo[];
  totalCount: number;
  practicedCount: number;
  completedRounds: number;
  onSelect: (categoryId: string | "all") => void;
  onBack: () => void;
}

export default function CategorySelectScreen({
  categories,
  totalCount,
  practicedCount,
  completedRounds,
  onSelect,
  onBack,
}: Props) {
  const pct = Math.round((practicedCount / totalCount) * 100);

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back 返回
        </button>
        <h2 className="text-xl font-bold text-gray-900">選擇練習分類</h2>
      </div>

      <div className="space-y-3">
        {/* All questions — progress bar */}
        <button
          type="button"
          onClick={() => onSelect("all")}
          className="w-full rounded-xl bg-blue-600 px-5 py-4 text-left text-white transition hover:bg-blue-700"
        >
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">All Questions 全部題目</p>
            <span className="ml-4 shrink-0 text-2xl font-bold">{pct}%</span>
          </div>
          {/* Progress bar */}
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1.5 flex items-center justify-between text-sm opacity-80">
            <span>已練習 {practicedCount} / {totalCount} 題</span>
            {completedRounds > 0 && (
              <span>已完成 {completedRounds} 次</span>
            )}
          </div>
        </button>

        {/* Category buttons */}
        <div className="grid grid-cols-1 gap-2">
          {categories.map((cat) => {
            const allDone = cat.practiced === cat.total;
            // completed count = past rounds + current round if done
            const doneCount = completedRounds + (allDone ? 1 : 0);
            return (
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
                <span
                  className={`ml-4 shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
                    allDone
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {allDone
                    ? `✓ 已完成第 ${doneCount} 次`
                    : `${cat.practiced}/${cat.total} 題`}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
