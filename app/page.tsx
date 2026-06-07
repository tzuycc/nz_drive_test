"use client";

import { useState } from "react";
import type { AnsweredQuestion, Question } from "@/lib/types";
import rawQuestions from "@/data/questions.json";
import { useFavorites } from "@/lib/favorites";
import { useWrongBank } from "@/lib/wrongBank";
import { usePracticeProgress } from "@/lib/practiceProgress";
import {
  trackExamStarted,
  trackExamCompleted,
  trackPracticeStarted,
} from "@/lib/analytics";
import HomeScreen from "@/components/HomeScreen";
import CategorySelectScreen from "@/components/CategorySelectScreen";
import PracticeScreen from "@/components/PracticeScreen";
import ExamScreen from "@/components/ExamScreen";
import ResultScreen from "@/components/ResultScreen";

const BANK = rawQuestions as unknown as Question[];

type Screen = "home" | "category-select" | "practice" | "favorites" | "exam" | "result" | "wrong-practice";

const CATEGORY_META: { id: string; label_en: string; label_zh: string }[] = [
  { id: "core",          label_en: "Core Rules",    label_zh: "核心規則" },
  { id: "signs",         label_en: "Signs & Markings", label_zh: "號誌標線" },
  { id: "parking",       label_en: "Parking",       label_zh: "停車規則" },
  { id: "emergency",     label_en: "Emergency",     label_zh: "緊急狀況" },
  { id: "road_position", label_en: "Road Position", label_zh: "路位知識" },
  { id: "behaviour",     label_en: "Behaviour",     label_zh: "駕駛行為" },
  { id: "intersection",  label_en: "Intersection",  label_zh: "路口規則" },
  { id: "specialist",    label_en: "Specialist",    label_zh: "汽車專項" },
];

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [examAnswers, setExamAnswers] = useState<AnsweredQuestion[]>([]);
  const [practiceCategory, setPracticeCategory] = useState<string | "all">("all");

  // SINGLE SOURCE OF TRUTH — do NOT call these hooks in child components
  const { favorites, isFavorited, toggle } = useFavorites();
  const { wrongIds, addWrong, removeMastered, clearAll: clearWrongBank } = useWrongBank();

  // Practice progress: persisted order + current position
  const allBankIds = BANK.map((q) => q.id);
  const { orderedIds, currentIndex, completedRounds, saveIndex } = usePracticeProgress(allBankIds);
  const orderedBank = orderedIds.map((id) => BANK.find((q) => q.id === id)!);

  const favoritesBank = BANK.filter((q) => favorites.includes(q.id));

  // Category bank for practice (used when practiceCategory !== "all")
  const categoryBank = practiceCategory === "all"
    ? orderedBank
    : BANK.filter((q) => q.category === practiceCategory);

  // Category metadata with counts
  const categoriesWithCount = CATEGORY_META.map((c) => ({
    ...c,
    count: BANK.filter((q) => q.category === c.id).length,
  }));
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
          onStartPractice={() => setScreen("category-select")}
          practiceProgress={{ done: currentIndex, total: BANK.length, rounds: completedRounds }}
          onStartExam={() => { trackExamStarted(); setScreen("exam"); }}

          favoritesCount={favoritesBank.length}
          onStartFavorites={() => { trackPracticeStarted("favorites"); setScreen("favorites"); }}
          wrongCount={wrongBank.length}
          onStartWrongPractice={() => { trackPracticeStarted("wrong"); setScreen("wrong-practice"); }}
          onClearWrongBank={clearWrongBank}
        />
      )}

      {screen === "category-select" && (
        <CategorySelectScreen
          categories={categoriesWithCount}
          totalCount={BANK.length}
          practiceProgress={{ done: currentIndex, total: BANK.length, rounds: completedRounds }}
          onSelect={(cat) => {
            setPracticeCategory(cat);
            trackPracticeStarted(cat === "all" ? "all" : "all"); // log as practice
            setScreen("practice");
          }}
          onBack={() => setScreen("home")}
        />
      )}

      {screen === "practice" && (
        <PracticeScreen
          bank={categoryBank}
          mode="all"
          noShuffle={practiceCategory === "all"}
          startIndex={practiceCategory === "all" ? currentIndex : 0}
          onIndexChange={practiceCategory === "all" ? saveIndex : undefined}
          onExit={() => setScreen("category-select")}
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
