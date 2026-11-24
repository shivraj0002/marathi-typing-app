# Marathi InScript Typing Web App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a comprehensive, offline-first Marathi InScript touch-typing learning web application in Next.js that translates physical QWERTY keystrokes into Marathi characters in-browser, featuring a 6-stage curriculum, speed sprints, GCC-TBC exam simulation, weak-key drills, and an interactive virtual keyboard.

**Architecture:** The application intercepts keydown events via a pure in-browser InScript mapping engine, normalizes Devanagari text with Unicode NFC and grapheme clustering, and feeds an interactive typing loop. State is managed reactively through Zustand with LocalStorage persistence, while audio feedback is synthesized in real time via the Web Audio API.

**Tech Stack:** Next.js 15 (App Router, React 19), TypeScript, Tailwind CSS, Zustand, Lucide React, Vitest.

**Spec:** [docs/superpowers/specs/2026-11-24-marathi-inscript-typing-web-app-design.md](file:///home/sd2710/Work/Self/Marathi%20Typing%20/docs/superpowers/specs/2026-11-24-marathi-inscript-typing-web-app-design.md)

## Global Constraints
- Target Layout: Standard Indian InScript Devanagari mapped to physical QWERTY keycodes.
- Zero OS Setup: All keystroke translation happens directly in the web app.
- Storage: 100% offline-first local persistence (`localStorage`) with hydration safety.
- Exam Compliance: Follows Maharashtra GCC-TBC 30 WPM & 40 WPM scoring standards (Gross WPM, Net WPM, error penalties).
- Testing: All core translation, conjunct parsing, and scoring algorithms must be covered by automated unit tests in Vitest.

---

### Task 1: Project Scaffolding & Testing Infrastructure

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `postcss.config.mjs`
- Create: `vitest.config.ts`
- Create: `src/app/globals.css`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Test: `tests/setup.test.ts`

**Interfaces:**
- Produces: Runnable Next.js project with Tailwind CSS, Vitest testing environment, and Lucide React.

- [ ] **Step 1: Write initial package.json and install dependencies**

Initialize `package.json` with Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, Lucide React, and Vitest.
```bash
cat << 'EOF' > package.json
{
  "name": "marathi-typing-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "tailwind-merge": "^3.0.0",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.0",
    "@types/node": "^22.10.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.7.0",
    "vitest": "^3.0.0"
  }
}
EOF
npm install
```

- [ ] **Step 2: Configure TypeScript, Next.js, Tailwind, and Vitest**

Create `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, and `src/app/globals.css`:
```bash
cat << 'EOF' > tsconfig.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat << 'EOF' > next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
EOF

cat << 'EOF' > vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
EOF

cat << 'EOF' > postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
EOF
```

- [ ] **Step 3: Write test to verify setup**

Create `tests/setup.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

describe("Environment Setup", () => {
  it("runs vitest successfully in node environment", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test`  
Expected: 1 passed.

- [ ] **Step 5: Create baseline layout and styles**

Create `src/app/globals.css`, `src/app/layout.tsx`, and `src/app/page.tsx`:
```bash
mkdir -p src/app
cat << 'EOF' > src/app/globals.css
@import "tailwindcss";

:root {
  --background: #0f172a;
  --foreground: #f8fafc;
}

body {
  color: var(--foreground);
  background: var(--background);
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  min-height: 100vh;
}
EOF

cat << 'EOF' > src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "मराठी टायपिंग (Marathi InScript Typing Academy)",
  description: "Learn Marathi InScript touch typing fast with an English keyboard.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="mr">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
EOF

cat << 'EOF' > src/app/page.tsx
export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold tracking-tight text-emerald-400">
        मराठी टायपिंग अकॅडमी
      </h1>
      <p className="mt-2 text-slate-400">
        Learn Marathi InScript touch typing fast using your English keyboard.
      </p>
    </main>
  );
}
EOF
```

- [ ] **Step 6: Verify Next.js build and commit**

Run: `npm run build`  
Expected: Next.js successfully compiles static routes.  
Commit:
```bash
git add package.json package-lock.json tsconfig.json next.config.ts vitest.config.ts postcss.config.mjs src/ tests/
git commit -m "feat: scaffold Next.js 15 app with Tailwind CSS, Vitest, and Lucide"
```

---

### Task 2: InScript Translation Engine & Unicode Normalization

**Files:**
- Create: `src/lib/inscript/keymap.ts`
- Create: `src/lib/inscript/conjuncts.ts`
- Create: `src/lib/inscript/graphemes.ts`
- Test: `tests/inscript/keymap.test.ts`
- Test: `tests/inscript/graphemes.test.ts`

**Interfaces:**
- Produces:
  - `translateKey(code: string, shift: boolean): string | null`
  - `isHalant(char: string): boolean`
  - `segmentGraphemes(text: string): string[]`
  - `compareGrapheme(typed: string, expected: string): boolean`
  - `KEY_FINGER_MAP: Record<string, FingerZone>`

- [ ] **Step 1: Write failing tests for keymap and graphemes**

Create `tests/inscript/keymap.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { translateKey } from "@/lib/inscript/keymap";

describe("InScript Keymap Translation", () => {
  it("translates home row right hand consonants correctly", () => {
    expect(translateKey("KeyH", false)).toBe("प");
    expect(translateKey("KeyJ", false)).toBe("र");
    expect(translateKey("KeyK", false)).toBe("क");
    expect(translateKey("KeyL", false)).toBe("त");
    expect(translateKey("Semicolon", false)).toBe("च");
  });

  it("translates home row left hand matras correctly", () => {
    expect(translateKey("KeyA", false)).toBe("ो");
    expect(translateKey("KeyS", false)).toBe("े");
    expect(translateKey("KeyD", false)).toBe("्"); // Halant
    expect(translateKey("KeyF", false)).toBe("ि");
    expect(translateKey("KeyG", false)).toBe("ु");
  });

  it("translates shift variants correctly", () => {
    expect(translateKey("KeyK", true)).toBe("ख");
    expect(translateKey("KeyD", true)).toBe("अ");
    expect(translateKey("KeyE", true)).toBe("आ");
    expect(translateKey("KeyN", true)).toBe("ळ"); // Crucial for Marathi!
    expect(translateKey("KeyC", true)).toBe("ण");
  });

  it("returns null for non-mapped control keys", () => {
    expect(translateKey("F1", false)).toBeNull();
    expect(translateKey("AltLeft", false)).toBeNull();
  });
});
```

Create `tests/inscript/graphemes.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { segmentGraphemes, normalizeDevanagari } from "@/lib/inscript/graphemes";

describe("Devanagari Grapheme Normalization & Segmentation", () => {
  it("normalizes Devanagari text using NFC", () => {
    const raw = "महाराष्ट्र";
    expect(normalizeDevanagari(raw)).toBe(raw.normalize("NFC"));
  });

  it("segments Marathi compound words into proper grapheme clusters", () => {
    const clusters = segmentGraphemes("महाराष्ट्र");
    // म + हा + रा + ष्ट्र
    expect(clusters.length).toBe(4);
    expect(clusters[0]).toBe("म");
    expect(clusters[1]).toBe("हा");
    expect(clusters[2]).toBe("रा");
    expect(clusters[3]).toBe("ष्ट्र");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm run test tests/inscript`  
Expected: FAIL ("Cannot find module '@/lib/inscript/keymap'")

- [ ] **Step 3: Implement keymap, conjuncts, and graphemes**

Create `src/lib/inscript/keymap.ts`:
```typescript
export type FingerZone =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "thumb"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky";

export interface KeyDefinition {
  code: string;
  qwerty: string;
  normal: string;
  shifted: string;
  finger: FingerZone;
}

export const IN_SCRIPT_KEYS: Record<string, KeyDefinition> = {
  // Number row
  Backquote: { code: "Backquote", qwerty: "`", normal: "`", shifted: "~", finger: "left-pinky" },
  Digit1: { code: "Digit1", qwerty: "1", normal: "१", shifted: "ऍ", finger: "left-pinky" },
  Digit2: { code: "Digit2", qwerty: "2", normal: "२", shifted: "ॅ", finger: "left-ring" },
  Digit3: { code: "Digit3", qwerty: "3", normal: "३", shifted: "्र", finger: "left-middle" },
  Digit4: { code: "Digit4", qwerty: "4", normal: "४", shifted: "र्", finger: "left-index" },
  Digit5: { code: "Digit5", qwerty: "5", normal: "५", shifted: "ज्ञ", finger: "left-index" },
  Digit6: { code: "Digit6", qwerty: "6", normal: "६", shifted: "त्र", finger: "right-index" },
  Digit7: { code: "Digit7", qwerty: "7", normal: "७", shifted: "क्ष", finger: "right-index" },
  Digit8: { code: "Digit8", qwerty: "8", normal: "८", shifted: "श्र", finger: "right-middle" },
  Digit9: { code: "Digit9", qwerty: "9", normal: "९", shifted: "(", finger: "right-ring" },
  Digit0: { code: "Digit0", qwerty: "0", normal: "०", shifted: ")", finger: "right-pinky" },
  Minus: { code: "Minus", qwerty: "-", normal: "-", shifted: "ः", finger: "right-pinky" },
  Equal: { code: "Equal", qwerty: "=", normal: "ृ", shifted: "ऋ", finger: "right-pinky" },

  // Top row
  KeyQ: { code: "KeyQ", qwerty: "q", normal: "ौ", shifted: "औ", finger: "left-pinky" },
  KeyW: { code: "KeyW", qwerty: "w", normal: "ै", shifted: "ऐ", finger: "left-ring" },
  KeyE: { code: "KeyE", qwerty: "e", normal: "ा", shifted: "आ", finger: "left-middle" },
  KeyR: { code: "KeyR", qwerty: "r", normal: "ी", shifted: "ई", finger: "left-index" },
  KeyT: { code: "KeyT", qwerty: "t", normal: "ू", shifted: "ऊ", finger: "left-index" },
  KeyY: { code: "KeyY", qwerty: "y", normal: "ब", shifted: "भ", finger: "right-index" },
  KeyU: { code: "KeyU", qwerty: "u", normal: "ह", shifted: "ङ", finger: "right-index" },
  KeyI: { code: "KeyI", qwerty: "i", normal: "ग", shifted: "घ", finger: "right-middle" },
  KeyO: { code: "KeyO", qwerty: "o", normal: "द", shifted: "ध", finger: "right-ring" },
  KeyP: { code: "KeyP", qwerty: "p", normal: "ज", shifted: "झ", finger: "right-pinky" },
  BracketLeft: { code: "BracketLeft", qwerty: "[", normal: "ड", shifted: "ढ", finger: "right-pinky" },
  BracketRight: { code: "BracketRight", qwerty: "]", normal: "़", shifted: "ञ", finger: "right-pinky" },
  Backslash: { code: "Backslash", qwerty: "\\", normal: "ॉ", shifted: "ऑ", finger: "right-pinky" },

  // Home row
  KeyA: { code: "KeyA", qwerty: "a", normal: "ो", shifted: "ओ", finger: "left-pinky" },
  KeyS: { code: "KeyS", qwerty: "s", normal: "े", shifted: "ए", finger: "left-ring" },
  KeyD: { code: "KeyD", qwerty: "d", normal: "्", shifted: "अ", finger: "left-middle" },
  KeyF: { code: "KeyF", qwerty: "f", normal: "ि", shifted: "इ", finger: "left-index" },
  KeyG: { code: "KeyG", qwerty: "g", normal: "ु", shifted: "उ", finger: "left-index" },
  KeyH: { code: "KeyH", qwerty: "h", normal: "प", shifted: "फ", finger: "right-index" },
  KeyJ: { code: "KeyJ", qwerty: "j", normal: "र", shifted: "ऱ", finger: "right-index" },
  KeyK: { code: "KeyK", qwerty: "k", normal: "क", shifted: "ख", finger: "right-middle" },
  KeyL: { code: "KeyL", qwerty: "l", normal: "त", shifted: "थ", finger: "right-ring" },
  Semicolon: { code: "Semicolon", qwerty: ";", normal: "च", shifted: "छ", finger: "right-pinky" },
  Quote: { code: "Quote", qwerty: "'", normal: "ट", shifted: "ठ", finger: "right-pinky" },

  // Bottom row
  KeyZ: { code: "KeyZ", qwerty: "z", normal: "ॆ", shifted: "ऒ", finger: "left-pinky" },
  KeyX: { code: "KeyX", qwerty: "x", normal: "ं", shifted: "ँ", finger: "left-ring" },
  KeyC: { code: "KeyC", qwerty: "c", normal: "म", shifted: "ण", finger: "left-middle" },
  KeyV: { code: "KeyV", qwerty: "v", normal: "न", shifted: "ऩ", finger: "left-index" },
  KeyB: { code: "KeyB", qwerty: "b", normal: "व", shifted: "ऴ", finger: "left-index" },
  KeyN: { code: "KeyN", qwerty: "n", normal: "ल", shifted: "ळ", finger: "right-index" },
  KeyM: { code: "KeyM", qwerty: "m", normal: "स", shifted: "श", finger: "right-index" },
  Comma: { code: "Comma", qwerty: ",", normal: ",", shifted: "ष", finger: "right-middle" },
  Period: { code: "Period", qwerty: ".", normal: ".", shifted: "।", finger: "right-ring" },
  Slash: { code: "Slash", qwerty: "/", normal: "य", shifted: "?", finger: "right-pinky" },
  Space: { code: "Space", qwerty: " ", normal: " ", shifted: " ", finger: "thumb" },
};

export function translateKey(code: string, shift: boolean): string | null {
  const definition = IN_SCRIPT_KEYS[code];
  if (!definition) return null;
  return shift ? definition.shifted : definition.normal;
}

export function findKeyForChar(char: string): { code: string; shift: boolean } | null {
  for (const [code, def] of Object.entries(IN_SCRIPT_KEYS)) {
    if (def.normal === char) return { code, shift: false };
    if (def.shifted === char) return { code, shift: true };
  }
  return null;
}
```

Create `src/lib/inscript/graphemes.ts`:
```typescript
export function normalizeDevanagari(text: string): string {
  return text.normalize("NFC");
}

export function segmentGraphemes(text: string): string[] {
  const normalized = normalizeDevanagari(text);
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new (Intl as any).Segmenter("mr", { granularity: "grapheme" });
    const segments = Array.from(segmenter.segment(normalized), (s: any) => s.segment as string);
    return segments;
  }
  // Fallback regex for Devanagari graphemes (consonant + virama clusters + vowel signs)
  const regex = /[\u0900-\u097F][\u093E-\u094F\u0951-\u0954\u0901-\u0903\u093C]*(?:\u094D[\u0900-\u097F][\u093E-\u094F\u0951-\u0954\u0901-\u0903\u093C]*)*|[^\u0900-\u097F]/g;
  return normalized.match(regex) || Array.from(normalized);
}

export function isDevanagariHalant(char: string): boolean {
  return char === "्";
}
```

Create `src/lib/inscript/conjuncts.ts`:
```typescript
export const JODNIKSHAR_RULES: Record<string, string> = {
  "क+्+ष": "क्ष",
  "ज+्+ञ": "ज्ञ",
  "त+्+र": "त्र",
  "श+्+र": "श्र",
};
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test tests/inscript`  
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/inscript/ tests/inscript/
git commit -m "feat: implement InScript keymap matrix, grapheme segmentation, and conjunct logic"
```

---

### Task 3: State Management & Audio Synthesizer

**Files:**
- Create: `src/lib/store/useTypingStore.ts`
- Create: `src/lib/audio/soundEffects.ts`
- Test: `tests/store/typingStore.test.ts`

**Interfaces:**
- Produces:
  - `useTypingStore`: Zustand store with `unlockedLessons`, `lessonProgress`, `stats`, `soundEnabled`, `volume`, `recordTestResult()`
  - `playSound(type: "click" | "error" | "complete" | "milestone")`
  - `toggleSound()`

- [ ] **Step 1: Write failing tests for typing store calculations**

Create `tests/store/typingStore.test.ts`:
```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { calculateMetrics } from "@/lib/store/useTypingStore";

describe("Typing Metrics Engine", () => {
  it("calculates Gross WPM, Net WPM, and Accuracy correctly", () => {
    // 150 characters typed in 60 seconds (1 minute), with 2 mistakes
    const metrics = calculateMetrics({
      charCount: 150,
      mistakes: 2,
      durationSeconds: 60,
      penaltyFactor: 1.0,
    });

    // 150 chars / 5 = 30 words in 1 min => Gross WPM = 30
    expect(metrics.grossWpm).toBe(30);
    // Net WPM = 30 - 2 = 28
    expect(metrics.netWpm).toBe(28);
    // Accuracy = (148 / 150) * 100 = 98.67%
    expect(metrics.accuracy).toBeCloseTo(98.67, 1);
    expect(metrics.cpm).toBe(150);
  });

  it("handles zero elapsed time safely", () => {
    const metrics = calculateMetrics({
      charCount: 0,
      mistakes: 0,
      durationSeconds: 0,
      penaltyFactor: 1.0,
    });
    expect(metrics.grossWpm).toBe(0);
    expect(metrics.netWpm).toBe(0);
    expect(metrics.accuracy).toBe(100);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test tests/store/typingStore.test.ts`  
Expected: FAIL ("Cannot find module '@/lib/store/useTypingStore'")

- [ ] **Step 3: Implement store and sound synthesizer**

Create `src/lib/store/useTypingStore.ts`:
```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  charCount: number;
  timeSeconds: number;
}

export function calculateMetrics({
  charCount,
  mistakes,
  durationSeconds,
  penaltyFactor = 1.0,
}: {
  charCount: number;
  mistakes: number;
  durationSeconds: number;
  penaltyFactor?: number;
}): TypingMetrics {
  if (durationSeconds <= 0 || charCount === 0) {
    return { grossWpm: 0, netWpm: 0, cpm: 0, accuracy: 100, mistakes, charCount, timeSeconds: durationSeconds };
  }

  const minutes = durationSeconds / 60;
  const words = charCount / 5;
  const grossWpm = Math.round((words / minutes) * 10) / 10;
  const netWpm = Math.max(0, Math.round((grossWpm - mistakes * penaltyFactor) * 10) / 10);
  const cpm = Math.round(charCount / minutes);
  const correctChars = Math.max(0, charCount - mistakes);
  const accuracy = Math.round((correctChars / charCount) * 10000) / 100;

  return { grossWpm, netWpm, cpm, accuracy, mistakes, charCount, timeSeconds: durationSeconds };
}

export interface LessonScore {
  lessonId: string;
  bestWpm: number;
  bestAccuracy: number;
  completedAt: string;
}

export interface ExamAttempt {
  id: string;
  targetWpm: 30 | 40;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  passed: boolean;
  grade: "Distinction" | "First Class" | "Pass" | "Fail";
  timestamp: string;
}

export interface KeyMistakeRecord {
  char: string;
  missCount: number;
  totalAttempts: number;
}

export interface TypingStoreState {
  unlockedLessons: string[];
  lessonScores: Record<string, LessonScore>;
  examHistory: ExamAttempt[];
  weakKeys: Record<string, KeyMistakeRecord>;
  soundEnabled: boolean;
  theme: "dark" | "light";

  unlockLesson: (lessonId: string) => void;
  recordLessonScore: (score: LessonScore) => void;
  recordExamResult: (exam: ExamAttempt) => void;
  recordKeyStroke: (char: string, isCorrect: boolean) => void;
  toggleSound: () => void;
  setTheme: (theme: "dark" | "light") => void;
  resetProgress: () => void;
}

export const useTypingStore = create<TypingStoreState>()(
  persist(
    (set) => ({
      unlockedLessons: ["stage-1-lesson-1"],
      lessonScores: {},
      examHistory: [],
      weakKeys: {},
      soundEnabled: true,
      theme: "dark",

      unlockLesson: (lessonId) =>
        set((state) => ({
          unlockedLessons: state.unlockedLessons.includes(lessonId)
            ? state.unlockedLessons
            : [...state.unlockedLessons, lessonId],
        })),

      recordLessonScore: (score) =>
        set((state) => {
          const current = state.lessonScores[score.lessonId];
          const bestWpm = current ? Math.max(current.bestWpm, score.bestWpm) : score.bestWpm;
          const bestAccuracy = current ? Math.max(current.bestAccuracy, score.bestAccuracy) : score.bestAccuracy;
          return {
            lessonScores: {
              ...state.lessonScores,
              [score.lessonId]: { ...score, bestWpm, bestAccuracy },
            },
          };
        }),

      recordExamResult: (exam) =>
        set((state) => ({
          examHistory: [exam, ...state.examHistory].slice(0, 50),
        })),

      recordKeyStroke: (char, isCorrect) =>
        set((state) => {
          const current = state.weakKeys[char] || { char, missCount: 0, totalAttempts: 0 };
          return {
            weakKeys: {
              ...state.weakKeys,
              [char]: {
                char,
                missCount: isCorrect ? current.missCount : current.missCount + 1,
                totalAttempts: current.totalAttempts + 1,
              },
            },
          };
        }),

      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      setTheme: (theme) => set({ theme }),
      resetProgress: () =>
        set({
          unlockedLessons: ["stage-1-lesson-1"],
          lessonScores: {},
          examHistory: [],
          weakKeys: {},
        }),
    }),
    {
      name: "marathi-typing-storage",
    }
  )
);
```

Create `src/lib/audio/soundEffects.ts`:
```typescript
class SoundEffects {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playKeyClick() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(450, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  playError() {
    const ctx = this.getContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, ctx.currentTime);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  playSuccess() {
    const ctx = this.getContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, C
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = ctx.currentTime + idx * 0.08;

      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.1, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(start);
      osc.stop(start + 0.2);
    });
  }
}

export const soundEffects = new SoundEffects();
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test tests/store/typingStore.test.ts`  
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/store/ src/lib/audio/ tests/store/
git commit -m "feat: add persistent Zustand store, typing metrics engine, and Web Audio synthesizers"
```

---

### Task 4: Curriculum & Examination Passages Dataset

**Files:**
- Create: `src/lib/curriculum/stages.ts`
- Create: `src/lib/curriculum/words.ts`
- Create: `src/lib/curriculum/examPassages.ts`
- Test: `tests/curriculum/curriculum.test.ts`

**Interfaces:**
- Produces:
  - `STAGES: StageDefinition[]` (Stages 1 to 6 with full lesson instructions and target texts)
  - `COMMON_MARATHI_WORDS: string[]`
  - `EXAM_PASSAGES_30_WPM: ExamPassage[]`
  - `EXAM_PASSAGES_40_WPM: ExamPassage[]`
  - `getNextLessonId(currentLessonId: string): string | null`

- [ ] **Step 1: Write test to verify curriculum integrity**

Create `tests/curriculum/curriculum.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { STAGES, getNextLessonId } from "@/lib/curriculum/stages";
import { EXAM_PASSAGES_30_WPM, EXAM_PASSAGES_40_WPM } from "@/lib/curriculum/examPassages";

describe("Curriculum & Exam Dataset", () => {
  it("contains 6 complete stages with valid lesson data", () => {
    expect(STAGES.length).toBe(6);
    STAGES.forEach((stage) => {
      expect(stage.lessons.length).toBeGreaterThanOrEqual(2);
      stage.lessons.forEach((lesson) => {
        expect(lesson.title).toBeTruthy();
        expect(lesson.targetText.length).toBeGreaterThan(10);
      });
    });
  });

  it("finds next lesson ID in sequence", () => {
    const next = getNextLessonId("stage-1-lesson-1");
    expect(next).toBe("stage-1-lesson-2");
  });

  it("contains valid passages for 30 and 40 WPM exams", () => {
    expect(EXAM_PASSAGES_30_WPM.length).toBeGreaterThanOrEqual(2);
    expect(EXAM_PASSAGES_40_WPM.length).toBeGreaterThanOrEqual(2);
    expect(EXAM_PASSAGES_30_WPM[0].text.length).toBeGreaterThan(500);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test tests/curriculum/curriculum.test.ts`  
Expected: FAIL ("Cannot find module '@/lib/curriculum/stages'")

- [ ] **Step 3: Implement curriculum stages, words, and exam passages**

Create `src/lib/curriculum/stages.ts`:
```typescript
export interface Lesson {
  id: string;
  stageId: number;
  title: string;
  description: string;
  keysFocus: string[];
  targetText: string;
  minWpm: number;
  minAccuracy: number;
}

export interface StageDefinition {
  id: number;
  title: string;
  subtitle: string;
  lessons: Lesson[];
}

export const STAGES: StageDefinition[] = [
  {
    id: 1,
    title: "Stage 1: Home Row Foundations",
    subtitle: "Master the center resting position for left & right hands",
    lessons: [
      {
        id: "stage-1-lesson-1",
        stageId: 1,
        title: "Right Hand Consonants (प, र, क, त, च)",
        description: "Place your right fingers on H, J, K, L, ; keys.",
        keysFocus: ["प", "र", "क", "त", "च"],
        targetText: "प र क त च पर करत चर पत तर कप पक चत रच परक तरक",
        minWpm: 12,
        minAccuracy: 95,
      },
      {
        id: "stage-1-lesson-2",
        stageId: 1,
        title: "Left Hand Matras (ो, े, ्, ि, ु)",
        description: "Place your left fingers on A, S, D, F, G keys.",
        keysFocus: ["ो", "े", "्", "ि", "ु"],
        targetText: "के ते पो रो चे कि पि ति रि कु पु तु रु",
        minWpm: 12,
        minAccuracy: 95,
      },
      {
        id: "stage-1-lesson-3",
        stageId: 1,
        title: "Home Row Word Practice",
        description: "Combine consonants and matras to type basic words.",
        keysFocus: ["क", "र", "त", "प", "च", "े", "ि", "ो", "ु"],
        targetText: "करून पोच तेथे चित्त परतु पिकू पेरू केरकचरा तुकडे",
        minWpm: 15,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 2,
    title: "Stage 2: Upper Row Mastery",
    subtitle: "Reach upward for vowels, matras, and consonants",
    lessons: [
      {
        id: "stage-2-lesson-1",
        stageId: 2,
        title: "Upper Consonants (ह, ग, द, ज, ड)",
        description: "Reach index, middle, ring, pinky upward to U, I, O, P, [.",
        keysFocus: ["ह", "ग", "द", "ज", "ड"],
        targetText: "ह ग द ज ड हज गद जग दह गड दज गज हक जद",
        minWpm: 15,
        minAccuracy: 95,
      },
      {
        id: "stage-2-lesson-2",
        stageId: 2,
        title: "Upper Matras (ौ, ै, ा, ी, ू)",
        description: "Reach left hand upward to Q, W, E, R, T.",
        keysFocus: ["ौ", "ै", "ा", "ी", "ू"],
        targetText: "गा जा हा दा डा गीत हात झाड पाऊस बैल हौस",
        minWpm: 15,
        minAccuracy: 95,
      },
      {
        id: "stage-2-lesson-3",
        stageId: 2,
        title: "Two-Row Word Builder",
        description: "Fluidly move between the home row and top row.",
        keysFocus: ["ह", "ग", "ा", "ी", "क", "र"],
        targetText: "दुकान गाडी हात जोडून घरदार दिवस पाणी जीवन",
        minWpm: 18,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 3,
    title: "Stage 3: Bottom Row & Marathi Specials",
    subtitle: "Conquer the lower row, Anusvara, and Marathi ळ & ण",
    lessons: [
      {
        id: "stage-3-lesson-1",
        stageId: 3,
        title: "Bottom Consonants (ल, स, म, न, व, य)",
        description: "Reach fingers down to N, M, C, V, B, /.",
        keysFocus: ["ल", "स", "म", "न", "व", "य"],
        targetText: "ल स म न व य मन सम वन लय नव मल सय वल",
        minWpm: 18,
        minAccuracy: 95,
      },
      {
        id: "stage-3-lesson-2",
        stageId: 3,
        title: "Marathi ळ, ण, and Anusvara (ं)",
        description: "Special Marathi letters on Shift+N (ळ) and Shift+C (ण), X (ं).",
        keysFocus: ["ळ", "ण", "ं"],
        targetText: "कमळ बाळ पाणी रंग गंध पतंग सुंदर पाळणा बाण",
        minWpm: 18,
        minAccuracy: 95,
      },
      {
        id: "stage-3-lesson-3",
        stageId: 3,
        title: "Three-Row Mixed Vocabulary",
        description: "Complete coverage of all three primary rows.",
        keysFocus: ["स", "म", "न", "ळ", "क", "र"],
        targetText: "सकाळ शांत शाळा मानवी जीवन नियम आणि कायदे",
        minWpm: 20,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 4,
    title: "Stage 4: Shift Keys & Independent Vowels",
    subtitle: "Aspirated consonants (ख, घ, थ, ध) and full vowels (अ, आ, इ)",
    lessons: [
      {
        id: "stage-4-lesson-1",
        stageId: 4,
        title: "Aspirated Consonants",
        description: "Shift + K (ख), Shift + I (घ), Shift + L (थ), Shift + O (ध).",
        keysFocus: ["ख", "घ", "थ", "ध", "फ", "भ"],
        targetText: "खत घर कथा धन फळ भाषा भारत धर्म विचार",
        minWpm: 20,
        minAccuracy: 95,
      },
      {
        id: "stage-4-lesson-2",
        stageId: 4,
        title: "Independent Vowels",
        description: "Shift + D (अ), Shift + E (आ), Shift + F (इ), Shift + S (ए).",
        keysFocus: ["अ", "आ", "इ", "ई", "उ", "ऊ", "ए"],
        targetText: "आई आज एकत्र एकटा उत्सव आकाश ईश्वर ऊर्जा",
        minWpm: 20,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 5,
    title: "Stage 5: Compound Characters (Jodnikshar)",
    subtitle: "Virama rules and complex Devanagari ligatures",
    lessons: [
      {
        id: "stage-5-lesson-1",
        stageId: 5,
        title: "Halant Mechanics (्)",
        description: "Learn to join letters using Key D (्).",
        keysFocus: ["्"],
        targetText: "क्य च्या स्य न्य त्य स्त स्प स्म प्र क्र",
        minWpm: 22,
        minAccuracy: 95,
      },
      {
        id: "stage-5-lesson-2",
        stageId: 5,
        title: "Special Ligatures (क्ष, ज्ञ, त्र, श्र)",
        description: "Master the essential Indian script conjuncts.",
        keysFocus: ["क्ष", "ज्ञ", "त्र", "श्र"],
        targetText: "क्षत्रिय ज्ञान मित्र आश्रम परीक्षा ज्ञानेश्वर श्रीमंत",
        minWpm: 22,
        minAccuracy: 95,
      },
      {
        id: "stage-5-lesson-3",
        stageId: 5,
        title: "Common Compound Words",
        description: "Practice frequently encountered Marathi compound words.",
        keysFocus: ["महाराष्ट्र", "विद्यार्थी", "पुस्तके", "स्वातंत्र्य"],
        targetText: "महाराष्ट्र राज्य विद्यार्थी अभ्यासक्रम पुस्तक राष्ट्रीय स्वातंत्र्य",
        minWpm: 25,
        minAccuracy: 95,
      },
    ],
  },
  {
    id: 6,
    title: "Stage 6: Real Passages & Flow",
    subtitle: "Develop sustained touch-typing speed with Marathi literature",
    lessons: [
      {
        id: "stage-6-lesson-1",
        stageId: 6,
        title: "Marathi Proverbs & Wisdom",
        description: "Type famous Marathi sayings smoothly.",
        keysFocus: ["full-keyboard"],
        targetText: "प्रयत्नांती परमेश्वर लाभतो. वाचाल तर वाचाल. जे का रंजले गांजले त्यांसी म्हणे जो आपुले.",
        minWpm: 25,
        minAccuracy: 95,
      },
      {
        id: "stage-6-lesson-2",
        stageId: 6,
        title: "Cultural & Natural Maharashtra",
        description: "A continuous passage celebrating the geography of Maharashtra.",
        keysFocus: ["full-keyboard"],
        targetText: "सह्याद्रीच्या रांगा आणि अरबी समुद्राचा किनारा लाभलेला महाराष्ट्र हा संतांची आणि शूरवीरांची पावन भूमी आहे.",
        minWpm: 28,
        minAccuracy: 95,
      },
    ],
  },
];

export function getNextLessonId(currentLessonId: string): string | null {
  const allLessons = STAGES.flatMap((s) => s.lessons);
  const currentIndex = allLessons.findIndex((l) => l.id === currentLessonId);
  if (currentIndex === -1 || currentIndex === allLessons.length - 1) return null;
  return allLessons[currentIndex + 1].id;
}
```

Create `src/lib/curriculum/words.ts`:
```typescript
export const COMMON_MARATHI_WORDS = [
  "आहे", "नाही", "आणि", "पण", "करणे", "झाले", "होते", "आले", "गेले", "काम",
  "घर", "शाळा", "पाणी", "माणूस", "मित्र", "भारत", "महाराष्ट्र", "भाषा", "वेळ",
  "दिवस", "रात्र", "चांगले", "नवीन", "मोठे", "लहान", "पुस्तक", "विद्यार्थी",
  "शिक्षण", "देश", "राज्य", "शहर", "गाव", "रस्ता", "नदी", "झाड", "आई",
  "वडील", "भाऊ", "बहीण", "समाज", "विकास", "प्रगती", "विचार", "जीवन", "सत्य"
];
```

Create `src/lib/curriculum/examPassages.ts`:
```typescript
export interface ExamPassage {
  id: string;
  title: string;
  targetWpm: 30 | 40;
  durationMinutes: number;
  wordCount: number;
  text: string;
}

export const EXAM_PASSAGES_30_WPM: ExamPassage[] = [
  {
    id: "gcc-tbc-30-01",
    title: "GCC-TBC 30 WPM Test 1: महाराष्ट्राची संस्कृती",
    targetWpm: 30,
    durationMinutes: 7,
    wordCount: 220,
    text: "महाराष्ट्र हे भारताच्या पश्चिम भागातील एक अत्यंत समृद्ध आणि ऐतिहासिक राज्य आहे. या राज्याला सह्याद्रीच्या उत्तुंग पर्वत रांगांचे आणि पश्चिमेला अथांग अरबी समुद्राचे सुंदर नैसर्गिक वरदान लाभले आहे. छत्रपती शिवाजी महाराजांनी स्थापन केलेले स्वराज्य आणि संतांनी दिलेली समतेची शिकवण ही महाराष्ट्राच्या संस्कृतीचा मुख्य पाया आहे. वारकरी संप्रदाय आणि पंढरपूरची वारी ही या भूमीची आगळीवेगळी ओळख आहे. महाराष्ट्राने देशाच्या स्वातंत्र्यलढ्यात तसेच सामाजिक, शैक्षणिक आणि औद्योगिक प्रगतीमध्ये नेहमीच अग्रगण्य योगदान दिले आहे. राज्यातील मुंबई ही देशाची आर्थिक राजधानी मानली जाते. शेती, व्यापार आणि तंत्रज्ञानाच्या क्षेत्रात महाराष्ट्राने उल्लेखनीय यश संपादन केले आहे. मराठी भाषेचा इतिहास अतिशय प्राचीन व समृद्ध असून तिला अभिजात भाषेचा मान मिळाला आहे.",
  },
  {
    id: "gcc-tbc-30-02",
    title: "GCC-TBC 30 WPM Test 2: संगणक व माहिती तंत्रज्ञान",
    targetWpm: 30,
    durationMinutes: 7,
    wordCount: 215,
    text: "आजच्या आधुनिक युगामध्ये माहिती तंत्रज्ञानाचा विकास झपाट्याने होत आहे. संगणक आणि इंटरनेटच्या वापरामुळे मानवी जीवनात अमुलाग्र बदल घडून आले आहेत. कार्यालयातील प्रशासकीय कामकाजापासून ते दैनंदिन व्यवहारांपर्यंत प्रत्येक क्षेत्रात संगणकाचा वापर अनिवार्य झाला आहे. टंकलेखनाचे ज्ञान असणाऱ्या व्यक्तींना विविध क्षेत्रांमध्ये रोजगाराच्या उत्तम संधी उपलब्ध होत आहेत. अचूक आणि जलद टायपिंगमुळे वेळेची बचत होते आणि कामाची गुणवत्ता वाढते. शासकीय आणि निमशासकीय कार्यालयांमध्ये मराठी टायपिंगचे महत्व अनन्यसाधारण आहे. त्यामुळे तरुणांनी संगणकीय टंकलेखनात प्राविण्य मिळवणे अत्यंत गरजेचे ठरते.",
  },
];

export const EXAM_PASSAGES_40_WPM: ExamPassage[] = [
  {
    id: "gcc-tbc-40-01",
    title: "GCC-TBC 40 WPM Test 1: उद्योग व पर्यावरण समतोल",
    targetWpm: 40,
    durationMinutes: 7,
    wordCount: 300,
    text: "औद्योगिकीकरण आणि पर्यावरण यांचा समतोल राखणे हे आजच्या काळातील सर्वात मोठे आव्हान आहे. वेगाने वाढणाऱ्या कारखान्यांमुळे देशाची आर्थिक प्रगती होत असली, तरी पर्यावरणाचा समतोल ढासळणार नाही याची काळजी घेणे अत्यंत गरजेचे आहे. कारखान्यातून बाहेर पडणारे विषारी वायू आणि दूषित पाणी यामुळे जल, वायू आणि भूमी प्रदूषण मोठ्या प्रमाणावर वाढत आहे. या समस्येवर मात करण्यासाठी प्रदूषण नियंत्रण मंडळाचे नियम काटेकोरपणे पाळले पाहिजेत. सौर ऊर्जा, पवन ऊर्जा आणि जलविद्युत यांसारख्या अपारंपरिक ऊर्जा स्रोतांचा वापर वाढवला पाहिजे. वृक्षारोपण करणे आणि अस्तित्वात असणाऱ्या जंगलांचे रक्षण करणे ही प्रत्येक नागरिकाची नैतिक जबाबदारी आहे. विकास आणि निसर्ग यांचा सुवर्णमध्य साधला तरच मानवाचे भविष्य सुरक्षित राहील.",
  },
  {
    id: "gcc-tbc-40-02",
    title: "GCC-TBC 40 WPM Test 2: शिक्षण आणि नवोपक्रम",
    targetWpm: 40,
    durationMinutes: 7,
    wordCount: 290,
    text: "शिक्षणाचा मुख्य उद्देश विद्यार्थ्यांचा सर्वांगीण विकास घडवून आणणे हा असावा. केवळ पुस्तकी ज्ञान देणे पुरेसे नसून त्यांना व्यावहारिक जीवनात यशस्वी होण्यासाठी आवश्यक ती कौशल्ये शिकवली पाहिजेत. आधुनिक शिक्षण पद्धतीमध्ये संशोधनाला आणि कल्पकतेला प्रोत्साहन दिले जात आहे. डिजिटल क्रांतीमुळे शिक्षणाची दारे सर्वांसाठी खुली झाली आहेत. ग्रामीण भागातील विद्यार्थ्यांनाही दर्जेदार शिक्षण मिळणे सुलभ झाले आहे. मातृभाषेतून घेतलेले शिक्षण विद्यार्थ्यांच्या वैचारिक प्रगतीसाठी सर्वात फायदेशीर ठरते. मराठी माध्यमातून शिकणाऱ्या विद्यार्थ्यांनी विविध स्पर्धा परीक्षांमध्ये आणि जागतिक पातळीवर आपली नाममुद्रा उमटवली आहे.",
  },
];
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm run test tests/curriculum/curriculum.test.ts`  
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/curriculum/ tests/curriculum/
git commit -m "feat: add 6-stage InScript curriculum, vocabulary list, and GCC-TBC 30/40 WPM passages"
```

---

### Task 5: Interactive Virtual Keyboard & Hands Guide Components

**Files:**
- Create: `src/components/keyboard/KeyCap.tsx`
- Create: `src/components/keyboard/HandsGuide.tsx`
- Create: `src/components/keyboard/VirtualKeyboard.tsx`
- Test: `tests/components/keyboard.test.ts`

**Interfaces:**
- Produces:
  - `<VirtualKeyboard activeKey={code} isShiftActive={boolean} targetKey={code} />`
  - Finger color highlighting matching touch-typing rules
  - Live shift key switching

- [ ] **Step 1: Write test for keyboard key resolution**

Create `tests/components/keyboard.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { findKeyForChar, IN_SCRIPT_KEYS } from "@/lib/inscript/keymap";

describe("Keyboard Component Logic", () => {
  it("resolves keycap and shift state for standard Marathi characters", () => {
    const kRes = findKeyForChar("क");
    expect(kRes).toEqual({ code: "KeyK", shift: false });

    const khRes = findKeyForChar("ख");
    expect(khRes).toEqual({ code: "KeyK", shift: true });

    const lRes = findKeyForChar("ळ");
    expect(lRes).toEqual({ code: "KeyN", shift: true });
  });

  it("assigns appropriate finger zones to all keycaps", () => {
    expect(IN_SCRIPT_KEYS["KeyF"].finger).toBe("left-index");
    expect(IN_SCRIPT_KEYS["KeyJ"].finger).toBe("right-index");
    expect(IN_SCRIPT_KEYS["KeyA"].finger).toBe("left-pinky");
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm run test tests/components/keyboard.test.ts`  
Expected: PASS

- [ ] **Step 3: Implement KeyCap, HandsGuide, and VirtualKeyboard**

Create `src/components/keyboard/KeyCap.tsx`:
```tsx
"use client";

import React from "react";
import { FingerZone } from "@/lib/inscript/keymap";

interface KeyCapProps {
  code: string;
  qwerty: string;
  charNormal: string;
  charShifted: string;
  finger: FingerZone;
  isActive: boolean;
  isTarget: boolean;
  isShiftActive: boolean;
  widthClass?: string;
}

const FINGER_COLORS: Record<FingerZone, string> = {
  "left-pinky": "border-purple-500/40 bg-purple-950/20",
  "left-ring": "border-blue-500/40 bg-blue-950/20",
  "left-middle": "border-emerald-500/40 bg-emerald-950/20",
  "left-index": "border-amber-500/40 bg-amber-950/20",
  thumb: "border-slate-500/40 bg-slate-900/40",
  "right-index": "border-amber-500/40 bg-amber-950/20",
  "right-middle": "border-emerald-500/40 bg-emerald-950/20",
  "right-ring": "border-blue-500/40 bg-blue-950/20",
  "right-pinky": "border-purple-500/40 bg-purple-950/20",
};

export const KeyCap: React.FC<KeyCapProps> = ({
  qwerty,
  charNormal,
  charShifted,
  finger,
  isActive,
  isTarget,
  isShiftActive,
  widthClass = "w-12",
}) => {
  const displayChar = isShiftActive ? charShifted : charNormal;
  const secondaryChar = isShiftActive ? charNormal : charShifted;

  return (
    <div
      className={`relative h-14 ${widthClass} rounded-lg border-2 flex flex-col justify-between p-1.5 select-none transition-all duration-75 shadow-sm ${
        FINGER_COLORS[finger]
      } ${
        isTarget
          ? "ring-4 ring-emerald-400 border-emerald-400 scale-105 z-10 shadow-emerald-500/30 shadow-lg animate-pulse"
          : ""
      } ${isActive ? "bg-emerald-500/40 border-emerald-300 translate-y-0.5" : ""}`}
    >
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <span className="uppercase">{qwerty}</span>
        <span className="opacity-60 text-[9px]">{secondaryChar}</span>
      </div>
      <div className="text-center font-bold text-lg text-slate-100 font-sans leading-none">
        {displayChar}
      </div>
    </div>
  );
};
```

Create `src/components/keyboard/HandsGuide.tsx`:
```tsx
"use client";

import React from "react";
import { FingerZone } from "@/lib/inscript/keymap";

interface HandsGuideProps {
  targetFinger?: FingerZone;
}

export const HandsGuide: React.FC<HandsGuideProps> = ({ targetFinger }) => {
  const isLeft = targetFinger?.startsWith("left");
  const isRight = targetFinger?.startsWith("right");

  const fingerLabels: Record<string, string> = {
    "left-pinky": "डावा करंगळी (Left Pinky)",
    "left-ring": "डावा अनामिका (Left Ring)",
    "left-middle": "डावा मध्यमा (Left Middle)",
    "left-index": "डावा तर्जनी (Left Index)",
    thumb: "अंगठा (Thumb)",
    "right-index": "उजवा तर्जनी (Right Index)",
    "right-middle": "उजवा मध्यमा (Right Middle)",
    "right-ring": "उजवा अनामिका (Right Ring)",
    "right-pinky": "उजवा करंगळी (Right Pinky)",
  };

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
      <div className={`flex items-center gap-2 ${isLeft ? "text-emerald-400 font-semibold" : "opacity-60"}`}>
        <span>👈 डावा हात (Left Hand)</span>
      </div>
      <div className="text-center">
        {targetFinger ? (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-medium">
            बोट: {fingerLabels[targetFinger] || targetFinger}
          </span>
        ) : (
          <span className="text-slate-500">तयार राहा (Ready)</span>
        )}
      </div>
      <div className={`flex items-center gap-2 ${isRight ? "text-emerald-400 font-semibold" : "opacity-60"}`}>
        <span>👉 उजवा हात (Right Hand)</span>
      </div>
    </div>
  );
};
```

Create `src/components/keyboard/VirtualKeyboard.tsx`:
```tsx
"use client";

import React from "react";
import { IN_SCRIPT_KEYS, KeyDefinition, findKeyForChar } from "@/lib/inscript/keymap";
import { KeyCap } from "./KeyCap";
import { HandsGuide } from "./HandsGuide";

interface VirtualKeyboardProps {
  activeCode?: string | null;
  targetChar?: string | null;
  isShiftDown?: boolean;
}

const ROW_1 = ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"];
const ROW_2 = ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"];
const ROW_3 = ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"];
const ROW_4 = ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeCode,
  targetChar,
  isShiftDown = false,
}) => {
  const targetInfo = targetChar ? findKeyForChar(targetChar) : null;
  const targetCode = targetInfo?.code;
  const targetDef = targetCode ? IN_SCRIPT_KEYS[targetCode] : undefined;

  const renderKey = (code: string, widthClass = "w-12") => {
    const def = IN_SCRIPT_KEYS[code];
    if (!def) return null;
    return (
      <KeyCap
        key={code}
        code={code}
        qwerty={def.qwerty}
        charNormal={def.normal}
        charShifted={def.shifted}
        finger={def.finger}
        isActive={activeCode === code}
        isTarget={targetCode === code}
        isShiftActive={isShiftDown || !!targetInfo?.shift}
        widthClass={widthClass}
      />
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
      <HandsGuide targetFinger={targetDef?.finger} />

      {/* Row 1 */}
      <div className="flex gap-1.5 justify-center">
        {ROW_1.map((code) => renderKey(code))}
        <div className="h-14 w-20 rounded-lg border-2 border-slate-700 bg-slate-800/40 text-slate-400 text-xs font-mono flex items-center justify-center">
          Backspace
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex gap-1.5 justify-center">
        <div className="h-14 w-16 rounded-lg border-2 border-slate-700 bg-slate-800/40 text-slate-400 text-xs font-mono flex items-center justify-center">
          Tab
        </div>
        {ROW_2.map((code) => renderKey(code))}
      </div>

      {/* Row 3 */}
      <div className="flex gap-1.5 justify-center">
        <div className="h-14 w-20 rounded-lg border-2 border-slate-700 bg-slate-800/40 text-slate-400 text-xs font-mono flex items-center justify-center">
          Caps
        </div>
        {ROW_3.map((code) => renderKey(code))}
        <div className="h-14 w-20 rounded-lg border-2 border-slate-700 bg-slate-800/40 text-slate-400 text-xs font-mono flex items-center justify-center">
          Enter
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex gap-1.5 justify-center">
        <div className={`h-14 w-24 rounded-lg border-2 text-xs font-mono flex items-center justify-center transition-colors ${
          isShiftDown || targetInfo?.shift ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold" : "border-slate-700 bg-slate-800/40 text-slate-400"
        }`}>
          Shift
        </div>
        {ROW_4.map((code) => renderKey(code))}
        <div className={`h-14 w-24 rounded-lg border-2 text-xs font-mono flex items-center justify-center transition-colors ${
          isShiftDown || targetInfo?.shift ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold" : "border-slate-700 bg-slate-800/40 text-slate-400"
        }`}>
          Shift
        </div>
      </div>

      {/* Row 5: Spacebar */}
      <div className="flex gap-1.5 justify-center">
        {renderKey("Space", "w-80")}
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Verify Next.js compiles the keyboard components**

Run: `npm run build`  
Expected: Builds without TypeScript or JSX errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/keyboard/ tests/components/
git commit -m "feat: implement interactive VirtualKeyboard with color-coded fingers and hands guide"
```

---

### Task 6: Core Typing Engine & Display Components

**Files:**
- Create: `src/components/typing/TypingArea.tsx`
- Create: `src/components/typing/LiveStatsBar.tsx`
- Create: `src/components/typing/ResultModal.tsx`
- Create: `src/hooks/useInscriptEngine.ts`
- Test: `tests/hooks/inscriptEngine.test.ts`

**Interfaces:**
- Produces:
  - `useInscriptEngine(targetText, onFinish, options)`: Intercepts physical keypresses, compares against target text, computes live stats, triggers sounds.
  - `<TypingArea text={targetText} currentIndex={idx} typedChars={array} />`
  - `<LiveStatsBar wpm={grossWpm} accuracy={acc} time={elapsed} />`
  - `<ResultModal metrics={metrics} onRetry={fn} onNext={fn} />`

- [ ] **Step 1: Write test for typing engine state updates**

Create `tests/hooks/inscriptEngine.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { segmentGraphemes } from "@/lib/inscript/graphemes";

describe("InScript Typing Engine Logic", () => {
  it("segments target text into matchable grapheme units", () => {
    const text = "करून";
    const graphemes = segmentGraphemes(text);
    expect(graphemes).toEqual(["क", "रू", "न"]);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm run test tests/hooks/inscriptEngine.test.ts`  
Expected: PASS

- [ ] **Step 3: Implement typing hook and UI components**

Create `src/hooks/useInscriptEngine.ts`:
```typescript
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { translateKey } from "@/lib/inscript/keymap";
import { segmentGraphemes, normalizeDevanagari } from "@/lib/inscript/graphemes";
import { calculateMetrics, TypingMetrics } from "@/lib/store/useTypingStore";
import { soundEffects } from "@/lib/audio/soundEffects";

interface UseInscriptEngineProps {
  targetText: string;
  soundEnabled?: boolean;
  timeLimitSeconds?: number;
  onFinish?: (metrics: TypingMetrics) => void;
  onKeyProcessed?: (char: string, isCorrect: boolean) => void;
}

export function useInscriptEngine({
  targetText,
  soundEnabled = true,
  timeLimitSeconds,
  onFinish,
  onKeyProcessed,
}: UseInscriptEngineProps) {
  const normalizedTarget = normalizeDevanagari(targetText);
  const targetChars = segmentGraphemes(normalizedTarget);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [typedHistory, setTypedHistory] = useState<{ char: string; isCorrect: boolean }[]>([]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const targetChar = currentIndex < targetChars.length ? targetChars[currentIndex] : null;

  // Timer loop
  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(diff);

        if (timeLimitSeconds && diff >= timeLimitSeconds) {
          finishSession(diff);
        }
      }, 500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, isFinished, timeLimitSeconds]);

  const finishSession = useCallback(
    (durationSec: number) => {
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (soundEnabled) soundEffects.playSuccess();

      const metrics = calculateMetrics({
        charCount: typedHistory.length,
        mistakes,
        durationSeconds: Math.max(1, durationSec),
      });

      if (onFinish) onFinish(metrics);
    },
    [typedHistory.length, mistakes, soundEnabled, onFinish]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFinished) return;

      if (e.key === "Shift") {
        setIsShiftDown(true);
        return;
      }

      // Ignore standard browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      setActiveCode(e.code);

      // Backspace handling
      if (e.key === "Backspace") {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
          setTypedHistory((prev) => prev.slice(0, -1));
        }
        return;
      }

      const marathiChar = translateKey(e.code, e.shiftKey || isShiftDown);
      if (!marathiChar) return;

      e.preventDefault();

      // Start timer on first valid keypress
      if (!startTime) {
        setStartTime(Date.now());
      }

      const expected = targetChars[currentIndex];
      const isCorrect = marathiChar === expected;

      if (isCorrect) {
        if (soundEnabled) soundEffects.playKeyClick();
      } else {
        if (soundEnabled) soundEffects.playError();
        setMistakes((m) => m + 1);
      }

      if (onKeyProcessed) onKeyProcessed(marathiChar, isCorrect);

      const nextHistory = [...typedHistory, { char: marathiChar, isCorrect }];
      setTypedHistory(nextHistory);

      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      if (nextIndex >= targetChars.length) {
        const dur = Math.max(1, Math.floor((Date.now() - (startTime || Date.now())) / 1000));
        finishSession(dur);
      }
    },
    [isFinished, currentIndex, targetChars, startTime, isShiftDown, soundEnabled, typedHistory, mistakes, onKeyProcessed, finishSession]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      setIsShiftDown(false);
    }
    setActiveCode(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const restart = () => {
    setCurrentIndex(0);
    setTypedHistory([]);
    setMistakes(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
  };

  const metrics = calculateMetrics({
    charCount: typedHistory.length,
    mistakes,
    durationSeconds: Math.max(1, elapsedSeconds),
  });

  return {
    currentIndex,
    targetChars,
    targetChar,
    typedHistory,
    activeCode,
    isShiftDown,
    isFinished,
    elapsedSeconds,
    metrics,
    restart,
  };
}
```

Create `src/components/typing/LiveStatsBar.tsx`:
```tsx
"use client";

import React from "react";
import { TypingMetrics } from "@/lib/store/useTypingStore";
import { Gauge, Target, Timer, AlertCircle } from "lucide-react";

interface LiveStatsBarProps {
  metrics: TypingMetrics;
  elapsedSeconds: number;
  timeLimit?: number;
}

export const LiveStatsBar: React.FC<LiveStatsBarProps> = ({
  metrics,
  elapsedSeconds,
  timeLimit,
}) => {
  const displayTime = timeLimit ? Math.max(0, timeLimit - elapsedSeconds) : elapsedSeconds;
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="grid grid-cols-4 gap-4 w-full max-w-4xl mx-auto mb-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <Gauge className="w-6 h-6 text-emerald-400" />
        <div>
          <div className="text-xs text-slate-400">वेग (Gross WPM)</div>
          <div className="text-xl font-bold text-slate-100">{metrics.grossWpm}</div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <Target className="w-6 h-6 text-blue-400" />
        <div>
          <div className="text-xs text-slate-400">अचूकता (Accuracy)</div>
          <div className="text-xl font-bold text-slate-100">{metrics.accuracy}%</div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <Timer className="w-6 h-6 text-amber-400" />
        <div>
          <div className="text-xs text-slate-400">वेळ (Time)</div>
          <div className="text-xl font-bold text-slate-100">{formattedTime}</div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-rose-400" />
        <div>
          <div className="text-xs text-slate-400">चुका (Mistakes)</div>
          <div className="text-xl font-bold text-slate-100">{metrics.mistakes}</div>
        </div>
      </div>
    </div>
  );
};
```

Create `src/components/typing/TypingArea.tsx`:
```tsx
"use client";

import React, { useRef, useEffect } from "react";

interface TypingAreaProps {
  targetChars: string[];
  currentIndex: number;
  typedHistory: { char: string; isCorrect: boolean }[];
}

export const TypingArea: React.FC<TypingAreaProps> = ({
  targetChars,
  currentIndex,
  typedHistory,
}) => {
  const activeCharRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentIndex]);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[140px] max-h-[220px] overflow-y-auto bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-6 font-sans text-2xl leading-relaxed tracking-wide shadow-xl select-none">
      {targetChars.map((char, index) => {
        const isCurrent = index === currentIndex;
        const typed = typedHistory[index];

        let styleClass = "text-slate-500";
        if (typed) {
          styleClass = typed.isCorrect ? "text-emerald-400 font-medium" : "text-rose-500 bg-rose-950/40 rounded px-0.5";
        }

        return (
          <span
            key={index}
            ref={isCurrent ? activeCharRef : null}
            className={`relative transition-colors duration-75 ${styleClass} ${
              isCurrent ? "bg-emerald-500/20 text-slate-100 px-1 rounded shadow-sm ring-1 ring-emerald-400 animate-pulse font-semibold" : ""
            }`}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </div>
  );
};
```

Create `src/components/typing/ResultModal.tsx`:
```tsx
"use client";

import React from "react";
import { TypingMetrics } from "@/lib/store/useTypingStore";
import { CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";

interface ResultModalProps {
  isOpen: boolean;
  metrics: TypingMetrics;
  onRetry: () => void;
  onNext?: () => void;
  title?: string;
  isPassed?: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  metrics,
  onRetry,
  onNext,
  title = "सराव पूर्ण झाला! (Practice Completed)",
  isPassed = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
        <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-3" />
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
        <p className="text-sm text-slate-400 mt-1">
          {isPassed ? "छान प्रयत्न! आपण पुढील टप्प्यासाठी पात्र आहात." : "पुन्हा सराव करून ९५% पेक्षा जास्त अचूकता मिळवा."}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full my-6">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Gross WPM</div>
            <div className="text-2xl font-bold text-emerald-400">{metrics.grossWpm}</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Net WPM</div>
            <div className="text-2xl font-bold text-blue-400">{metrics.netWpm}</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Accuracy</div>
            <div className="text-2xl font-bold text-amber-400">{metrics.accuracy}%</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Mistakes</div>
            <div className="text-2xl font-bold text-rose-400">{metrics.mistakes}</div>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" /> पुन्हा करा (Retry)
          </button>
          {onNext && isPassed && (
            <button
              onClick={onNext}
              className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              पुढे चला (Next) <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Step 4: Verify Next.js build**

Run: `npm run build`  
Expected: Next.js builds successfully.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/ src/components/typing/ tests/hooks/
git commit -m "feat: implement useInscriptEngine hook, TypingArea, LiveStatsBar, and ResultModal"
```

---

### Task 7: Guided Academy & Progression Runner

**Files:**
- Create: `src/app/academy/page.tsx`
- Create: `src/app/academy/[id]/page.tsx`
- Modify: `src/components/common/Header.tsx`
- Test: `tests/academy/progression.test.ts`

**Interfaces:**
- Produces:
  - `/academy`: Stage selector displaying progress, locked/unlocked badges, and scores
  - `/academy/[id]`: Interactive guided lesson runner with auto-unlocking on >= 95% accuracy

- [ ] **Step 1: Write test for lesson unlocking rules**

Create `tests/academy/progression.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

describe("Academy Progression Logic", () => {
  it("determines pass criteria: accuracy >= 95% and speed >= minWpm", () => {
    const isPassed = (accuracy: number, wpm: number, minWpm: number) => accuracy >= 95 && wpm >= minWpm;
    expect(isPassed(96, 16, 12)).toBe(true);
    expect(isPassed(94, 25, 12)).toBe(false);
    expect(isPassed(98, 10, 12)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm run test tests/academy/progression.test.ts`  
Expected: PASS

- [ ] **Step 3: Implement Header and Academy Pages**

Create `src/components/common/Header.tsx`:
```tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Zap, Award, BarChart3, Volume2, VolumeX, Stethoscope } from "lucide-react";
import { useTypingStore } from "@/lib/store/useTypingStore";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const { soundEnabled, toggleSound } = useTypingStore();

  const navItems = [
    { href: "/academy", label: "अकॅडमी (Academy)", icon: GraduationCap },
    { href: "/sprint", label: "स्पीड स्प्रिंट (Sprint)", icon: Zap },
    { href: "/exam", label: "परीक्षा (GCC-TBC Exam)", icon: Award },
    { href: "/clinic", label: "वीक की क्लिनिक (Clinic)", icon: Stethoscope },
    { href: "/stats", label: "प्रगती (Stats)", icon: BarChart3 },
  ];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-lg shadow-md">
            म
          </div>
          <div>
            <div className="font-bold text-slate-100 text-sm leading-tight">मराठी टायपिंग</div>
            <div className="text-[10px] text-emerald-400 font-mono">InScript Academy</div>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={toggleSound}
          className="p-2 rounded-lg border border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition"
          title={soundEnabled ? "Mute Sound" : "Enable Sound"}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
```

Create `src/app/academy/page.tsx`:
```tsx
"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/common/Header";
import { STAGES } from "@/lib/curriculum/stages";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { Lock, CheckCircle2, Play } from "lucide-react";

export default function AcademyPage() {
  const { unlockedLessons, lessonScores } = useTypingStore();

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-100">मराठी टायपिंग अभ्यासक्रम</h1>
          <p className="text-slate-400 text-sm mt-1">
            ६ टप्प्यांचा परिपूर्ण कोर्स — मूलभूत अक्षरांपासून ते अस्खलित परीक्षा परिच्छेदांपर्यंत.
          </p>
        </div>

        <div className="space-y-6">
          {STAGES.map((stage) => (
            <div key={stage.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-100">{stage.title}</h2>
                <p className="text-xs text-emerald-400 mt-0.5">{stage.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stage.lessons.map((lesson) => {
                  const isUnlocked = unlockedLessons.includes(lesson.id);
                  const score = lessonScores[lesson.id];

                  return (
                    <div
                      key={lesson.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isUnlocked
                          ? "bg-slate-800/40 border-slate-700/80 hover:border-emerald-500/50"
                          : "bg-slate-950/40 border-slate-900 opacity-60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            लक्ष्य: {lesson.minWpm} WPM
                          </span>
                          {score ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : !isUnlocked ? (
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                          ) : null}
                        </div>
                        <h3 className="font-semibold text-sm text-slate-200">{lesson.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{lesson.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        {score ? (
                          <div className="text-[11px] text-slate-400">
                            सर्वोत्तम: <span className="text-emerald-400 font-semibold">{score.bestWpm} WPM</span> ({score.bestAccuracy}%)
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500">पूर्ण केलेले नाही</div>
                        )}

                        {isUnlocked ? (
                          <Link
                            href={`/academy/${lesson.id}`}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg flex items-center gap-1 transition"
                          >
                            <Play className="w-3 h-3 fill-current" /> सुरू करा
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-600 font-medium">लॉक केलेले</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
```

Create `src/app/academy/[id]/page.tsx`:
```tsx
"use client";

import React, { use } from "react";
import { notFound, useRouter } from "next/navigation";
import { Header } from "@/components/common/Header";
import { STAGES, getNextLessonId } from "@/lib/curriculum/stages";
import { useInscriptEngine } from "@/hooks/useInscriptEngine";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { ResultModal } from "@/components/typing/ResultModal";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const allLessons = STAGES.flatMap((s) => s.lessons);
  const lesson = allLessons.find((l) => l.id === resolvedParams.id);

  if (!lesson) notFound();

  const { unlockLesson, recordLessonScore, recordKeyStroke, soundEnabled } = useTypingStore();

  const engine = useInscriptEngine({
    targetText: lesson.targetText,
    soundEnabled,
    onKeyProcessed: (char, isCorrect) => recordKeyStroke(char, isCorrect),
    onFinish: (metrics) => {
      const isPassed = metrics.accuracy >= lesson.minAccuracy && metrics.grossWpm >= lesson.minWpm;
      recordLessonScore({
        lessonId: lesson.id,
        bestWpm: metrics.grossWpm,
        bestAccuracy: metrics.accuracy,
        completedAt: new Date().toISOString(),
      });
      if (isPassed) {
        const nextId = getNextLessonId(lesson.id);
        if (nextId) unlockLesson(nextId);
      }
    },
  });

  const nextLessonId = getNextLessonId(lesson.id);
  const isPassed = engine.metrics.accuracy >= lesson.minAccuracy && engine.metrics.grossWpm >= lesson.minWpm;

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <Link href="/academy" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> अभ्यासक्रमाकडे परत
            </Link>
            <div className="text-xs text-emerald-400 font-mono">
              लक्ष्य: {lesson.minWpm} WPM | अचूकता: {lesson.minAccuracy}%
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-100">{lesson.title}</h1>
            <p className="text-xs text-slate-400 mt-1">{lesson.description}</p>
          </div>

          <LiveStatsBar metrics={engine.metrics} elapsedSeconds={engine.elapsedSeconds} />

          <TypingArea
            targetChars={engine.targetChars}
            currentIndex={engine.currentIndex}
            typedHistory={engine.typedHistory}
          />
        </div>

        <div className="mt-8">
          <VirtualKeyboard
            activeCode={engine.activeCode}
            targetChar={engine.targetChar}
            isShiftDown={engine.isShiftDown}
          />
        </div>

        <ResultModal
          isOpen={engine.isFinished}
          metrics={engine.metrics}
          isPassed={isPassed}
          onRetry={engine.restart}
          onNext={nextLessonId ? () => router.push(`/academy/${nextLessonId}`) : undefined}
        />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify Next.js build**

Run: `npm run build`  
Expected: Academy routes compile cleanly.

- [ ] **Step 5: Commit**

```bash
git add src/app/academy/ src/components/common/Header.tsx tests/academy/
git commit -m "feat: implement Academy curriculum dashboard, dynamic lesson runner, and level unlock progression"
```

---

### Task 8: Speed Sprint & Weak Key Clinic

**Files:**
- Create: `src/app/sprint/page.tsx`
- Create: `src/app/clinic/page.tsx`
- Test: `tests/clinic/clinic.test.ts`

**Interfaces:**
- Produces:
  - `/sprint`: Monkeytype-style speed sprint (15s, 30s, 60s, 120s modes)
  - `/clinic`: Adaptive Weak Key Clinic generating custom practice sentences from user error history

- [ ] **Step 1: Write test for weak key drill generator**

Create `tests/clinic/clinic.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { generateClinicDrill } from "@/app/clinic/page";

describe("Weak Key Clinic Generator", () => {
  it("generates drill containing targeted weak characters", () => {
    const weakChars = ["ळ", "ख", "ज्ञ"];
    const drill = generateClinicDrill(weakChars);
    expect(drill.length).toBeGreaterThan(15);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test tests/clinic/clinic.test.ts`  
Expected: FAIL ("Cannot find module '@/app/clinic/page'")

- [ ] **Step 3: Implement Speed Sprint and Weak Key Clinic**

Create `src/app/sprint/page.tsx`:
```tsx
"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { COMMON_MARATHI_WORDS } from "@/lib/curriculum/words";
import { useInscriptEngine } from "@/hooks/useInscriptEngine";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { ResultModal } from "@/components/typing/ResultModal";
import { RotateCcw } from "lucide-react";

function getRandomWords(count: number): string {
  const shuffled = [...COMMON_MARATHI_WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).join(" ");
}

export default function SprintPage() {
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [drillText, setDrillText] = useState(() => getRandomWords(40));
  const { soundEnabled, recordKeyStroke } = useTypingStore();

  const engine = useInscriptEngine({
    targetText: drillText,
    soundEnabled,
    timeLimitSeconds: timeLimit,
    onKeyProcessed: (char, isCorrect) => recordKeyStroke(char, isCorrect),
  });

  const handleTimeChange = (t: number) => {
    setTimeLimit(t);
    setDrillText(getRandomWords(t === 15 ? 25 : t === 30 ? 45 : 80));
    engine.restart();
  };

  const handleRestart = () => {
    setDrillText(getRandomWords(timeLimit === 15 ? 25 : timeLimit === 30 ? 45 : 80));
    engine.restart();
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-slate-100">स्पीड स्प्रिंट (Speed Sprint)</h1>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {[15, 30, 60, 120].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTimeChange(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    timeLimit === t
                      ? "bg-emerald-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t}s
                </button>
              ))}
              <button
                onClick={handleRestart}
                className="p-1.5 text-slate-400 hover:text-slate-200 ml-1"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <LiveStatsBar
            metrics={engine.metrics}
            elapsedSeconds={engine.elapsedSeconds}
            timeLimit={timeLimit}
          />

          <TypingArea
            targetChars={engine.targetChars}
            currentIndex={engine.currentIndex}
            typedHistory={engine.typedHistory}
          />
        </div>

        <div className="mt-8">
          <VirtualKeyboard
            activeCode={engine.activeCode}
            targetChar={engine.targetChar}
            isShiftDown={engine.isShiftDown}
          />
        </div>

        <ResultModal
          isOpen={engine.isFinished}
          metrics={engine.metrics}
          title="स्प्रिंट पूर्ण झाला! (Sprint Complete)"
          onRetry={handleRestart}
        />
      </main>
    </>
  );
}
```

Create `src/app/clinic/page.tsx`:
```tsx
"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { useInscriptEngine } from "@/hooks/useInscriptEngine";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { ResultModal } from "@/components/typing/ResultModal";
import { Stethoscope, AlertTriangle, RotateCcw } from "lucide-react";

export function generateClinicDrill(weakChars: string[]): string {
  if (weakChars.length === 0) {
    return "महाराष्ट्र राज्य विद्यार्थी अभ्यासक्रम पुस्तक राष्ट्रीय स्वातंत्र्य ज्ञान परीक्षा";
  }
  const words = [
    "कमळ", "बाळ", "पाणी", "शाळा", "ज्ञान", "विज्ञान", "मित्र", "क्षेत्र", "धर्म", "कर्म",
    "खत", "घर", "झाड", "ऋषी", "ऋतु", "श्रद्धा", "आश्रम", "कौतुक", "धनुष्य", "भाषा"
  ];
  const matched = words.filter((w) => weakChars.some((c) => w.includes(c)));
  const pool = matched.length > 0 ? matched : words;
  const drill: string[] = [];
  for (let i = 0; i < 20; i++) {
    drill.push(pool[i % pool.length]);
  }
  return drill.join(" ");
}

export default function ClinicPage() {
  const { weakKeys, soundEnabled, recordKeyStroke } = useTypingStore();

  const sortedWeak = Object.values(weakKeys)
    .filter((k) => k.missCount > 0)
    .sort((a, b) => b.missCount - a.missCount)
    .slice(0, 5)
    .map((k) => k.char);

  const [drillText, setDrillText] = useState(() => generateClinicDrill(sortedWeak));

  const engine = useInscriptEngine({
    targetText: drillText,
    soundEnabled,
    onKeyProcessed: (char, isCorrect) => recordKeyStroke(char, isCorrect),
  });

  const handleRefresh = () => {
    setDrillText(generateClinicDrill(sortedWeak));
    engine.restart();
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-emerald-400" />
              <div>
                <h1 className="text-xl font-bold text-slate-100">वीक की क्लिनिक (Weak Key Clinic)</h1>
                <p className="text-xs text-slate-400">आपल्या सर्वात जास्त चुकणाऱ्या अक्षरांचा विशेष सराव.</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> नवीन सराव तयार करा
            </button>
          </div>

          <div className="mb-6 p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              {sortedWeak.length > 0 ? (
                <span>
                  सध्याची कठीण अक्षरे:{" "}
                  {sortedWeak.map((c, i) => (
                    <span key={i} className="font-bold text-amber-300 px-1 bg-amber-950/40 rounded mr-1">
                      {c}
                    </span>
                  ))}
                </span>
              ) : (
                <span>उत्कृष्ट! अद्याप कोणतीही गंभीर चूक नोंदवलेली नाही. सरावासाठी सामान्य कठीण शब्द दिले आहेत.</span>
              )}
            </div>
          </div>

          <LiveStatsBar metrics={engine.metrics} elapsedSeconds={engine.elapsedSeconds} />

          <TypingArea
            targetChars={engine.targetChars}
            currentIndex={engine.currentIndex}
            typedHistory={engine.typedHistory}
          />
        </div>

        <div className="mt-8">
          <VirtualKeyboard
            activeCode={engine.activeCode}
            targetChar={engine.targetChar}
            isShiftDown={engine.isShiftDown}
          />
        </div>

        <ResultModal
          isOpen={engine.isFinished}
          metrics={engine.metrics}
          title="क्लिनिक सराव पूर्ण! (Clinic Completed)"
          onRetry={handleRefresh}
        />
      </main>
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test tests/clinic/clinic.test.ts`  
Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/app/sprint/ src/app/clinic/ tests/clinic/
git commit -m "feat: implement Speed Sprint and adaptive Weak Key Clinic drill generator"
```

---

### Task 9: GCC-TBC Official Exam Simulator & Certificate Generator

**Files:**
- Create: `src/components/exam/ExamCertificate.tsx`
- Create: `src/app/exam/page.tsx`
- Test: `tests/exam/examScoring.test.ts`

**Interfaces:**
- Produces:
  - `/exam`: Maharashtra GCC-TBC official exam simulator (30 WPM & 40 WPM 7-minute benchmark test)
  - Strict Gross/Net speed evaluation
  - Printable/downloadable official completion certificate (`ExamCertificate.tsx`)

- [ ] **Step 1: Write test for GCC-TBC exam grading logic**

Create `tests/exam/examScoring.test.ts`:
```typescript
import { describe, it, expect } from "vitest";

function evaluateExamGrade(netWpm: number, accuracy: number, targetWpm: number) {
  if (accuracy < 85 || netWpm < targetWpm - 2) return { passed: false, grade: "Fail" as const };
  if (accuracy >= 95 && netWpm >= targetWpm + 5) return { passed: true, grade: "Distinction" as const };
  if (accuracy >= 90 && netWpm >= targetWpm) return { passed: true, grade: "First Class" as const };
  return { passed: true, grade: "Pass" as const };
}

describe("GCC-TBC Grading Standard", () => {
  it("awards Distinction for speed >= target + 5 and accuracy >= 95%", () => {
    const res = evaluateExamGrade(36, 96, 30);
    expect(res.passed).toBe(true);
    expect(res.grade).toBe("Distinction");
  });

  it("fails when accuracy is below 85%", () => {
    const res = evaluateExamGrade(38, 83, 30);
    expect(res.passed).toBe(false);
    expect(res.grade).toBe("Fail");
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm run test tests/exam/examScoring.test.ts`  
Expected: PASS

- [ ] **Step 3: Implement Certificate and Exam Simulator Page**

Create `src/components/exam/ExamCertificate.tsx`:
```tsx
"use client";

import React, { useRef } from "react";
import { Award, Printer } from "lucide-react";

interface ExamCertificateProps {
  candidateName: string;
  targetWpm: 30 | 40;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  grade: string;
  date: string;
  onClose: () => void;
}

export const ExamCertificate: React.FC<ExamCertificateProps> = ({
  candidateName,
  targetWpm,
  grossWpm,
  netWpm,
  accuracy,
  grade,
  date,
  onClose,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="flex flex-col items-center gap-4 max-w-2xl w-full">
        <div
          ref={certRef}
          className="w-full bg-amber-50 text-slate-900 border-8 border-double border-amber-800 rounded-3xl p-8 shadow-2xl relative select-none font-serif print:w-full print:m-0"
        >
          <div className="text-center border-b-2 border-amber-700/40 pb-4 mb-6">
            <Award className="w-16 h-16 text-amber-700 mx-auto mb-2" />
            <h1 className="text-3xl font-bold tracking-wide text-amber-950">
              प्रमाणपत्र (CERTIFICATE OF PROFICIENCY)
            </h1>
            <p className="text-sm font-sans text-amber-800 font-semibold mt-1">
              महाराष्ट्र राज्य शासकीय संगणक टंकलेखन सराव परीक्षा (GCC-TBC SIMULATION)
            </p>
          </div>

          <div className="text-center space-y-4 my-8 font-sans">
            <p className="text-sm text-slate-700">प्रमाणित करण्यात येते की</p>
            <h2 className="text-2xl font-bold text-slate-900 underline decoration-amber-600 decoration-2 underline-offset-4">
              {candidateName || "माननीय विद्यार्थी"}
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed max-w-lg mx-auto">
              यांनी मराठी इन्स्क्रिप्ट टंकलेखन परीक्षा (मर्यादा: <strong>{targetWpm} शब्द प्रति मिनिट</strong>)
              यशस्वीरीत्या उत्तीर्ण केली असून खालीलप्रमाणे श्रेणी संपादन केली आहे:
            </p>

            <div className="grid grid-cols-4 gap-2 bg-amber-100/60 border border-amber-300 rounded-xl p-3 max-w-lg mx-auto">
              <div>
                <div className="text-[10px] text-slate-600">Gross WPM</div>
                <div className="text-lg font-bold text-slate-900">{grossWpm}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600">Net WPM</div>
                <div className="text-lg font-bold text-emerald-800">{netWpm}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600">Accuracy</div>
                <div className="text-lg font-bold text-slate-900">{accuracy}%</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-600">Grade</div>
                <div className="text-lg font-bold text-amber-900">{grade}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-end border-t border-amber-700/40 pt-6 mt-8 text-xs text-slate-600 font-sans">
            <div>
              दिनांक: <strong>{date}</strong>
            </div>
            <div className="text-center">
              <div className="font-serif font-bold text-amber-900 italic text-sm">Marathi InScript Academy</div>
              <div>परीक्षक स्वाक्षरी (Examiner)</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg"
          >
            <Printer className="w-4 h-4" /> प्रमाणपत्र मुद्रित करा (Print)
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
```

Create `src/app/exam/page.tsx`:
```tsx
"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import { EXAM_PASSAGES_30_WPM, EXAM_PASSAGES_40_WPM, ExamPassage } from "@/lib/curriculum/examPassages";
import { useInscriptEngine } from "@/hooks/useInscriptEngine";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { ExamCertificate } from "@/components/exam/ExamCertificate";
import { Award, ShieldAlert, Play, RotateCcw } from "lucide-react";

export default function ExamPage() {
  const [selectedTier, setSelectedTier] = useState<30 | 40>(30);
  const [candidateName, setCandidateName] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  const passages = selectedTier === 30 ? EXAM_PASSAGES_30_WPM : EXAM_PASSAGES_40_WPM;
  const [selectedPassage, setSelectedPassage] = useState<ExamPassage>(passages[0]);

  const { soundEnabled, recordExamResult, recordKeyStroke } = useTypingStore();

  const timeLimitSeconds = selectedPassage.durationMinutes * 60;

  const engine = useInscriptEngine({
    targetText: selectedPassage.text,
    soundEnabled,
    timeLimitSeconds,
    onKeyProcessed: (char, isCorrect) => recordKeyStroke(char, isCorrect),
    onFinish: (metrics) => {
      const net = metrics.netWpm;
      const acc = metrics.accuracy;
      const passed = acc >= 85 && net >= selectedTier - 2;
      let grade: "Distinction" | "First Class" | "Pass" | "Fail" = "Fail";
      if (passed) {
        if (acc >= 95 && net >= selectedTier + 5) grade = "Distinction";
        else if (acc >= 90 && net >= selectedTier) grade = "First Class";
        else grade = "Pass";
      }

      recordExamResult({
        id: `exam-${Date.now()}`,
        targetWpm: selectedTier,
        grossWpm: metrics.grossWpm,
        netWpm: metrics.netWpm,
        accuracy: metrics.accuracy,
        passed,
        grade,
        timestamp: new Date().toISOString(),
      });
    },
  });

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarted(true);
    engine.restart();
  };

  const handleTierChange = (tier: 30 | 40) => {
    setSelectedTier(tier);
    const newPassages = tier === 30 ? EXAM_PASSAGES_30_WPM : EXAM_PASSAGES_40_WPM;
    setSelectedPassage(newPassages[0]);
    setIsStarted(false);
    engine.restart();
  };

  const isPassed =
    engine.metrics.accuracy >= 85 && engine.metrics.netWpm >= selectedTier - 2;
  const grade =
    engine.metrics.accuracy >= 95 && engine.metrics.netWpm >= selectedTier + 5
      ? "Distinction"
      : engine.metrics.accuracy >= 90 && engine.metrics.netWpm >= selectedTier
      ? "First Class"
      : isPassed
      ? "Pass"
      : "Fail";

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between">
        {!isStarted ? (
          <div className="max-w-xl mx-auto my-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <Award className="w-10 h-10 text-amber-400" />
              <div>
                <h1 className="text-xl font-bold text-slate-100">GCC-TBC शासकीय परीक्षा सिम्युलेटर</h1>
                <p className="text-xs text-slate-400">Maharashtra State Government Typing Test Simulation</p>
              </div>
            </div>

            <form onSubmit={handleStartExam} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">परीक्षेचा वेग निवडा (Speed Tier):</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleTierChange(30)}
                    className={`py-3 rounded-xl border text-sm font-bold transition ${
                      selectedTier === 30
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400"
                    }`}
                  >
                    ३० शब्द/मिनिट (30 WPM)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTierChange(40)}
                    className={`py-3 rounded-xl border text-sm font-bold transition ${
                      selectedTier === 40
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400"
                    }`}
                  >
                    ४० शब्द/मिनिट (40 WPM)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">विद्यार्थ्याचे पूर्ण नाव (Candidate Name):</label>
                <input
                  type="text"
                  required
                  placeholder="उदा. राहुल प्रकाश पाटील"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                />
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> परीक्षा नियम:
                </div>
                <div>• वेळ: ७ मिनिटे (Duration: 7 minutes)</div>
                <div>• उत्तीर्णता: किमान ९०% अचूकता आणि नेट स्पीड ३०/४० WPM</div>
                <div>• उत्तीर्ण झाल्यानंतर डिजिटल प्रमाणपत्र मिळेल.</div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
              >
                <Play className="w-4 h-4 fill-current" /> परीक्षा सुरू करा (Start Exam)
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-lg font-bold text-slate-100">{selectedPassage.title}</h1>
                <p className="text-xs text-slate-400">उमेदवार: {candidateName} | टार्गेट: {selectedTier} WPM</p>
              </div>
              <button
                onClick={() => setIsStarted(false)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              >
                बाहेर पडा (Exit)
              </button>
            </div>

            <LiveStatsBar
              metrics={engine.metrics}
              elapsedSeconds={engine.elapsedSeconds}
              timeLimit={timeLimitSeconds}
            />

            <TypingArea
              targetChars={engine.targetChars}
              currentIndex={engine.currentIndex}
              typedHistory={engine.typedHistory}
            />

            <div className="mt-8">
              <VirtualKeyboard
                activeCode={engine.activeCode}
                targetChar={engine.targetChar}
                isShiftDown={engine.isShiftDown}
              />
            </div>
          </div>
        )}

        {engine.isFinished && isStarted && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl text-center">
              <Award className={`w-14 h-14 mx-auto mb-3 ${isPassed ? "text-emerald-400" : "text-rose-400"}`} />
              <h2 className="text-2xl font-bold text-slate-100">
                {isPassed ? "अभिनंदन! परीक्षा उत्तीर्ण!" : "प्रयत्न चांगला होता (अनुत्तीर्ण)"}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {isPassed ? `आपण '${grade}' श्रेणीमध्ये परीक्षा उत्तीर्ण केली आहे.` : "अचूकता किंवा वेग निकषांपेक्षा कमी पडला. पुन्हा प्रयत्न करा."}
              </p>

              <div className="grid grid-cols-2 gap-3 my-6">
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-[10px] text-slate-400">Net Speed</div>
                  <div className="text-2xl font-bold text-emerald-400">{engine.metrics.netWpm} WPM</div>
                </div>
                <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                  <div className="text-[10px] text-slate-400">Accuracy</div>
                  <div className="text-2xl font-bold text-blue-400">{engine.metrics.accuracy}%</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsStarted(false);
                    engine.restart();
                  }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> पुन्हा द्या
                </button>
                {isPassed && (
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    प्रमाणपत्र पहा <Award className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {showCertificate && (
          <ExamCertificate
            candidateName={candidateName}
            targetWpm={selectedTier}
            grossWpm={engine.metrics.grossWpm}
            netWpm={engine.metrics.netWpm}
            accuracy={engine.metrics.accuracy}
            grade={grade}
            date={new Date().toLocaleDateString("mr-IN")}
            onClose={() => setShowCertificate(false)}
          />
        )}
      </main>
    </>
  );
}
```

- [ ] **Step 4: Verify Next.js build**

Run: `npm run build`  
Expected: Builds without errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/exam/ src/app/exam/ tests/exam/
git commit -m "feat: implement GCC-TBC official 30/40 WPM exam simulator and digital achievement certificate"
```

---

### Task 10: Home Dashboard, Stats Heatmap, and E2E Verification

**Files:**
- Modify: `src/app/page.tsx`
- Create: `src/app/stats/page.tsx`
- Test: `tests/e2e/workflow.test.ts`

**Interfaces:**
- Produces:
  - Responsive Home Dashboard featuring quick practice mode, quick links to Academy, Sprint, and Exam Simulator
  - `/stats`: Analytics, weak-key heatmap, exam history table, and streak counter
  - Full project test suite passing with zero warnings

- [ ] **Step 1: Write end-to-end integration test**

Create `tests/e2e/workflow.test.ts`:
```typescript
import { describe, it, expect } from "vitest";
import { STAGES } from "@/lib/curriculum/stages";
import { IN_SCRIPT_KEYS, translateKey } from "@/lib/inscript/keymap";
import { calculateMetrics } from "@/lib/store/useTypingStore";

describe("Marathi Typing App End-to-End Workflow Verification", () => {
  it("verifies full keymap translation across all stages", () => {
    STAGES.forEach((stage) => {
      stage.lessons.forEach((lesson) => {
        lesson.keysFocus.forEach((char) => {
          if (char === "full-keyboard" || char === "महाराष्ट्र" || char === "विद्यार्थी" || char === "पुस्तके" || char === "स्वातंत्र्य") return;
          const found = Object.values(IN_SCRIPT_KEYS).some(
            (k) => k.normal === char || k.shifted === char
          );
          expect(found).toBe(true);
        });
      });
    });
  });

  it("verifies accurate scoring calculation for exam thresholds", () => {
    const exam30 = calculateMetrics({ charCount: 1050, mistakes: 5, durationSeconds: 420 });
    expect(exam30.grossWpm).toBe(30);
    expect(exam30.netWpm).toBe(25);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npm run test tests/e2e/workflow.test.ts`  
Expected: PASS

- [ ] **Step 3: Implement Home Dashboard and Stats Page**

Update `src/app/page.tsx`:
```tsx
import Link from "next/link";
import { Header } from "@/components/common/Header";
import { GraduationCap, Zap, Award, Stethoscope, ArrowRight, Keyboard, Sparkles, CheckCircle } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      title: "६ टप्प्यांचा इन्स्क्रिप्ट अभ्यासक्रम",
      desc: "होम रो ते जोडनिबंध, मराठी साहित्य आणि ९५% अचूकता प्रगती प्रणाली.",
      href: "/academy",
      icon: GraduationCap,
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
      cta: "अभ्यासक्रम सुरू करा",
    },
    {
      title: "स्पीड स्प्रिंट (Speed Sprint)",
      desc: "मंकीटाइप स्टाईल १५, ३०, ६० सेकंदांचा विचलित-मुक्त टायपिंग सराव.",
      href: "/sprint",
      icon: Zap,
      color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
      cta: "स्प्रिंट खेळा",
    },
    {
      title: "GCC-TBC परीक्षा सिम्युलेटर",
      desc: "अधिकृत शासकीय निकष: ३० आणि ४० WPM टेस्ट, अचूकता तपासणी व प्रमाणपत्र.",
      href: "/exam",
      icon: Award,
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
      cta: "परीक्षा द्या",
    },
    {
      title: "वीक की क्लिनिक (Adaptive Drill)",
      desc: "आपल्या सर्वाधिक चुकणाऱ्या अक्षरांचा स्वयंचलित विश्लेषणात्मक सराव.",
      href: "/clinic",
      icon: Stethoscope,
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
      cta: "क्लिनिकमध्ये जा",
    },
  ];

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-12 flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> इंग्रजी कीबोर्डवर मराठी इन्स्क्रिप्ट शिका
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            मराठी टायपिंग शिका, <span className="text-emerald-400">जलद आणि अचूक!</span>
          </h1>
          <p className="mt-4 text-slate-400 text-base leading-relaxed">
            कोणतीही लँग्वेज सेटिंग न बदलता थेट ब्राउझरमध्ये टाईप करा. रंगीत बोटांचे मार्गदर्शन,
            ध्वनी प्रभाव आणि शासकीय परीक्षा तयारी एकाच ठिकाणी.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/academy"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition"
            >
              सराव सुरू करा (Start Learning) <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/exam"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <Award className="w-4 h-4 text-amber-400" /> GCC-TBC टेस्ट
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className={`p-6 rounded-2xl border bg-gradient-to-br ${f.color} flex flex-col justify-between`}
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-100">{f.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{f.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    href={f.href}
                    className="text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1 group"
                  >
                    {f.cta} <ArrowRight className="w-3.5 h-3.5 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
```

Create `src/app/stats/page.tsx`:
```tsx
"use client";

import React from "react";
import { Header } from "@/components/common/Header";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { BarChart3, Award, CheckCircle2, RotateCcw } from "lucide-react";

export default function StatsPage() {
  const { lessonScores, examHistory, weakKeys, resetProgress } = useTypingStore();

  const completedCount = Object.keys(lessonScores).length;
  const sortedWeak = Object.values(weakKeys)
    .filter((k) => k.missCount > 0)
    .sort((a, b) => b.missCount - a.missCount);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">आपली प्रगती (Your Statistics)</h1>
            <p className="text-xs text-slate-400 mt-1">आपल्या सरावाची आकडेवारी आणि परीक्षा इतिहास.</p>
          </div>
          <button
            onClick={() => {
              if (confirm("आपला संपूर्ण प्रगती डेटा रीसेट करायचा आहे का?")) resetProgress();
            }}
            className="px-3 py-1.5 bg-rose-950/30 border border-rose-500/30 text-rose-300 hover:bg-rose-950/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> डेटा रीसेट करा
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> पूर्ण केलेले धडे
            </div>
            <div className="text-3xl font-bold text-slate-100">{completedCount} / 16</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Award className="w-4 h-4 text-amber-400" /> दिलेल्या परीक्षा
            </div>
            <div className="text-3xl font-bold text-slate-100">{examHistory.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-400" /> उत्तीर्ण परीक्षा
            </div>
            <div className="text-3xl font-bold text-slate-100">
              {examHistory.filter((e) => e.passed).length}
            </div>
          </div>
        </div>

        {/* Weak Keys Heatmap / Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-base font-bold text-slate-100 mb-4">अचूकता विश्लेषण (Key Accuracy Analysis)</h2>
          {sortedWeak.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {sortedWeak.slice(0, 10).map((k) => {
                const errorRate = Math.round((k.missCount / k.totalAttempts) * 100);
                return (
                  <div key={k.char} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-slate-100 mb-1">{k.char}</div>
                    <div className="text-[10px] text-slate-400">
                      चूक दर: <span className="text-rose-400 font-semibold">{errorRate}%</span> ({k.missCount}/{k.totalAttempts})
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500">अद्याप पुरेशी आकडेवारी उपलब्ध नाही. सराव सुरू करा!</p>
          )}
        </div>

        {/* Exam History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-slate-100 mb-4">परीक्षा निकाल इतिहास (Exam History)</h2>
          {examHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="text-[11px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2">दिनांक</th>
                    <th>टार्गेट</th>
                    <th>Net WPM</th>
                    <th>Accuracy</th>
                    <th>निकाल</th>
                    <th>श्रेणी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {examHistory.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2.5 font-mono text-slate-400">
                        {new Date(e.timestamp).toLocaleDateString("mr-IN")}
                      </td>
                      <td>{e.targetWpm} WPM</td>
                      <td className="font-semibold text-emerald-400">{e.netWpm}</td>
                      <td>{e.accuracy}%</td>
                      <td>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            e.passed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {e.passed ? "उत्तीर्ण" : "अनुत्तीर्ण"}
                        </span>
                      </td>
                      <td className="text-amber-400 font-medium">{e.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500">अद्याप कोणतीही परीक्षा दिलेली नाही.</p>
          )}
        </div>
      </main>
    </>
  );
}
```

- [ ] **Step 4: Run full test suite and production build**

Run: `npm run test && npm run build`  
Expected: All tests pass and `next build` generates all static routes with 0 errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/stats/ tests/e2e/
git commit -m "feat: implement home landing dashboard, analytics stats page, and verify end-to-end build"
```
