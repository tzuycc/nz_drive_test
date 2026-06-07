interface Props {
  onStartPractice: () => void;
  onStartExam: () => void;
  favoritesCount: number;
  onStartFavorites: () => void;
}

export default function HomeScreen({
  onStartPractice,
  onStartExam,
  favoritesCount,
  onStartFavorites,
}: Props) {
  return (
    <div className="mx-auto max-w-xl text-center">
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
        <button
          type="button"
          onClick={onStartPractice}
          className="w-full rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white transition hover:bg-blue-700"
        >
          Practice Mode 練習模式
        </button>
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
      </div>
    </div>
  );
}
