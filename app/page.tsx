"use client";

import { useState } from "react";
import type { AnsweredQuestion, Question } from "@/lib/types";
import rawQuestions from "@/data/questions.json";
import { useFavorites } from "@/lib/favorites";
import { useWrongBank } from "@/lib/wrongBank";
import {
  trackExamStarted,
  trackExamCompleted,
  trackPracticeStarted,
} from "@/lib/analytics";
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
          onStartPractice={() => { trackPracticeStarted("all"); setScreen("practice"); }}
          onStartExam={() => { trackExamStarted(); setScreen("exam"); }}
          favoritesCount={favoritesBank.length}
          onStartFavorites={() => { trackPracticeStarted("favorites"); setScreen("favorites"); }}
          wrongCount={wrongBank.length}
          onStartWrongPractice={() => { trackPracticeStarted("wrong"); setScreen("wrong-practice"); }}
          onClearWrongBank={clearWrongBank}
        />
      )}

      {screen === "practice" && (
        <PracticeScreen
          bank={BANK}
          mode="all"
          onExit={() => setScreen("home")}
          isFavorited={isFavorited}
          onToggleFavorite={toggle}
        />
      )}

      {screen === "favorites" && (
        <PracticeScreen
          bank={favoritesBank}
          mode="favorites"
          onExit={() => setScreen("home")}
          isFavorited={isFavorited}
          onToggleFavorite={toggle}
        />
      )}

      {screen === "wrong-practice" && (
        <PracticeScreen
          bank={wrongBank}
          mode="wrong"
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
            const ids = answers
              .filter((a) => a.selected !== a.question.correct)
              .map((a) => a.question.id);
            addWrong(ids);
            // Track exam completion with score
            const correct = answers.filter(
              (a) => a.selected === a.question.correct
            ).length;
            trackExamCompleted(correct, answers.length);
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
