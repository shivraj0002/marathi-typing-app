import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { evaluateExamGrade } from "@/lib/exam/grading";
import { ExamCertificate } from "@/components/exam/ExamCertificate";
import ExamPage from "@/app/exam/page";
import { EXAM_PASSAGES_30_WPM, EXAM_PASSAGES_40_WPM } from "@/lib/curriculum/examPassages";

describe("GCC-TBC Grading Standard", () => {
  it("awards Distinction for speed >= target + 5 and accuracy >= 95%", () => {
    expect(evaluateExamGrade(36, 96, 30)).toEqual({
      passed: true,
      grade: "Distinction",
    });
    expect(evaluateExamGrade(45, 95, 40)).toEqual({
      passed: true,
      grade: "Distinction",
    });
  });

  it("awards First Class for speed >= target and accuracy >= 90%", () => {
    expect(evaluateExamGrade(30, 90, 30)).toEqual({
      passed: true,
      grade: "First Class",
    });
    expect(evaluateExamGrade(44, 98, 40)).toEqual({
      passed: true,
      grade: "First Class",
    });
    expect(evaluateExamGrade(38, 94.5, 30)).toEqual({
      passed: true,
      grade: "First Class",
    });
  });

  it("awards Pass when accuracy >= 85% and netWpm >= target - 2", () => {
    expect(evaluateExamGrade(28, 85, 30)).toEqual({
      passed: true,
      grade: "Pass",
    });
    expect(evaluateExamGrade(38, 89, 40)).toEqual({
      passed: true,
      grade: "Pass",
    });
    expect(evaluateExamGrade(35, 88, 30)).toEqual({
      passed: true,
      grade: "Pass",
    });
  });

  it("fails when accuracy is below 85%", () => {
    expect(evaluateExamGrade(38, 83, 30)).toEqual({
      passed: false,
      grade: "Fail",
    });
    expect(evaluateExamGrade(50, 84.9, 40)).toEqual({
      passed: false,
      grade: "Fail",
    });
  });

  it("fails when net WPM is below target - 2", () => {
    expect(evaluateExamGrade(27.9, 98, 30)).toEqual({
      passed: false,
      grade: "Fail",
    });
    expect(evaluateExamGrade(37, 100, 40)).toEqual({
      passed: false,
      grade: "Fail",
    });
  });
});

describe("ExamCertificate & ExamPage", () => {
  it("renders ExamCertificate with candidate details, scores, and print controls", () => {
    const html = renderToStaticMarkup(
      React.createElement(ExamCertificate, {
        candidateName: "राहुल प्रकाश पाटील",
        targetWpm: 30,
        grossWpm: 38,
        netWpm: 36,
        accuracy: 96,
        grade: "Distinction",
        date: "24/11/2026",
        onClose: () => {},
      })
    );

    expect(html).toContain("प्रमाणपत्र (CERTIFICATE OF PROFICIENCY)");
    expect(html).toContain("राहुल प्रकाश पाटील");
    expect(html).toContain("30 शब्द प्रति मिनिट");
    expect(html).toContain("38");
    expect(html).toContain("36");
    expect(html).toContain("96%");
    expect(html).toContain("Distinction");
    expect(html).toContain("24/11/2026");
    expect(html).toContain("प्रमाणपत्र मुद्रित करा (Print)");
  });

  it("falls back to default honorific when candidateName is blank", () => {
    const html = renderToStaticMarkup(
      React.createElement(ExamCertificate, {
        candidateName: "   ",
        targetWpm: 40,
        grossWpm: 42,
        netWpm: 40,
        accuracy: 92,
        grade: "First Class",
        date: "24/11/2026",
        onClose: () => {},
      })
    );

    expect(html).toContain("माननीय विद्यार्थी");
    expect(html).toContain("40 शब्द प्रति मिनिट");
  });

  it("renders ExamPage registration form with speed tiers, passages, and rules", () => {
    const html = renderToStaticMarkup(React.createElement(ExamPage));
    expect(html).toContain("GCC-TBC शासकीय परीक्षा सिम्युलेटर");
    expect(html).toContain("३० शब्द/मिनिट (30 WPM)");
    expect(html).toContain("४० शब्द/मिनिट (40 WPM)");
    expect(html).toContain(EXAM_PASSAGES_30_WPM[0].title);
    expect(html).toContain(EXAM_PASSAGES_30_WPM[1].title);
    expect(EXAM_PASSAGES_40_WPM.length).toBeGreaterThanOrEqual(2);
    expect(html).toContain("विद्यार्थ्याचे पूर्ण नाव (Candidate Name):");
    expect(html).toContain("परीक्षा सुरू करा (Start Exam)");
  });
});
