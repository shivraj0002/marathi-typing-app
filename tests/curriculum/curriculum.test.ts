import { describe, it, expect } from "vitest";
import { STAGES, getNextLessonId } from "@/lib/curriculum/stages";
import { COMMON_MARATHI_WORDS } from "@/lib/curriculum/words";
import { EXAM_PASSAGES_30_WPM, EXAM_PASSAGES_40_WPM } from "@/lib/curriculum/examPassages";

describe("Curriculum & Exam Dataset", () => {
  it("contains 6 complete stages with valid lesson data", () => {
    expect(STAGES.length).toBe(6);
    const seenIds = new Set<string>();
    STAGES.forEach((stage, index) => {
      expect(stage.id).toBe(index + 1);
      expect(stage.title).toBeTruthy();
      expect(stage.subtitle).toBeTruthy();
      expect(stage.lessons.length).toBeGreaterThanOrEqual(2);
      stage.lessons.forEach((lesson) => {
        expect(lesson.id).toBeTruthy();
        expect(seenIds.has(lesson.id)).toBe(false);
        seenIds.add(lesson.id);
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.title).toBeTruthy();
        expect(lesson.description).toBeTruthy();
        expect(lesson.keysFocus.length).toBeGreaterThan(0);
        expect(lesson.targetText.length).toBeGreaterThan(10);
        expect(lesson.minWpm).toBeGreaterThan(0);
        expect(lesson.minAccuracy).toBeGreaterThanOrEqual(90);
      });
    });
  });

  it("finds next lesson ID in sequence, across stages, and returns null at end or unknown", () => {
    expect(getNextLessonId("stage-1-lesson-1")).toBe("stage-1-lesson-2");
    expect(getNextLessonId("stage-1-lesson-3")).toBe("stage-2-lesson-1");
    expect(getNextLessonId("stage-6-lesson-2")).toBeNull();
    expect(getNextLessonId("non-existent-lesson")).toBeNull();
  });

  it("provides common Marathi words vocabulary list", () => {
    expect(COMMON_MARATHI_WORDS.length).toBeGreaterThanOrEqual(40);
    COMMON_MARATHI_WORDS.forEach((word) => {
      expect(word.trim().length).toBeGreaterThan(0);
    });
  });

  it("contains valid passages for 30 and 40 WPM exams", () => {
    expect(EXAM_PASSAGES_30_WPM.length).toBeGreaterThanOrEqual(2);
    expect(EXAM_PASSAGES_40_WPM.length).toBeGreaterThanOrEqual(2);
    expect(EXAM_PASSAGES_30_WPM[0].text.length).toBeGreaterThan(500);

    EXAM_PASSAGES_30_WPM.forEach((passage) => {
      expect(passage.targetWpm).toBe(30);
      expect(passage.durationMinutes).toBe(7);
      expect(passage.wordCount).toBeGreaterThan(0);
      expect(passage.text.length).toBeGreaterThan(400);
    });

    EXAM_PASSAGES_40_WPM.forEach((passage) => {
      expect(passage.targetWpm).toBe(40);
      expect(passage.durationMinutes).toBe(7);
      expect(passage.wordCount).toBeGreaterThan(0);
      expect(passage.text.length).toBeGreaterThan(400);
    });
  });
});
