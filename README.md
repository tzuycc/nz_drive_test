# NZ Driver Licence Mock Test 紐西蘭汽車駕照筆試

Bilingual (English / Traditional Chinese) mock test for the NZ NZTA driver
licence theory test. Practice mode gives instant feedback after each question;
exam mode mirrors the real 35-question / 32-to-pass format. Road signs are
rendered as inline SVG.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # run unit tests (vitest)
npm run build    # production build
```

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo at https://vercel.com/new.
3. Framework preset: Next.js (auto-detected). No environment variables needed.
4. Deploy.

## Question bank

Questions live in `data/questions.json`. Each has English + Traditional Chinese
text for the question, four options, and an explanation, plus an optional `sign`
key for an SVG road-sign image.

## Disclaimer

English question text is adapted from NZTA road code material. Chinese
translations are unofficial. Always confirm against the official NZTA test.
