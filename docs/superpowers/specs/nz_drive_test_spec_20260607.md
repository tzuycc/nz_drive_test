# NZ Driver Licence Mock Test — Design Spec

**Date:** 2026-06-07  
**Project:** nz_drive_test  
**Status:** Approved

---

## Overview

A bilingual (English / Traditional Chinese) mock test web app for preparing the New Zealand NZTA driver licence theory test. Deployed to Vercel, built with Next.js.

---

## Architecture

- **Framework:** Next.js (App Router)
- **Deployment:** Vercel
- **State management:** React `useState` — all screen transitions handled in a single `page.tsx`
- **Question data:** `/data/questions.json` (80–100 questions covering official NZTA topics)
- **Routing:** Single page `/`, no URL changes on screen transitions

### Screen flow

```
Home
  ├─ Practice Mode → PracticeScreen → (back to Home)
  └─ Exam Mode     → ExamScreen     → ResultScreen → (back to Home)
```

---

## Data Structure

Each question in `/data/questions.json`:

```json
{
  "id": 1,
  "question_en": "What does a red traffic light mean?",
  "question_zh": "紅燈代表什麼意思？",
  "options": [
    { "en": "Stop and wait",                    "zh": "停車等候" },
    { "en": "Slow down and proceed",             "zh": "減速通過" },
    { "en": "Stop only if other cars are coming","zh": "有來車才停" },
    { "en": "Give way to pedestrians",           "zh": "讓行人先行" }
  ],
  "correct": 0,
  "explanation_en": "A red light means you must stop completely behind the stop line and wait until the light turns green.",
  "explanation_zh": "紅燈表示必須在停止線後完全停車，等待綠燈亮起才可前行。"
}
```

**Topic coverage:** traffic signs, speed limits, right of way, safe following distance, alcohol/drug rules, special road conditions, roundabouts, pedestrian crossings.

**Sign images:** Questions may include an optional `sign` field — a key referencing a road-sign rendered as inline SVG (via a `SignIcon` component). This lets the bank include image-based sign questions (e.g. "What does this sign mean?") without external image assets or copyright concerns. Signs are standardised NZ road symbols drawn as original SVG. Supported keys (v1): `stop`, `give-way`, `speed-50`, `speed-100`, `derestriction`, `no-entry`, `no-left-turn`, `railway-crossing`, `roundabout`, `crossroads`, `pedestrian-crossing`, `accident`, `road-works`, `one-lane-bridge-give-way`, `one-lane-bridge-priority`.

---

## Screens

### Home
- Title: NZ Driver Licence Mock Test
- Short bilingual description
- Two buttons: Practice Mode / Exam Simulation

### Practice Mode
- All questions shuffled randomly
- One question at a time
- Progress indicator: Question X / Y
- Question card: English first, Chinese below (smaller text)
- Four options: English first, Chinese below
- On answer: immediately show ✅ or ❌ + explanation panel (EN then ZH), always visible after answering
- "Next Question" button to proceed
- "End Practice" button to return to Home at any time

### Exam Simulation
- 35 questions randomly selected from the full question bank
- Progress bar + question number (1/35)
- Same bilingual question card format
- No feedback after answering — just moves to next question
- "Next" button; on final question shows "Submit"

### Result Screen (Exam only)
- Large display: X / 35 correct
- Pass (≥ 32, green) or Fail (< 32, red)
- Full review list: each question with user's answer, correct answer, and explanation (EN + ZH)
- "Try Again" button (re-randomises and restarts exam)
- "Back to Home" button

---

## Bilingual Display Rule

Applies to questions, options, and explanations throughout:
- **Line 1:** English (primary, full size)
- **Line 2:** Chinese Traditional (secondary, slightly smaller / muted colour)

---

## NZ Exam Pass Criteria

| Metric | Value |
|--------|-------|
| Total questions | 35 |
| Pass threshold | 32 correct (91%) |
| Question bank size | 80–100 questions |
| Randomisation | Questions shuffled each session |

---

## File Structure

```
nz_drive_test/
├── app/
│   ├── page.tsx          # Single page, all screen state
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── HomeScreen.tsx
│   ├── PracticeScreen.tsx
│   ├── ExamScreen.tsx
│   ├── ResultScreen.tsx
│   ├── QuestionCard.tsx
│   └── ExplanationPanel.tsx
├── data/
│   └── questions.json
└── docs/
    └── superpowers/specs/
        └── 2026-06-07-nz-drive-test-design.md
```

---

## Out of Scope (v1)

- User login / account system
- Score history / localStorage tracking
- Chapter-based filtering
- Custom question count
