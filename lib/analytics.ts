/**
 * Custom event tracking for Google Analytics 4.
 * All calls are safe to use — they no-op if gtag is not loaded.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag(...args);
  }
}

// ── Exam events ───────────────────────────────────────────────────────────────

/** Fired when user clicks "Exam Simulation" */
export function trackExamStarted() {
  gtag("event", "exam_started");
}

/** Fired when user submits the exam */
export function trackExamCompleted(score: number, total: number) {
  const passed = score >= 32;
  gtag("event", "exam_completed", {
    score,
    total,
    passed,
    pass_rate: Math.round((score / total) * 100),
  });
  gtag("event", passed ? "exam_passed" : "exam_failed", { score, total });
}

// ── Practice events ───────────────────────────────────────────────────────────

/** Fired when user starts practice mode (navigates to category select) */
export function trackPracticeStarted(mode: "all" | "favorites" | "wrong") {
  gtag("event", "practice_started", { mode });
}

/**
 * Fired when user selects a specific category (or "all") and enters practice.
 * Use to measure which categories are most popular.
 */
export function trackPracticeCategorySelected(category: string) {
  gtag("event", "practice_category_selected", { category });
}

/**
 * Fired when user exits or finishes a practice session.
 * category: e.g. "core", "signs", "all", "favorites", "wrong"
 */
export function trackPracticeCompleted(
  mode: "all" | "favorites" | "wrong",
  questionsAnswered: number,
  totalQuestions: number,
  category?: string
) {
  const completed = questionsAnswered === totalQuestions;
  gtag("event", "practice_completed", {
    mode,
    category: category ?? mode,
    questions_answered: questionsAnswered,
    total_questions: totalQuestions,
    completed,
    completion_rate: Math.round((questionsAnswered / totalQuestions) * 100),
  });
}

// ── Favorites / wrong bank events ────────────────────────────────────────────

/** Fired when a question is added to favorites */
export function trackQuestionFavorited(questionId: number) {
  gtag("event", "question_favorited", { question_id: questionId });
}

/** Fired when a question is marked as mastered and removed from wrong bank */
export function trackQuestionMastered(questionId: number) {
  gtag("event", "question_mastered", { question_id: questionId });
}

// ── Support events ────────────────────────────────────────────────────────────

/** Fired when user clicks the Buy Me a Coffee button */
export function trackBuyMeCoffeeClicked() {
  gtag("event", "buy_me_coffee_clicked");
}
