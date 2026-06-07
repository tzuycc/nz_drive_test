# NZ Driver Licence Mock Test — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a bilingual (English-on-top / Traditional-Chinese-below) NZ driver licence mock test web app with Practice and Exam modes, deployable to Vercel.

**Architecture:** Next.js (App Router) single-page app. All screen state lives in `app/page.tsx` via React `useState`. Questions are static JSON loaded at build time. Four screen components (Home, Practice, Exam, Result) plus two shared presentational components (QuestionCard, ExplanationPanel). No backend, no database.

**Tech Stack:** Next.js 14+ (App Router), React 18, TypeScript, Tailwind CSS, deployed to Vercel.

---

## File Structure

```
nz_drive_test/
├── app/
│   ├── layout.tsx          # Root layout, font, metadata
│   ├── page.tsx            # Single page — owns screen state machine
│   └── globals.css         # Tailwind directives + base styles
├── components/
│   ├── HomeScreen.tsx      # Title + two mode buttons
│   ├── PracticeScreen.tsx  # One-at-a-time, instant feedback
│   ├── ExamScreen.tsx      # 35 Q, no feedback, progress bar
│   ├── ResultScreen.tsx    # Score + pass/fail + full review
│   ├── QuestionCard.tsx    # Renders Q + 4 options (EN over ZH)
│   └── ExplanationPanel.tsx# Correct/incorrect + explanation (EN over ZH)
├── data/
│   └── questions.json      # ~80 bilingual questions
├── lib/
│   └── types.ts            # Question / Option TypeScript types
│   └── quiz.ts             # shuffle + pickExam helpers (pure functions)
├── __tests__/
│   └── quiz.test.ts        # Tests for pure helpers
├── docs/superpowers/...    # spec + this plan
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

**Decomposition rationale:** Pure logic (shuffle, exam selection, scoring) is isolated in `lib/quiz.ts` so it can be unit-tested without rendering React. Screen components are presentational and receive data + callbacks as props. `page.tsx` is the only stateful orchestrator.

---

## Question Bank Source

Questions are adapted from official NZTA theory test question text (135 questions gathered from nzta.govt.nz: Core C1–C41, Signs S1–S46, Parking P1–P11, Emergency E1–E10, Specialist-Cars 1–27). English question text follows NZTA wording. **Chinese translation is our own (Traditional Chinese, Taiwan usage) — not NZTA-official.** Answer options and correct answers are derived from the NZ Road Code. For v1 we author ~80 questions with full 4-option multiple choice + bilingual explanation.

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.js`, `tailwind.config.ts`, `postcss.config.js`, `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `.gitignore`

- [ ] **Step 1: Scaffold with create-next-app**

Run from `/Users/jessie/Documents/Claude/`:
```bash
npx create-next-app@latest nz_drive_test \
  --typescript --tailwind --app --eslint \
  --src-dir=false --import-alias "@/*" --no-turbopack --use-npm
```
When prompted that the directory is not empty (docs/ already exists), choose to continue/overwrite non-conflicting files. If create-next-app refuses, scaffold in a temp dir and copy files in, preserving `docs/`.

- [ ] **Step 2: Verify dev server boots**

Run: `cd /Users/jessie/Documents/Claude/nz_drive_test && npm run dev`
Expected: server starts on http://localhost:3000 with default Next.js page. Stop it with Ctrl-C.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: build completes with no type errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app for nz_drive_test"
```

---

## Task 2: Define types and the question schema

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write the types**

```typescript
// lib/types.ts

/** One answer choice, shown English-over-Chinese. */
export interface Option {
  en: string;
  zh: string;
}

/** A single multiple-choice question. */
export interface Question {
  id: number;
  category: "core" | "signs" | "parking" | "emergency" | "specialist";
  question_en: string;
  question_zh: string;
  options: Option[];        // exactly 4
  correct: number;          // 0-based index into options
  explanation_en: string;
  explanation_zh: string;
}

/** A question paired with the index the user selected (null = unanswered). */
export interface AnsweredQuestion {
  question: Question;
  selected: number | null;
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add Question and Option types"
```

