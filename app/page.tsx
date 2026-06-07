"use client";

import { useState } from "react";
import type { AnsweredQuestion, Question } from "@/lib/types";
import rawQuestions from "@/data/questions.json";
import { useFavorites } from "@/lib/favorites";
import HomeScreen from "@/components/HomeScreen";
import PracticeScreen from "@/components/PracticeScreen";
import ExamScreen from "@/components/ExamScreen";
import ResultScreen from "@/components/ResultScreen";

const BANK = rawQuestions as unknown as Question[];

type Screen = "home" | "practice" | "favorites" | "exam" | "result";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [examAnswers, setExamAnswers] = useState<AnsweredQuestion[]>([]);
  const { favorites, isFavorited, toggle } = useFavorites();

  const favoritesBank = BANK.filter((q) => favorites.includes(q.id));

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      {screen === "home" && (
        <HomeScreen
          onStartPractice={() => setScreen("practice")}
          onStartExam={() => setScreen("exam")}
          favoritesCount={favoritesBank.length}
          onStartFavorites={() => setScreen("favorites")}
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

      {screen === "exam" && (
        <ExamScreen
          bank={BANK}
          onSubmit={(answers) => {
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
        />
      )}
    </main>
  );
}
