interface Props {
  onStartPractice: () => void;
  onStartExam: () => void;
}

export default function HomeScreen({ onStartPractice, onStartExam }: Props) {
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
      </div>
    </div>
  );
}
