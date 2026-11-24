import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { STAGES, getNextLessonId } from "@/lib/curriculum/stages";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { Header } from "@/components/common/Header";
import AcademyPage from "@/app/academy/page";

describe("Academy Progression Logic", () => {
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

  it("determines pass criteria: accuracy >= 95% and speed >= minWpm", () => {
    const isPassed = (accuracy: number, wpm: number, minWpm: number) =>
      accuracy >= 95 && wpm >= minWpm;

    expect(isPassed(96, 16, 12)).toBe(true);
    expect(isPassed(95, 12, 12)).toBe(true);
    expect(isPassed(94.9, 25, 12)).toBe(false);
    expect(isPassed(98, 10, 12)).toBe(false);
  });

  it("unlocks the next lesson only when pass criteria are met and handles stage transitions", () => {
    const lesson1 = STAGES[0].lessons[0];
    const evaluateCompletion = (lessonId: string, accuracy: number, grossWpm: number) => {
      const lesson = STAGES.flatMap((s) => s.lessons).find((l) => l.id === lessonId)!;
      const passed = accuracy >= lesson.minAccuracy && grossWpm >= lesson.minWpm;
      useTypingStore.getState().recordLessonScore({
        lessonId: lesson.id,
        bestWpm: grossWpm,
        bestAccuracy: accuracy,
        completedAt: "2026-11-24T12:00:00Z",
      });
      if (passed) {
        const nextId = getNextLessonId(lesson.id);
        if (nextId) useTypingStore.getState().unlockLesson(nextId);
      }
      return passed;
    };

    // Failing accuracy keeps stage-1-lesson-2 locked
    expect(evaluateCompletion(lesson1.id, 92, 20)).toBe(false);
    expect(useTypingStore.getState().unlockedLessons).toEqual(["stage-1-lesson-1"]);

    // Passing unlocks stage-1-lesson-2 and persists best score
    expect(evaluateCompletion(lesson1.id, 96, 15)).toBe(true);
    expect(useTypingStore.getState().unlockedLessons).toEqual([
      "stage-1-lesson-1",
      "stage-1-lesson-2",
    ]);
    expect(useTypingStore.getState().lessonScores[lesson1.id]).toMatchObject({
      bestWpm: 20,
      bestAccuracy: 96,
    });

    // Crossing stage boundary: stage-1-lesson-3 -> stage-2-lesson-1
    expect(evaluateCompletion("stage-1-lesson-3", 97, 18)).toBe(true);
    expect(useTypingStore.getState().unlockedLessons).toContain("stage-2-lesson-1");
  });

  it("renders Header with all navigation routes and sound control", () => {
    const html = renderToStaticMarkup(React.createElement(Header));
    expect(html).toContain("मराठी टायपिंग");
    expect(html).toContain("InScript Academy");
    expect(html).toContain("/academy");
    expect(html).toContain("/sprint");
    expect(html).toContain("/exam");
    expect(html).toContain("/clinic");
    expect(html).toContain("/stats");
    expect(html).toContain("Mute Sound");
  });

  it("renders AcademyPage with all 6 stages, unlocked first lesson, and locked subsequent lessons", () => {
    const html = renderToStaticMarkup(React.createElement(AcademyPage));
    expect(html).toContain("मराठी टायपिंग अभ्यासक्रम");
    expect(html).toContain("Stage 1: Home Row Foundations");
    expect(html).toContain("Stage 6: Real Passages &amp; Flow");
    expect(html).toContain("/academy/stage-1-lesson-1");
    expect(html).not.toContain("/academy/stage-1-lesson-2");
    expect(html).toContain("सुरू करा");
    expect(html).toContain("लॉक केलेले");
  });
});
