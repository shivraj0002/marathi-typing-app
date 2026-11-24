import { describe, it, expect, beforeEach } from "vitest";
import { STAGES, getNextLessonId } from "@/lib/curriculum/stages";
import { EXAM_PASSAGES_30_WPM, EXAM_PASSAGES_40_WPM } from "@/lib/curriculum/examPassages";
import { IN_SCRIPT_KEYS, translateKey, findKeyForChar } from "@/lib/inscript/keymap";
import { segmentGraphemes, compareGrapheme } from "@/lib/inscript/graphemes";
import { calculateMetrics, useTypingStore } from "@/lib/store/useTypingStore";
import { evaluateExamGrade } from "@/lib/exam/grading";
import { getTopWeakChars, generateClinicDrill } from "@/lib/clinic/drill";

describe("Marathi Typing App End-to-End Workflow Verification", () => {
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

  it("verifies full keymap translation across all stages", () => {
    const multiCharFocus = new Set([
      "full-keyboard",
      "महाराष्ट्र",
      "विद्यार्थी",
      "पुस्तके",
      "स्वातंत्र्य",
    ]);

    STAGES.forEach((stage) => {
      stage.lessons.forEach((lesson) => {
        lesson.keysFocus.forEach((char) => {
          if (multiCharFocus.has(char)) return;
          const found = Object.values(IN_SCRIPT_KEYS).some(
            (k) => k.normal === char || k.shifted === char
          );
          expect(found).toBe(true);

          const mapping = findKeyForChar(char);
          expect(mapping).not.toBeNull();
          if (mapping) {
            expect(translateKey(mapping.code, mapping.shift)).toBe(char);
          }
        });
      });
    });
  });

  it("verifies accurate scoring calculation and grading for exam thresholds", () => {
    const exam30 = calculateMetrics({ charCount: 1050, mistakes: 5, durationSeconds: 420 });
    expect(exam30.grossWpm).toBe(30);
    expect(exam30.netWpm).toBe(25);
    expect(exam30.accuracy).toBeCloseTo(99.52, 2);

    const failEval = evaluateExamGrade(exam30.netWpm, exam30.accuracy, 30);
    expect(failEval).toEqual({ passed: false, grade: "Fail" });

    const exam40 = calculateMetrics({ charCount: 1575, mistakes: 0, durationSeconds: 420 });
    expect(exam40.grossWpm).toBe(45);
    expect(exam40.netWpm).toBe(45);
    expect(exam40.accuracy).toBe(100);
    expect(evaluateExamGrade(exam40.netWpm, exam40.accuracy, 40)).toEqual({
      passed: true,
      grade: "Distinction",
    });

    expect(EXAM_PASSAGES_30_WPM.length).toBeGreaterThanOrEqual(2);
    expect(EXAM_PASSAGES_40_WPM.length).toBeGreaterThanOrEqual(2);
  });

  it("completes academy -> weak key clinic -> exam -> stats reset workflow", () => {
    const store = useTypingStore.getState();

    // 1. Complete first lesson and unlock the next one
    const firstLesson = STAGES[0].lessons[0];
    const graphemes = segmentGraphemes(firstLesson.targetText);
    expect(graphemes.length).toBeGreaterThan(0);
    expect(compareGrapheme(graphemes[0], graphemes[0])).toBe(true);

    store.recordLessonScore({
      lessonId: firstLesson.id,
      bestWpm: 20,
      bestAccuracy: 98,
      completedAt: "2026-11-24T12:00:00Z",
    });
    const nextId = getNextLessonId(firstLesson.id);
    expect(nextId).toBe("stage-1-lesson-2");
    if (nextId) store.unlockLesson(nextId);

    // 2. Record keystrokes and feed Weak Key Clinic
    store.recordKeyStroke("ळ", false);
    store.recordKeyStroke("ळ", false);
    store.recordKeyStroke("ण", false);
    store.recordKeyStroke("क", true);

    const weakKeys = useTypingStore.getState().weakKeys;
    const topWeak = getTopWeakChars(weakKeys, 5);
    expect(topWeak).toEqual(["ळ", "ण"]);

    const drill = generateClinicDrill(topWeak, 10);
    expect(drill.split(" ").length).toBe(10);
    expect(drill).toContain("ळ");

    // 3. Record an exam attempt
    const evalResult = evaluateExamGrade(32, 96, 30);
    store.recordExamResult({
      id: "e2e-exam-1",
      targetWpm: 30,
      grossWpm: 34,
      netWpm: 32,
      accuracy: 96,
      passed: evalResult.passed,
      grade: evalResult.grade,
      timestamp: "2026-11-24T12:10:00Z",
    });

    const beforeReset = useTypingStore.getState();
    expect(Object.keys(beforeReset.lessonScores)).toHaveLength(1);
    expect(beforeReset.unlockedLessons).toContain("stage-1-lesson-2");
    expect(beforeReset.examHistory).toHaveLength(1);

    // 4. Reset progress from Stats workflow
    beforeReset.resetProgress();
    const afterReset = useTypingStore.getState();
    expect(afterReset.lessonScores).toEqual({});
    expect(afterReset.examHistory).toEqual([]);
    expect(afterReset.weakKeys).toEqual({});
    expect(afterReset.unlockedLessons).toEqual(["stage-1-lesson-1"]);
  });
});
