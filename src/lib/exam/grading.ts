export type ExamGrade = "Distinction" | "First Class" | "Pass" | "Fail";

export interface ExamEvaluation {
  passed: boolean;
  grade: ExamGrade;
}

/**
 * Evaluates a GCC-TBC typing exam attempt against official speed and accuracy thresholds.
 */
export function evaluateExamGrade(
  netWpm: number,
  accuracy: number,
  targetWpm: number
): ExamEvaluation {
  if (accuracy < 85 || netWpm < targetWpm - 2) {
    return { passed: false, grade: "Fail" };
  }
  if (accuracy >= 95 && netWpm >= targetWpm + 5) {
    return { passed: true, grade: "Distinction" };
  }
  if (accuracy >= 90 && netWpm >= targetWpm) {
    return { passed: true, grade: "First Class" };
  }
  return { passed: true, grade: "Pass" };
}
