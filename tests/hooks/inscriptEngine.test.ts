import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { segmentGraphemes } from "@/lib/inscript/graphemes";
import { findKeyForChar } from "@/lib/inscript/keymap";
import {
  getExpectedTargetChar,
  matchGraphemeKeystroke,
} from "@/hooks/useInscriptEngine";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { ResultModal } from "@/components/typing/ResultModal";

describe("InScript Typing Engine Logic", () => {
  it("segments target text into matchable grapheme units", () => {
    const text = "करून";
    const graphemes = segmentGraphemes(text);
    expect(graphemes).toEqual(["क", "रू", "न"]);
  });

  it("resolves sequential InScript key hints for multi-codepoint graphemes", () => {
    const grapheme = "रू"; // र + ू
    const firstHint = getExpectedTargetChar(grapheme);
    expect(firstHint).toBe("र");
    expect(findKeyForChar(firstHint!)).toEqual({ code: "KeyJ", shift: false });

    const firstMatch = matchGraphemeKeystroke(grapheme, "र");
    expect(firstMatch).toEqual({ isCorrect: true, consumedLength: 1 });

    const remaining = grapheme.slice(firstMatch.consumedLength);
    const secondHint = getExpectedTargetChar(remaining);
    expect(secondHint).toBe("ू");
    expect(findKeyForChar(secondHint!)).toEqual({ code: "KeyT", shift: false });

    const secondMatch = matchGraphemeKeystroke(remaining, "ू");
    expect(secondMatch).toEqual({ isCorrect: true, consumedLength: 1 });
  });

  it("supports both direct ligature keys and halant-composed sequences for conjuncts", () => {
    const grapheme = "त्रि"; // त + ् + र + ि
    expect(getExpectedTargetChar(grapheme)).toBe("त्र");
    expect(findKeyForChar("त्र")).toEqual({ code: "Digit6", shift: true });

    // Direct Shift+6 ligature input consumes त्र (3 code units) leaving ि
    const directMatch = matchGraphemeKeystroke(grapheme, "त्र");
    expect(directMatch).toEqual({ isCorrect: true, consumedLength: 3 });
    expect(getExpectedTargetChar(grapheme.slice(directMatch.consumedLength))).toBe("ि");

    // Manual त + ् + र composition also matches cleanly
    const step1 = matchGraphemeKeystroke(grapheme, "त");
    expect(step1).toEqual({ isCorrect: true, consumedLength: 1 });

    // Mismatch advances by expected token length
    const wrongMatch = matchGraphemeKeystroke("क", "प");
    expect(wrongMatch).toEqual({ isCorrect: false, consumedLength: 1 });
  });

  it("renders TypingArea with correct, incorrect, and active caret classes", () => {
    const html = renderToStaticMarkup(
      React.createElement(TypingArea, {
        targetChars: ["क", "रू", "न"],
        currentIndex: 2,
        typedHistory: [
          { char: "क", isCorrect: true },
          { char: "रू", isCorrect: false },
        ],
      })
    );
    expect(html).toContain("text-emerald-400 font-medium");
    expect(html).toContain("text-rose-500 bg-rose-950/40");
    expect(html).toContain("ring-1 ring-emerald-400");
    expect(html).toContain("करून".slice(0, 1));
    expect(html).toContain("रू");
    expect(html).toContain("न");
  });

  it("renders LiveStatsBar in elapsed and countdown timer modes", () => {
    const metrics = {
      grossWpm: 32.5,
      netWpm: 30.5,
      cpm: 162,
      accuracy: 96.5,
      mistakes: 2,
      charCount: 100,
      timeSeconds: 75,
    };

    const elapsedHtml = renderToStaticMarkup(
      React.createElement(LiveStatsBar, { metrics, elapsedSeconds: 75 })
    );
    expect(elapsedHtml).toContain("32.5");
    expect(elapsedHtml).toContain("96.5%");
    expect(elapsedHtml).toContain("1:15");
    expect(elapsedHtml).toContain(">2<");

    const countdownHtml = renderToStaticMarkup(
      React.createElement(LiveStatsBar, {
        metrics,
        elapsedSeconds: 5,
        timeLimit: 60,
      })
    );
    expect(countdownHtml).toContain("0:55");
  });

  it("renders ResultModal conditionally and hides Next button when failed", () => {
    const metrics = {
      grossWpm: 24,
      netWpm: 22,
      cpm: 120,
      accuracy: 92,
      mistakes: 2,
      charCount: 50,
      timeSeconds: 25,
    };

    const closedHtml = renderToStaticMarkup(
      React.createElement(ResultModal, {
        isOpen: false,
        metrics,
        onRetry: () => {},
      })
    );
    expect(closedHtml).toBe("");

    const failedHtml = renderToStaticMarkup(
      React.createElement(ResultModal, {
        isOpen: true,
        metrics,
        isPassed: false,
        onRetry: () => {},
        onNext: () => {},
      })
    );
    expect(failedHtml).toContain("पुन्हा करा (Retry)");
    expect(failedHtml).not.toContain("पुढे चला (Next)");
    expect(failedHtml).toContain("९५% पेक्षा जास्त अचूकता मिळवा");

    const passedHtml = renderToStaticMarkup(
      React.createElement(ResultModal, {
        isOpen: true,
        metrics: { ...metrics, accuracy: 98 },
        isPassed: true,
        onRetry: () => {},
        onNext: () => {},
      })
    );
    expect(passedHtml).toContain("पुन्हा करा (Retry)");
    expect(passedHtml).toContain("पुढे चला (Next)");
    expect(passedHtml).toContain("24");
    expect(passedHtml).toContain("22");
    expect(passedHtml).toContain("98%");
    expect(passedHtml).toContain("पुढील टप्प्यासाठी पात्र आहात");

    const customSubtitleHtml = renderToStaticMarkup(
      React.createElement(ResultModal, {
        isOpen: true,
        metrics: { ...metrics, accuracy: 98 },
        title: "स्प्रिंट पूर्ण झाला! (Sprint Complete)",
        subtitle: "आपला स्प्रिंट निकाल खालीलप्रमाणे आहे.",
        onRetry: () => {},
      })
    );
    expect(customSubtitleHtml).toContain("आपला स्प्रिंट निकाल खालीलप्रमाणे आहे.");
    expect(customSubtitleHtml).not.toContain("पुढील टप्प्यासाठी पात्र आहात");
  });
});
