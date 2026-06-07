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

/** Fired when user starts practice mode */
export function trackPracticeStarted(mode: "all" | "favorites" | "wrong") {
  gtag("event", "practice_started", { mode });
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
