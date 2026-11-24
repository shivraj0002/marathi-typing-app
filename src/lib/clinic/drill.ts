import { COMMON_MARATHI_WORDS } from "@/lib/curriculum/words";
import type { KeyMistakeRecord } from "@/lib/store/useTypingStore";

export const DEFAULT_CLINIC_DRILL =
  "महाराष्ट्र राज्य विद्यार्थी अभ्यासक्रम पुस्तक राष्ट्रीय स्वातंत्र्य ज्ञान परीक्षा";

const CURATED_CLINIC_WORDS: string[] = [
  "कमळ", "बाळ", "पाणी", "शाळा", "ज्ञान", "विज्ञान", "मित्र", "क्षेत्र", "धर्म", "कर्म",
  "खत", "घर", "झाड", "ऋषी", "ऋतु", "श्रद्धा", "आश्रम", "कौतुक", "धनुष्य", "भाषा",
];

const CLINIC_WORD_BANK: string[] = Array.from(
  new Set([...CURATED_CLINIC_WORDS, ...COMMON_MARATHI_WORDS])
);

function shuffleWords(items: string[]): string[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Returns the top `limit` most frequently missed characters sorted descending by missCount.
 */
export function getTopWeakChars(
  weakKeys: Record<string, KeyMistakeRecord>,
  limit = 5
): string[] {
  return Object.values(weakKeys)
    .filter((k) => k.missCount > 0)
    .sort((a, b) => b.missCount - a.missCount || b.totalAttempts - a.totalAttempts)
    .slice(0, limit)
    .map((k) => k.char);
}

/**
 * Generates a targeted Marathi practice drill emphasizing the provided weak characters.
 */
export function generateClinicDrill(weakChars: string[], wordCount = 20): string {
  const cleanWeak = weakChars.map((c) => c.trim()).filter((c) => c.length > 0);
  if (cleanWeak.length === 0) {
    return DEFAULT_CLINIC_DRILL;
  }

  const matched = CLINIC_WORD_BANK.filter((w) => cleanWeak.some((c) => w.includes(c)));
  if (matched.length === 0) {
    const fallbackPool = shuffleWords(CLINIC_WORD_BANK);
    const drill: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      drill.push(fallbackPool[i % fallbackPool.length]);
    }
    return drill.join(" ");
  }

  // Ensure every weak character that has at least one matching word is represented in the drill.
  const guaranteed: string[] = [];
  const used = new Set<string>();
  for (const char of cleanWeak) {
    const candidates = shuffleWords(matched.filter((w) => w.includes(char)));
    const pick = candidates.find((w) => !used.has(w)) ?? candidates[0];
    if (pick && !used.has(pick)) {
      guaranteed.push(pick);
      used.add(pick);
    }
  }

  const remaining = shuffleWords(matched.filter((w) => !used.has(w)));
  const orderedPool = [...guaranteed, ...remaining];

  const drill: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    drill.push(orderedPool[i % orderedPool.length]);
  }
  return shuffleWords(drill).join(" ");
}
