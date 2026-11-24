import { describe, it, expect } from "vitest";
import {
  translateKey,
  findKeyForChar,
  KEY_FINGER_MAP,
  IN_SCRIPT_KEYS,
} from "@/lib/inscript/keymap";

describe("InScript Keymap Translation", () => {
  it("translates home row right hand consonants correctly", () => {
    expect(translateKey("KeyH", false)).toBe("प");
    expect(translateKey("KeyJ", false)).toBe("र");
    expect(translateKey("KeyK", false)).toBe("क");
    expect(translateKey("KeyL", false)).toBe("त");
    expect(translateKey("Semicolon", false)).toBe("च");
  });

  it("translates home row left hand matras correctly", () => {
    expect(translateKey("KeyA", false)).toBe("ो");
    expect(translateKey("KeyS", false)).toBe("े");
    expect(translateKey("KeyD", false)).toBe("्"); // Halant
    expect(translateKey("KeyF", false)).toBe("ि");
    expect(translateKey("KeyG", false)).toBe("ु");
  });

  it("translates shift variants correctly", () => {
    expect(translateKey("KeyK", true)).toBe("ख");
    expect(translateKey("KeyD", true)).toBe("अ");
    expect(translateKey("KeyE", true)).toBe("आ");
    expect(translateKey("KeyN", true)).toBe("ळ"); // Crucial for Marathi!
    expect(translateKey("KeyC", true)).toBe("ण");
  });

  it("returns null for non-mapped control keys", () => {
    expect(translateKey("F1", false)).toBeNull();
    expect(translateKey("AltLeft", false)).toBeNull();
  });

  it("finds the key code and shift state for a Devanagari character", () => {
    expect(findKeyForChar("क")).toEqual({ code: "KeyK", shift: false });
    expect(findKeyForChar("ळ")).toEqual({ code: "KeyN", shift: true });
    expect(findKeyForChar(" ")).toEqual({ code: "Space", shift: false });
    expect(findKeyForChar("€")).toBeNull();
  });

  it("provides finger zone assignments for all mapped keys", () => {
    expect(KEY_FINGER_MAP["KeyK"]).toBe("right-middle");
    expect(KEY_FINGER_MAP["KeyF"]).toBe("left-index");
    expect(KEY_FINGER_MAP["Space"]).toBe("thumb");
    expect(Object.keys(KEY_FINGER_MAP).length).toBe(
      Object.keys(IN_SCRIPT_KEYS).length
    );
  });
});
