export type FingerZone =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "thumb"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky";

export interface KeyDefinition {
  code: string;
  qwerty: string;
  normal: string;
  shifted: string;
  finger: FingerZone;
}

export const IN_SCRIPT_KEYS: Record<string, KeyDefinition> = {
  // Number row
  Backquote: { code: "Backquote", qwerty: "`", normal: "`", shifted: "~", finger: "left-pinky" },
  Digit1: { code: "Digit1", qwerty: "1", normal: "१", shifted: "ऍ", finger: "left-pinky" },
  Digit2: { code: "Digit2", qwerty: "2", normal: "२", shifted: "ॅ", finger: "left-ring" },
  Digit3: { code: "Digit3", qwerty: "3", normal: "३", shifted: "्र", finger: "left-middle" },
  Digit4: { code: "Digit4", qwerty: "4", normal: "४", shifted: "र्", finger: "left-index" },
  Digit5: { code: "Digit5", qwerty: "5", normal: "५", shifted: "ज्ञ", finger: "left-index" },
  Digit6: { code: "Digit6", qwerty: "6", normal: "६", shifted: "त्र", finger: "right-index" },
  Digit7: { code: "Digit7", qwerty: "7", normal: "७", shifted: "क्ष", finger: "right-index" },
  Digit8: { code: "Digit8", qwerty: "8", normal: "८", shifted: "श्र", finger: "right-middle" },
  Digit9: { code: "Digit9", qwerty: "9", normal: "९", shifted: "(", finger: "right-ring" },
  Digit0: { code: "Digit0", qwerty: "0", normal: "०", shifted: ")", finger: "right-pinky" },
  Minus: { code: "Minus", qwerty: "-", normal: "-", shifted: "ः", finger: "right-pinky" },
  Equal: { code: "Equal", qwerty: "=", normal: "ृ", shifted: "ऋ", finger: "right-pinky" },

  // Top row
  KeyQ: { code: "KeyQ", qwerty: "q", normal: "ौ", shifted: "औ", finger: "left-pinky" },
  KeyW: { code: "KeyW", qwerty: "w", normal: "ै", shifted: "ऐ", finger: "left-ring" },
  KeyE: { code: "KeyE", qwerty: "e", normal: "ा", shifted: "आ", finger: "left-middle" },
  KeyR: { code: "KeyR", qwerty: "r", normal: "ी", shifted: "ई", finger: "left-index" },
  KeyT: { code: "KeyT", qwerty: "t", normal: "ू", shifted: "ऊ", finger: "left-index" },
  KeyY: { code: "KeyY", qwerty: "y", normal: "ब", shifted: "भ", finger: "right-index" },
  KeyU: { code: "KeyU", qwerty: "u", normal: "ह", shifted: "ङ", finger: "right-index" },
  KeyI: { code: "KeyI", qwerty: "i", normal: "ग", shifted: "घ", finger: "right-middle" },
  KeyO: { code: "KeyO", qwerty: "o", normal: "द", shifted: "ध", finger: "right-ring" },
  KeyP: { code: "KeyP", qwerty: "p", normal: "ज", shifted: "झ", finger: "right-pinky" },
  BracketLeft: { code: "BracketLeft", qwerty: "[", normal: "ड", shifted: "ढ", finger: "right-pinky" },
  BracketRight: { code: "BracketRight", qwerty: "]", normal: "़", shifted: "ञ", finger: "right-pinky" },
  Backslash: { code: "Backslash", qwerty: "\\", normal: "ॉ", shifted: "ऑ", finger: "right-pinky" },

  // Home row
  KeyA: { code: "KeyA", qwerty: "a", normal: "ो", shifted: "ओ", finger: "left-pinky" },
  KeyS: { code: "KeyS", qwerty: "s", normal: "े", shifted: "ए", finger: "left-ring" },
  KeyD: { code: "KeyD", qwerty: "d", normal: "्", shifted: "अ", finger: "left-middle" },
  KeyF: { code: "KeyF", qwerty: "f", normal: "ि", shifted: "इ", finger: "left-index" },
  KeyG: { code: "KeyG", qwerty: "g", normal: "ु", shifted: "उ", finger: "left-index" },
  KeyH: { code: "KeyH", qwerty: "h", normal: "प", shifted: "फ", finger: "right-index" },
  KeyJ: { code: "KeyJ", qwerty: "j", normal: "र", shifted: "ऱ", finger: "right-index" },
  KeyK: { code: "KeyK", qwerty: "k", normal: "क", shifted: "ख", finger: "right-middle" },
  KeyL: { code: "KeyL", qwerty: "l", normal: "त", shifted: "थ", finger: "right-ring" },
  Semicolon: { code: "Semicolon", qwerty: ";", normal: "च", shifted: "छ", finger: "right-pinky" },
  Quote: { code: "Quote", qwerty: "'", normal: "ट", shifted: "ठ", finger: "right-pinky" },

  // Bottom row
  KeyZ: { code: "KeyZ", qwerty: "z", normal: "ॆ", shifted: "ऒ", finger: "left-pinky" },
  KeyX: { code: "KeyX", qwerty: "x", normal: "ं", shifted: "ँ", finger: "left-ring" },
  KeyC: { code: "KeyC", qwerty: "c", normal: "म", shifted: "ण", finger: "left-middle" },
  KeyV: { code: "KeyV", qwerty: "v", normal: "न", shifted: "ऩ", finger: "left-index" },
  KeyB: { code: "KeyB", qwerty: "b", normal: "व", shifted: "ऴ", finger: "left-index" },
  KeyN: { code: "KeyN", qwerty: "n", normal: "ल", shifted: "ळ", finger: "right-index" },
  KeyM: { code: "KeyM", qwerty: "m", normal: "स", shifted: "श", finger: "right-index" },
  Comma: { code: "Comma", qwerty: ",", normal: ",", shifted: "ष", finger: "right-middle" },
  Period: { code: "Period", qwerty: ".", normal: ".", shifted: "।", finger: "right-ring" },
  Slash: { code: "Slash", qwerty: "/", normal: "य", shifted: "?", finger: "right-pinky" },
  Space: { code: "Space", qwerty: " ", normal: " ", shifted: " ", finger: "thumb" },
};

/** Maps each physical KeyboardEvent.code to its assigned touch-typing finger zone. */
export const KEY_FINGER_MAP: Record<string, FingerZone> = Object.fromEntries(
  Object.entries(IN_SCRIPT_KEYS).map(([code, def]) => [code, def.finger])
);

/** Translates a physical key code and shift state into its Marathi InScript character. */
export function translateKey(code: string, shift: boolean): string | null {
  const definition = IN_SCRIPT_KEYS[code];
  if (!definition) return null;
  return shift ? definition.shifted : definition.normal;
}

/** Finds the physical key code and shift state needed to produce a given character. */
export function findKeyForChar(char: string): { code: string; shift: boolean } | null {
  for (const [code, def] of Object.entries(IN_SCRIPT_KEYS)) {
    if (def.normal === char) return { code, shift: false };
    if (def.shifted === char) return { code, shift: true };
  }
  return null;
}
