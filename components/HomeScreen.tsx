interface Props {
  onStartPractice: () => void;
  onStartExam: () => void;
  favoritesCount: number;
  onStartFavorites: () => void;
  wrongCount: number;
  onStartWrongPractice: () => void;
  onClearWrongBank: () => void;
  practiceProgress: { done: number; total: number; rounds: number };
  onBuyMeCoffeeClick: () => void;
}

export default function HomeScreen({
  onStartPractice,
  onStartExam,
  favoritesCount,
  onStartFavorites,
  wrongCount,
  onStartWrongPractice,
  onClearWrongBank,
  practiceProgress,
  onBuyMeCoffeeClick,
}: Props) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-xl flex-col text-center">
      <div className="flex-1">
      <h1 className="text-3xl font-bold text-gray-900">
        NZ Driver Licence Mock Test
      </h1>
      <p className="mt-2 text-gray-600">紐西蘭汽車駕照筆試模擬測驗</p>
      <p className="mt-4 text-sm text-gray-500">
        Practice the NZ road code with bilingual questions and explanations.
        <br />
        以中英對照題目與解析練習紐西蘭道路規則。
      </p>

      <div className="mt-8 space-y-4">
        <div>
          <button
            type="button"
            onClick={onStartPractice}
            className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
          >
            Practice Mode 練習模式
          </button>
          {/* Progress text */}
          <p className="mt-1.5 text-center text-xs text-gray-400">
            已練習 {practiceProgress.done} / {practiceProgress.total} 題
            {practiceProgress.rounds > 0 && `　· 第 ${practiceProgress.rounds + 1} 輪`}
          </p>
        </div>
        <button
          type="button"
          onClick={onStartExam}
          className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-emerald-700"
        >
          Exam Simulation 模擬考（35 題）
        </button>
        <button
          type="button"
          onClick={onStartFavorites}
          disabled={favoritesCount === 0}
          className="w-full rounded-xl bg-amber-400 px-6 py-4 text-lg font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ⭐ Practice Favorites 練習收藏題目
          {favoritesCount > 0 && (
            <span className="ml-2 text-sm opacity-80">({favoritesCount})</span>
          )}
        </button>

        {/* Wrong bank — only visible when there are wrong questions */}
        {wrongCount > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onStartWrongPractice}
              className="flex-1 rounded-xl bg-red-500 px-6 py-4 text-lg font-semibold text-white transition hover:bg-red-600"
            >
              ❌ 錯題練習
              <span className="ml-2 text-sm opacity-80">({wrongCount} 題)</span>
            </button>
            <button
              type="button"
              onClick={onClearWrongBank}
              title="清除所有錯題"
              className="rounded-xl border-2 border-red-300 px-4 py-4 text-sm text-red-500 transition hover:bg-red-50"
            >
              🗑
            </button>
          </div>
        )}
      </div>

      </div>{/* end flex-1 */}

      {/* Disclaimer — pinned to bottom */}
      <div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-400 leading-relaxed">
        <p>
          本網站題目取自 NZTA 官方題庫，中文翻譯僅供參考。
          <br />
          正式考試內容及答案以 NZTA 官方為準，祝大家考試順利！
        </p>
        <p className="mt-2">
          如有任何建議或疑問，歡迎來信：
          <a
            href="mailto:tzuycc@gmail.com"
            className="text-blue-400 hover:underline"
          >
            tzuycc@gmail.com
          </a>
        </p>
        <div className="mt-4 flex justify-center">
          <a
            href="https://www.buymeacoffee.com/jessie.tw"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onBuyMeCoffeeClick}
          >
            <img
              src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
              alt="Buy Me A Coffee"
              className="h-10"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