---

## Task 3: Pure quiz helpers (shuffle, exam selection, scoring) — TDD

**Files:**
- Create: `lib/quiz.ts`
- Test: `__tests__/quiz.test.ts`

- [ ] **Step 1: Install and configure a test runner**

Run:
```bash
npm install -D vitest
```
Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Write the failing tests**

```typescript
// __tests__/quiz.test.ts
import { describe, it, expect } from "vitest";
import { shuffle, pickExam, scoreExam, EXAM_SIZE, PASS_MARK } from "@/lib/quiz";
import type { Question, AnsweredQuestion } from "@/lib/types";

function makeQuestions(n: number): Question[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    category: "core" as const,
    question_en: `Q${i}`,
    question_zh: `題${i}`,
    options: [
      { en: "a", zh: "甲" },
      { en: "b", zh: "乙" },
      { en: "c", zh: "丙" },
      { en: "d", zh: "丁" },
    ],
    correct: 0,
    explanation_en: "e",
    explanation_zh: "解",
  }));
}

describe("shuffle", () => {
  it("returns a new array with the same elements", () => {
    const input = makeQuestions(10);
    const out = shuffle(input);
    expect(out).toHaveLength(10);
    expect(new Set(out.map((q) => q.id))).toEqual(new Set(input.map((q) => q.id)));
    expect(out).not.toBe(input); // does not mutate caller's array
  });
});

describe("pickExam", () => {
  it("returns exactly EXAM_SIZE unique questions", () => {
    const bank = makeQuestions(80);
    const exam = pickExam(bank);
    expect(exam).toHaveLength(EXAM_SIZE);
    expect(new Set(exam.map((q) => q.id)).size).toBe(EXAM_SIZE);
  });

  it("returns all questions when bank is smaller than EXAM_SIZE", () => {
    const bank = makeQuestions(20);
    const exam = pickExam(bank);
    expect(exam).toHaveLength(20);
  });
});

describe("scoreExam", () => {
  it("counts correct answers", () => {
    const answered: AnsweredQuestion[] = makeQuestions(35).map((q, i) => ({
      question: q,
      selected: i < 33 ? 0 : 1, // 33 correct, 2 wrong
    }));
    const result = scoreExam(answered);
    expect(result.correct).toBe(33);
    expect(result.total).toBe(35);
    expect(result.passed).toBe(true); // 33 >= 32
  });

  it("fails below the pass mark", () => {
    const answered: AnsweredQuestion[] = makeQuestions(35).map((q, i) => ({
      question: q,
      selected: i < 31 ? 0 : 1, // 31 correct
    }));
    expect(scoreExam(answered).passed).toBe(false);
  });

  it("treats unanswered (null) as incorrect", () => {
    const answered: AnsweredQuestion[] = makeQuestions(35).map((q) => ({
      question: q,
      selected: null,
    }));
    expect(scoreExam(answered).correct).toBe(0);
  });
});

describe("constants", () => {
  it("matches NZTA exam spec", () => {
    expect(EXAM_SIZE).toBe(35);
    expect(PASS_MARK).toBe(32);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — `@/lib/quiz` not found / functions undefined.

- [ ] **Step 4: Implement the helpers**

```typescript
// lib/quiz.ts
import type { Question, AnsweredQuestion } from "@/lib/types";

export const EXAM_SIZE = 35;
export const PASS_MARK = 32;

