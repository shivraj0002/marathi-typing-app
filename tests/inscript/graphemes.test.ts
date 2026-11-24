import { describe, it, expect } from "vitest";
import {
  segmentGraphemes,
  normalizeDevanagari,
  isDevanagariHalant,
  isHalant,
  compareGrapheme,
} from "@/lib/inscript/graphemes";
import { JODNIKSHAR_RULES } from "@/lib/inscript/conjuncts";

describe("Devanagari Grapheme Normalization & Segmentation", () => {
  it("normalizes Devanagari text using NFC", () => {
    const raw = "महाराष्ट्र";
    expect(normalizeDevanagari(raw)).toBe(raw.normalize("NFC"));
    // Decomposed NFD nukta sequence should normalize to NFC
    const nfd = "\u0915\u093C"; // क + ़
    expect(normalizeDevanagari(nfd)).toBe(nfd.normalize("NFC"));
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

  it("identifies Devanagari halant (virama)", () => {
    expect(isDevanagariHalant("्")).toBe(true);
    expect(isHalant("्")).toBe(true);
    expect(isHalant("क")).toBe(false);
    expect(isHalant("")).toBe(false);
  });

  it("compares graphemes after NFC normalization", () => {
    expect(compareGrapheme("क्ष", "क्ष")).toBe(true);
    expect(compareGrapheme("\u0915\u093C", "\u0958")).toBe(true); // क + nukta == क़
    expect(compareGrapheme("क", "ख")).toBe(false);
  });

  it("defines standard Marathi jodnikshar conjunct rules", () => {
    expect(JODNIKSHAR_RULES["क+्+ष"]).toBe("क्ष");
    expect(JODNIKSHAR_RULES["ज+्+ञ"]).toBe("ज्ञ");
    expect(JODNIKSHAR_RULES["त+्+र"]).toBe("त्र");
    expect(JODNIKSHAR_RULES["श+्+र"]).toBe("श्र");
  });
});
