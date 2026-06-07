"use client";

import { useState } from "react";
import type { AnsweredQuestion, Question } from "@/lib/types";
import rawQuestions from "@/data/questions.json";
import { useFavorites } from "@/lib/favorites";
import { useWrongBank } from "@/lib/wrongBank";
import HomeScreen from "@/components/HomeScreen";
import PracticeScreen from "@/components/PracticeScreen";
import ExamScreen from "@/components/ExamScreen";
import ResultScreen from "@/components/ResultScreen";

const BANK = rawQuestions as unknown as Question[];

type Screen = "home" | "practice" | "favorites" | "exam" | "result" | "wrong-practice";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [examAnswers, setExamAnswers] = useState<AnsweredQuestion[]>([]);

  // SINGLE SOURCE OF TRUTH — do NOT call these hooks in child components
  const { favorites, isFavorited, toggle } = useFavorites();
  const { wrongIds, addWrong, removeMastered, clearAll: clearWrongBank } = useWrongBank();

  const favoritesBank = BANK.filter((q) => favorites.includes(q.id));
  const wrongBank = BANK.filter((q) => wrongIds.includes(q.id));

  // IDs of wrong questions from the most recent exam (for ResultScreen quick-access)
  const examWrongIds = examAnswers
    .filter((a) => a.selected !== a.question.correct)
    .map((a) => a.question.id);
  const examWrongBank = BANK.filter((q) => examWrongIds.includes(q.id));

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      {screen === "home" && (
        <HomeScreen
          onStartPractice={() => setScreen("practice")}
          onStartExam={() => setScreen("exam")}
          favoritesCount={favoritesBank.length}
          onStartFavorites={() => setScreen("favorites")}
          wrongCount={wrongBank.length}
          onStartWrongPractice={() => setScreen("wrong-practice")}
          onClearWrongBank={clearWrongBank}
        />
      )}

      {screen === "practice" && (
        <PracticeScreen
          bank={BANK}
          onExit={() => setScreen("home")}
          isFavorited={isFavorited}
          onToggleFavorite={toggle}
        />
      )}

      {screen === "favorites" && (
        <PracticeScreen
          bank={favoritesBank}
          onExit={() => setScreen("home")}
          isFavorited={isFavorited}
          onToggleFavorite={toggle}
        />
      )}

      {screen === "wrong-practice" && (
        <PracticeScreen
          bank={wrongBank}
          onExit={() => setScreen("home")}
          isFavorited={isFavorited}
          onToggleFavorite={toggle}
          onMastered={removeMastered}
        />
      )}

      {screen === "exam" && (
        <ExamScreen
          bank={BANK}
          onSubmit={(answers) => {
            // Automatically add wrong answers to persistent wrong bank
            const ids = answers
              .filter((a) => a.selected !== a.question.correct)
              .map((a) => a.question.id);
            addWrong(ids);
            setExamAnswers(answers);
            setScreen("result");
          }}
          onExit={() => setScreen("home")}
        />
      )}

      {screen === "result" && (
        <ResultScreen
          answers={examAnswers}
          onRetry={() => setScreen("exam")}
          onHome={() => setScreen("home")}
          isFavorited={isFavorited}
          onToggleFavorite={toggle}
          onPracticeWrong={
            examWrongBank.length > 0
              ? () => setScreen("wrong-practice")
              : undefined
          }
        />
      )}
    </main>
  );
}
