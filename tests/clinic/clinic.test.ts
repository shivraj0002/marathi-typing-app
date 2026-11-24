import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { generateClinicDrill, getTopWeakChars, DEFAULT_CLINIC_DRILL } from "@/lib/clinic/drill";
import { useTypingStore } from "@/lib/store/useTypingStore";
import ClinicPage from "@/app/clinic/page";
import SprintPage from "@/app/sprint/page";

describe("Weak Key Clinic Generator", () => {
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

  it("generates drill containing targeted weak characters", () => {
    const weakChars = ["ळ", "ख", "ज्ञ"];
    const drill = generateClinicDrill(weakChars);
    expect(drill.length).toBeGreaterThan(15);
    expect(drill.split(" ")).toHaveLength(20);
    for (const char of weakChars) {
      expect(drill).toContain(char);
    }
  });

  it("returns default practice sentence when no weak keys exist", () => {
    expect(generateClinicDrill([])).toBe(DEFAULT_CLINIC_DRILL);
  });

  it("falls back to clinic word pool when weak characters have no word matches", () => {
    const drill = generateClinicDrill(["@"]);
    expect(drill.length).toBeGreaterThan(15);
    expect(drill.split(" ")).toHaveLength(20);
  });

  it("selects top 5 weakest characters sorted descending by error rate and ignores whitespace", () => {
    const top = getTopWeakChars({
      " ": { char: " ", missCount: 10, totalAttempts: 10 },
      क: { char: "क", missCount: 0, totalAttempts: 10 },
      ळ: { char: "ळ", missCount: 9, totalAttempts: 12 },
      ख: { char: "ख", missCount: 4, totalAttempts: 8 },
      ज्ञ: { char: "ज्ञ", missCount: 7, totalAttempts: 10 },
      ऋ: { char: "ऋ", missCount: 2, totalAttempts: 5 },
      झ: { char: "झ", missCount: 6, totalAttempts: 9 },
      ध: { char: "ध", missCount: 5, totalAttempts: 7 },
    });

    expect(top).toEqual(["ळ", "ध", "ज्ञ", "झ", "ख"]);
    expect(top).not.toContain(" ");
  });

  it("renders ClinicPage with hydration-safe SSR fallback even when weakKeys exist in store", () => {
    useTypingStore.setState({
      weakKeys: {
        ळ: { char: "ळ", missCount: 5, totalAttempts: 10 },
      },
    });
    const html = renderToStaticMarkup(React.createElement(ClinicPage));
    expect(html).toContain("वीक की क्लिनिक (Weak Key Clinic)");
    expect(html).toContain("उत्कृष्ट! अद्याप कोणतीही गंभीर चूक नोंदवलेली नाही.");
    expect(html).not.toContain("सध्याची कठीण अक्षरे:");
  });

  it("renders SprintPage with 15s, 30s, 60s, and 120s mode controls", () => {
    const html = renderToStaticMarkup(React.createElement(SprintPage));
    expect(html).toContain("स्पीड स्प्रिंट (Speed Sprint)");
    expect(html).toContain("15s");
    expect(html).toContain("30s");
    expect(html).toContain("60s");
    expect(html).toContain("120s");
  });
});
