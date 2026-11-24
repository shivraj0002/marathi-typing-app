import { create } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export interface TypingMetrics {
  grossWpm: number;
  netWpm: number;
  cpm: number;
  accuracy: number;
  mistakes: number;
  charCount: number;
  timeSeconds: number;
}

/**
 * Calculates Gross WPM, Net WPM, CPM, and accuracy from raw typing counts and elapsed time.
 */
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
    return {
      grossWpm: 0,
      netWpm: 0,
      cpm: 0,
      accuracy: 100,
      mistakes,
      charCount,
      timeSeconds: durationSeconds,
    };
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
  passed: boolean;
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
          const passed = Boolean(current?.passed || score.passed);
          return {
            lessonScores: {
              ...state.lessonScores,
              [score.lessonId]: { ...score, bestWpm, bestAccuracy, passed },
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
      storage: createJSONStorage(() =>
        typeof localStorage !== "undefined" ? localStorage : noopStorage
      ),
    }
  )
);
