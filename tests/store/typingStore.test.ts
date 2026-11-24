import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { calculateMetrics, useTypingStore } from "@/lib/store/useTypingStore";
import { soundEffects, playSound } from "@/lib/audio/soundEffects";

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
    expect(metrics.cpm).toBe(0);
  });

  it("clamps netWpm and accuracy at 0 when mistakes exceed characters or grossWpm", () => {
    const metrics = calculateMetrics({
      charCount: 10,
      mistakes: 15,
      durationSeconds: 60,
    });
    expect(metrics.grossWpm).toBe(2);
    expect(metrics.netWpm).toBe(0);
    expect(metrics.accuracy).toBe(0);
  });
});

describe("useTypingStore", () => {
  beforeEach(() => {
    useTypingStore.setState({
      unlockedLessons: ["stage-1-lesson-1"],
      lessonScores: {},
      examHistory: [],
      weakKeys: {},
      soundEnabled: true,
      theme: "dark",
    });
  });

  it("unlocks lessons without duplicating existing entries", () => {
    const { unlockLesson } = useTypingStore.getState();
    unlockLesson("stage-1-lesson-1");
    unlockLesson("stage-1-lesson-2");

    expect(useTypingStore.getState().unlockedLessons).toEqual([
      "stage-1-lesson-1",
      "stage-1-lesson-2",
    ]);
  });

  it("records lesson scores while preserving highest WPM and accuracy", () => {
    const { recordLessonScore } = useTypingStore.getState();
    recordLessonScore({
      lessonId: "stage-1-lesson-1",
      bestWpm: 25,
      bestAccuracy: 94,
      completedAt: "2026-11-24T10:00:00Z",
    });
    recordLessonScore({
      lessonId: "stage-1-lesson-1",
      bestWpm: 20,
      bestAccuracy: 98,
      completedAt: "2026-11-24T11:00:00Z",
    });

    const saved = useTypingStore.getState().lessonScores["stage-1-lesson-1"];
    expect(saved.bestWpm).toBe(25);
    expect(saved.bestAccuracy).toBe(98);
    expect(saved.completedAt).toBe("2026-11-24T11:00:00Z");
  });

  it("records exam history in reverse chronological order capped at 50 entries", () => {
    const { recordExamResult } = useTypingStore.getState();
    for (let i = 1; i <= 55; i++) {
      recordExamResult({
        id: `exam-${i}`,
        targetWpm: 30,
        grossWpm: 35,
        netWpm: 32,
        accuracy: 96,
        passed: true,
        grade: "First Class",
        timestamp: `2026-11-24T10:${String(i).padStart(2, "0")}:00Z`,
      });
    }

    const history = useTypingStore.getState().examHistory;
    expect(history).toHaveLength(50);
    expect(history[0].id).toBe("exam-55");
    expect(history[49].id).toBe("exam-6");
  });

  it("tracks keystroke mistakes and total attempts per character", () => {
    const { recordKeyStroke } = useTypingStore.getState();
    recordKeyStroke("क", true);
    recordKeyStroke("क", false);
    recordKeyStroke("क", false);

    expect(useTypingStore.getState().weakKeys["क"]).toEqual({
      char: "क",
      missCount: 2,
      totalAttempts: 3,
    });
  });

  it("toggles sound, sets theme, and resets progress without losing preferences", () => {
    const state = useTypingStore.getState();
    state.toggleSound();
    state.setTheme("light");
    state.unlockLesson("stage-1-lesson-2");
    state.recordKeyStroke("म", false);
    state.resetProgress();

    const updated = useTypingStore.getState();
    expect(updated.soundEnabled).toBe(false);
    expect(updated.theme).toBe("light");
    expect(updated.unlockedLessons).toEqual(["stage-1-lesson-1"]);
    expect(updated.lessonScores).toEqual({});
    expect(updated.examHistory).toEqual([]);
    expect(updated.weakKeys).toEqual({});
  });
});

describe("soundEffects", () => {
  const originalWindow = globalThis.window;

  afterEach(() => {
    if (originalWindow === undefined) {
      delete (globalThis as { window?: unknown }).window;
    } else {
      globalThis.window = originalWindow;
    }
    vi.restoreAllMocks();
  });

  it("handles non-browser environments gracefully without throwing", () => {
    expect(() => soundEffects.playKeyClick()).not.toThrow();
    expect(() => soundEffects.playError()).not.toThrow();
    expect(() => soundEffects.playSuccess()).not.toThrow();
    expect(() => playSound("click")).not.toThrow();
    expect(() => playSound("error")).not.toThrow();
    expect(() => playSound("complete")).not.toThrow();
    expect(() => playSound("milestone")).not.toThrow();
  });

  it("creates oscillator and gain nodes when AudioContext is available", () => {
    const start = vi.fn();
    const stop = vi.fn();
    const connect = vi.fn();
    const osc = {
      type: "sine",
      frequency: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect,
      start,
      stop,
    };
    const gain = {
      gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
    const mockCtx = {
      state: "running",
      currentTime: 1,
      destination: {},
      resume: vi.fn(),
      createOscillator: vi.fn(() => osc),
      createGain: vi.fn(() => gain),
    };
    const AudioContextMock = vi.fn(() => mockCtx);
    (globalThis as unknown as { window: { AudioContext: unknown } }).window = {
      AudioContext: AudioContextMock,
    };

    playSound("click");
    expect(mockCtx.createOscillator).toHaveBeenCalledTimes(1);
    expect(osc.type).toBe("sine");

    playSound("error");
    expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
    expect(osc.type).toBe("sawtooth");

    playSound("complete");
    expect(mockCtx.createOscillator).toHaveBeenCalledTimes(6);
  });
});
