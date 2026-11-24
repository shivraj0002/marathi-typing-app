/** Normalizes Devanagari text to Unicode NFC form for consistent comparison and segmentation. */
export function normalizeDevanagari(text: string): string {
  return text.normalize("NFC");
}

/** Splits Devanagari text into visual grapheme clusters (akshar/conjunct units). */
export function segmentGraphemes(text: string): string[] {
  const normalized = normalizeDevanagari(text);
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("mr", { granularity: "grapheme" });
    return Array.from(segmenter.segment(normalized), (s) => s.segment);
  }
  // Fallback regex for Devanagari graphemes (consonant + virama clusters + vowel signs)
  const regex =
    /[\u0900-\u097F][\u093E-\u094F\u0951-\u0954\u0901-\u0903\u093C]*(?:\u094D[\u0900-\u097F][\u093E-\u094F\u0951-\u0954\u0901-\u0903\u093C]*)*|[^\u0900-\u097F]/g;
  return normalized.match(regex) || Array.from(normalized);
}

/** Checks whether a character is the Devanagari halant (virama, U+094D). */
export function isDevanagariHalant(char: string): boolean {
  return char === "्";
}

/** Alias for isDevanagariHalant matching the shared InScript module interface. */
export const isHalant = isDevanagariHalant;

/** Compares two Devanagari graphemes after NFC normalization. */
export function compareGrapheme(typed: string, expected: string): boolean {
  return normalizeDevanagari(typed) === normalizeDevanagari(expected);
}