/** Fisher–Yates shuffle. Returns a new array; does not mutate input. */
export function shuffle<T>(items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Pick EXAM_SIZE random questions (or all, if the bank is smaller). */
export function pickExam(bank: readonly Question[]): Question[] {
  return shuffle(bank).slice(0, Math.min(EXAM_SIZE, bank.length));
}

export interface ExamResult {
  correct: number;
  total: number;
  passed: boolean;
}

/** Count correct answers; null counts as incorrect. */
export function scoreExam(answered: readonly AnsweredQuestion[]): ExamResult {
  const correct = answered.filter(
    (a) => a.selected === a.question.correct
  ).length;
  return {
    correct,
    total: answered.length,
    passed: correct >= PASS_MARK,
  };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS — all tests green.

- [ ] **Step 6: Commit**

```bash
git add lib/quiz.ts __tests__/quiz.test.ts package.json package-lock.json
git commit -m "feat: add quiz helpers (shuffle, pickExam, scoreExam) with tests"
```

---

## Task 4: Author the question bank JSON

**Files:**
- Create: `data/questions.json`

- [ ] **Step 1: Write ~80 bilingual questions**

Author `data/questions.json` as an array of `Question` objects. Each question MUST have: `id` (unique int), `category`, `question_en`, `question_zh`, exactly 4 `options` (each with `en` + `zh`), `correct` (0–3), `explanation_en`, `explanation_zh`.

Source the English from the gathered NZTA question text (Core C1–C41, Signs S1–S46, Parking P1–P11, Emergency E1–E10, Specialist 1–27). Author plausible 4-option answers and the correct index from the NZ Road Code. Translate question/options/explanation into Traditional Chinese (Taiwan usage: 號誌、車道、行人、優先權).

First two entries, as a concrete format reference:

```json
[
  {
    "id": 1,
    "category": "core",
    "question_en": "Under normal driving conditions, what rule should you use to allow a safe following distance?",
    "question_zh": "在正常行車狀況下，應使用什麼原則來保持安全跟車距離？",
    "options": [
      { "en": "The two-second rule", "zh": "兩秒原則" },
      { "en": "The four-second rule", "zh": "四秒原則" },
      { "en": "The ten-metre rule", "zh": "十公尺原則" },
      { "en": "The one-car-length rule", "zh": "一個車身距離原則" }
    ],
    "correct": 0,
    "explanation_en": "In normal conditions use the two-second rule: pick a fixed point and ensure at least two seconds pass between the vehicle ahead and you reaching it.",
    "explanation_zh": "正常狀況下使用兩秒原則：選一個固定參考點，確認前車通過後至少兩秒你才抵達該點。"
  },
  {
    "id": 2,
    "category": "core",
    "question_en": "What rule should you use to judge a safe following distance in wet or frosty conditions if driving a car?",
    "question_zh": "開車遇到濕滑或結霜路面時，應使用什麼原則判斷安全跟車距離？",
    "options": [
      { "en": "The two-second rule", "zh": "兩秒原則" },
      { "en": "The four-second rule", "zh": "四秒原則" },
      { "en": "The six-second rule", "zh": "六秒原則" },
      { "en": "The same as in dry conditions", "zh": "與乾燥路面相同" }
    ],
    "correct": 1,
    "explanation_en": "In wet or frosty conditions, double the following distance to the four-second rule because stopping distances increase.",
    "explanation_zh": "濕滑或結霜時，因煞停距離增加，應將跟車距離加倍為四秒原則。"
  }
]
```

Continue authoring to ~80 questions across all five categories (roughly: core 30, signs 25, parking 8, emergency 8, specialist 9).

- [ ] **Step 2: Validate the JSON is well-formed and schema-correct**

Run:
```bash
node -e "const q=require('./data/questions.json'); const ids=new Set(); for(const x of q){ if(x.options.length!==4) throw new Error('bad options @'+x.id); if(x.correct<0||x.correct>3) throw new Error('bad correct @'+x.id); if(ids.has(x.id)) throw new Error('dup id '+x.id); ids.add(x.id);} console.log('OK', q.length, 'questions');"
```
Expected: `OK 80 questions` (or however many authored), no thrown errors.

- [ ] **Step 3: Commit**

```bash
git add data/questions.json
git commit -m "feat: add bilingual NZ road code question bank (~80 questions)"
```

---

## Task 5: QuestionCard component (presentational)

**Files:**
- Create: `components/QuestionCard.tsx`

- [ ] **Step 1: Implement QuestionCard**

```tsx
// components/QuestionCard.tsx
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  selected: number | null;
  /** When set, locks choices and colours them (practice/result review). */
  revealCorrect?: boolean;
  onSelect: (index: number) => void;
}

export default function QuestionCard({
  question,
  selected,
  revealCorrect = false,
  onSelect,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <p className="text-lg font-semibold text-gray-900">{question.question_en}</p>
      <p className="mt-1 text-base text-gray-500">{question.question_zh}</p>

      <ul className="mt-5 space-y-3">
        {question.options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === question.correct;

          let style = "border-gray-200 hover:border-blue-400";
          if (revealCorrect && isCorrect) style = "border-green-500 bg-green-50";
          else if (revealCorrect && isSelected && !isCorrect)
            style = "border-red-500 bg-red-50";
          else if (isSelected) style = "border-blue-500 bg-blue-50";

          return (
            <li key={i}>
              <button
                type="button"
                disabled={revealCorrect}
                onClick={() => onSelect(i)}
                className={`w-full rounded-xl border-2 px-4 py-3 text-left transition ${style} disabled:cursor-default`}
              >
                <span className="block font-medium text-gray-900">{opt.en}</span>
                <span className="block text-sm text-gray-500">{opt.zh}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/QuestionCard.tsx
git commit -m "feat: add QuestionCard component (bilingual, EN over ZH)"
```

---

## Task 6: ExplanationPanel component (presentational)

**Files:**
- Create: `components/ExplanationPanel.tsx`

- [ ] **Step 1: Implement ExplanationPanel**

```tsx
// components/ExplanationPanel.tsx
import type { Question } from "@/lib/types";

interface Props {
  question: Question;
  selected: number | null;
}

export default function ExplanationPanel({ question, selected }: Props) {
  const isCorrect = selected === question.correct;

  return (
    <div
      className={`mt-4 rounded-xl border-l-4 p-4 ${
        isCorrect ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
      }`}
    >
      <p className={`font-semibold ${isCorrect ? "text-green-700" : "text-red-700"}`}>
        {isCorrect ? "✅ Correct 答對了" : "❌ Incorrect 答錯了"}
      </p>
      <p className="mt-2 text-gray-900">{question.explanation_en}</p>
      <p className="mt-1 text-sm text-gray-600">{question.explanation_zh}</p>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ExplanationPanel.tsx
git commit -m "feat: add ExplanationPanel component (bilingual feedback)"
```

---

## Task 7: HomeScreen component

**Files:**
- Create: `components/HomeScreen.tsx`

- [ ] **Step 1: Implement HomeScreen**

```tsx
// components/HomeScreen.tsx
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
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/HomeScreen.tsx
git commit -m "feat: add HomeScreen with mode selection"
```

---

## Task 8: PracticeScreen component

**Files:**
- Create: `components/PracticeScreen.tsx`

- [ ] **Step 1: Implement PracticeScreen**

```tsx
// components/PracticeScreen.tsx
"use client";

import { useMemo, useState } from "react";
import type { Question } from "@/lib/types";
import { shuffle } from "@/lib/quiz";
import QuestionCard from "@/components/QuestionCard";
import ExplanationPanel from "@/components/ExplanationPanel";

interface Props {
  bank: Question[];
  onExit: () => void;
}

export default function PracticeScreen({ bank, onExit }: Props) {
  const questions = useMemo(() => shuffle(bank), [bank]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const current = questions[index];
  const answered = selected !== null;
  const isLast = index === questions.length - 1;

  function next() {
    setSelected(null);
    setIndex((i) => Math.min(i + 1, questions.length - 1));
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>
          Question {index + 1} / {questions.length}　第 {index + 1} 題 / 共{" "}
          {questions.length} 題
        </span>
        <button type="button" onClick={onExit} className="text-blue-600 hover:underline">
          End Practice 結束練習
        </button>
      </div>

      <QuestionCard
        question={current}
        selected={selected}
        revealCorrect={answered}
        onSelect={(i) => !answered && setSelected(i)}
      />

      {answered && <ExplanationPanel question={current} selected={selected} />}

      {answered && !isLast && (
        <button
          type="button"
          onClick={next}
          className="mt-6 w-full rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Next Question 下一題
        </button>
      )}

      {answered && isLast && (
        <button
          type="button"
          onClick={onExit}
          className="mt-6 w-full rounded-xl bg-gray-700 px-6 py-3 font-semibold text-white hover:bg-gray-800"
        >
          Finish 完成練習
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/PracticeScreen.tsx
git commit -m "feat: add PracticeScreen with instant feedback"
```

---

## Task 9: ExamScreen component

**Files:**
- Create: `components/ExamScreen.tsx`

- [ ] **Step 1: Implement ExamScreen**

```tsx
// components/ExamScreen.tsx
"use client";

import { useMemo, useState } from "react";
import type { Question, AnsweredQuestion } from "@/lib/types";
import { pickExam } from "@/lib/quiz";
import QuestionCard from "@/components/QuestionCard";

interface Props {
  bank: Question[];
  onSubmit: (answers: AnsweredQuestion[]) => void;
  onExit: () => void;
}

export default function ExamScreen({ bank, onSubmit, onExit }: Props) {
  const questions = useMemo(() => pickExam(bank), [bank]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(questions.length).fill(null)
  );

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const selected = answers[index];

  function choose(i: number) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[index] = i;
      return copy;
    });
  }

  function submit() {
    const result: AnsweredQuestion[] = questions.map((q, i) => ({
      question: q,
      selected: answers[i],
    }));
    onSubmit(result);
  }

  const progress = ((index + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
        <span>
          {index + 1} / {questions.length}
        </span>
        <button type="button" onClick={onExit} className="text-blue-600 hover:underline">
          Quit 離開
        </button>
      </div>
      <div className="mb-4 h-2 w-full rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <QuestionCard question={current} selected={selected} onSelect={choose} />

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700 disabled:opacity-40"
        >
          Previous 上一題
        </button>
        {!isLast ? (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Next 下一題
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Submit 交卷
          </button>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ExamScreen.tsx
git commit -m "feat: add ExamScreen (35 Q, no feedback, progress bar)"
```

---

## Task 10: ResultScreen component

**Files:**
- Create: `components/ResultScreen.tsx`

- [ ] **Step 1: Implement ResultScreen**

```tsx
// components/ResultScreen.tsx
import type { AnsweredQuestion } from "@/lib/types";
import { scoreExam } from "@/lib/quiz";
import QuestionCard from "@/components/QuestionCard";
import ExplanationPanel from "@/components/ExplanationPanel";

interface Props {
  answers: AnsweredQuestion[];
  onRetry: () => void;
  onHome: () => void;
}

export default function ResultScreen({ answers, onRetry, onHome }: Props) {
  const { correct, total, passed } = scoreExam(answers);

  return (
    <div className="mx-auto max-w-xl">
      <div
        className={`rounded-2xl p-8 text-center text-white ${
          passed ? "bg-emerald-600" : "bg-red-600"
        }`}
      >
        <p className="text-lg">{passed ? "PASS 通過" : "FAIL 未通過"}</p>
        <p className="mt-2 text-5xl font-bold">
          {correct} / {total}
        </p>
        <p className="mt-2 text-sm opacity-90">
          Pass mark 及格標準: 32 / 35
        </p>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Try Again 再考一次
        </button>
        <button
          type="button"
          onClick={onHome}
          className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-semibold text-gray-700"
        >
          Home 回首頁
        </button>
      </div>

      <h2 className="mt-8 mb-4 text-xl font-bold text-gray-900">
        Review 題目回顧
      </h2>
      <div className="space-y-6">
        {answers.map((a, i) => (
          <div key={a.question.id}>
            <p className="mb-2 text-sm font-semibold text-gray-500">
              Q{i + 1}
            </p>
            <QuestionCard
              question={a.question}
              selected={a.selected}
              revealCorrect
              onSelect={() => {}}
            />
            <ExplanationPanel question={a.question} selected={a.selected} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/ResultScreen.tsx
git commit -m "feat: add ResultScreen with score and full review"
```

---

## Task 11: Wire up page.tsx state machine

**Files:**
- Modify: `app/page.tsx` (replace scaffold content)

- [ ] **Step 1: Implement the orchestrator**

```tsx
// app/page.tsx
"use client";

import { useState } from "react";
import type { AnsweredQuestion, Question } from "@/lib/types";
import rawQuestions from "@/data/questions.json";
import HomeScreen from "@/components/HomeScreen";
import PracticeScreen from "@/components/PracticeScreen";
import ExamScreen from "@/components/ExamScreen";
import ResultScreen from "@/components/ResultScreen";

const BANK = rawQuestions as Question[];

type Screen = "home" | "practice" | "exam" | "result";

export default function Page() {
  const [screen, setScreen] = useState<Screen>("home");
  const [examAnswers, setExamAnswers] = useState<AnsweredQuestion[]>([]);

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      {screen === "home" && (
        <HomeScreen
          onStartPractice={() => setScreen("practice")}
          onStartExam={() => setScreen("exam")}
        />
      )}

      {screen === "practice" && (
        <PracticeScreen bank={BANK} onExit={() => setScreen("home")} />
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
        />
      )}
    </main>
  );
}
```

- [ ] **Step 2: Set the page metadata in layout**

In `app/layout.tsx`, set:
```tsx
export const metadata = {
  title: "NZ Driver Licence Mock Test 紐西蘭駕照筆試",
  description: "Bilingual NZ road code mock test with practice and exam modes.",
};
```

- [ ] **Step 3: Run dev server and smoke-test all flows**

Run: `npm run dev`, open http://localhost:3000
Verify manually:
- Home shows both buttons.
- Practice: selecting an option reveals correct/incorrect + explanation; Next advances.
- Exam: 35 questions, no feedback, progress bar moves, Previous/Next/Submit work.
- Result: score, pass/fail colour, full review list with explanations.
- Try Again restarts a fresh exam; Home returns to start.

- [ ] **Step 4: Verify build and types**

Run: `npm run build && npx tsc --noEmit`
Expected: build succeeds, no type errors.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/layout.tsx
git commit -m "feat: wire up screen state machine in page.tsx"
```

---

## Task 12: README and Vercel deployment

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README**

```markdown
# NZ Driver Licence Mock Test 紐西蘭汽車駕照筆試

Bilingual (English / Traditional Chinese) mock test for the NZ NZTA driver
licence theory test. Practice mode gives instant feedback; exam mode mirrors
the real 35-question / 32-to-pass format.

## Develop
\`\`\`bash
npm install
npm run dev      # http://localhost:3000
npm test         # run unit tests
npm run build    # production build
\`\`\`

## Deploy to Vercel
1. Push this repo to GitHub.
2. Import the repo at https://vercel.com/new.
3. Framework preset: Next.js (auto-detected). No env vars needed.
4. Deploy.

## Disclaimer
English question text is adapted from NZTA road code material. Chinese
translations are unofficial. Always confirm against the official NZTA test.
```

- [ ] **Step 2: Final full verification**

Run: `npm run build && npm test`
Expected: build succeeds, all tests pass.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: add README with dev and Vercel deploy instructions"
```

- [ ] **Step 4: Deploy (user-driven)**

Deployment to Vercel is performed by the user (push to GitHub → import on Vercel), or via the Vercel MCP tool if the user requests automated deploy. Not a code step.

---

## Self-Review Notes

**Spec coverage check:**
- Bilingual EN-over-ZH (questions/options/explanations) → Tasks 5, 6, 4 ✅
- Practice mode with instant feedback → Task 8 ✅
- Exam mode, 35 Q, no feedback → Task 9 ✅
- Result: score + pass/fail (≥32) + full review → Task 10 ✅
- Single page `/`, state-driven → Task 11 ✅
- Questions in `data/questions.json` → Task 4 ✅
- Next.js + Vercel → Tasks 1, 12 ✅

**Type consistency:** `Question`, `Option`, `AnsweredQuestion`, `ExamResult`, and `shuffle`/`pickExam`/`scoreExam`/`EXAM_SIZE`/`PASS_MARK` are defined in Tasks 2–3 and used consistently in Tasks 5–11.

**Out of scope (v1):** login, score history/localStorage, chapter filtering, custom question count.
