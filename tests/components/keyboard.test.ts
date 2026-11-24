import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { findKeyForChar, IN_SCRIPT_KEYS } from "@/lib/inscript/keymap";
import { VirtualKeyboard, KEYBOARD_ROWS } from "@/components/keyboard/VirtualKeyboard";
import { HandsGuide } from "@/components/keyboard/HandsGuide";

describe("Keyboard Component Logic", () => {
  it("resolves keycap and shift state for standard Marathi characters", () => {
    const kRes = findKeyForChar("क");
    expect(kRes).toEqual({ code: "KeyK", shift: false });

    const khRes = findKeyForChar("ख");
    expect(khRes).toEqual({ code: "KeyK", shift: true });

    const lRes = findKeyForChar("ळ");
    expect(lRes).toEqual({ code: "KeyN", shift: true });
  });

  it("assigns appropriate finger zones to all keycaps", () => {
    expect(IN_SCRIPT_KEYS["KeyF"].finger).toBe("left-index");
    expect(IN_SCRIPT_KEYS["KeyJ"].finger).toBe("right-index");
    expect(IN_SCRIPT_KEYS["KeyA"].finger).toBe("left-pinky");
    expect(IN_SCRIPT_KEYS["Space"].finger).toBe("thumb");
  });

  it("maps every InScript key definition onto the 5-row keyboard layout", () => {
    const layoutCodes = [
      ...KEYBOARD_ROWS.row1,
      ...KEYBOARD_ROWS.row2,
      ...KEYBOARD_ROWS.row3,
      ...KEYBOARD_ROWS.row4,
      "Space",
    ];
    for (const code of layoutCodes) {
      expect(IN_SCRIPT_KEYS[code]).toBeDefined();
    }
    expect(new Set(layoutCodes).size).toBe(Object.keys(IN_SCRIPT_KEYS).length);
  });

  it("renders VirtualKeyboard with target highlighting, shift state, and Marathi hands guide", () => {
    const readyHtml = renderToStaticMarkup(React.createElement(VirtualKeyboard, {}));
    expect(readyHtml).toContain("तयार राहा (Ready)");
    expect(readyHtml).toContain("Backspace");
    expect(readyHtml).toContain("Enter");
    expect(readyHtml).toContain("स्पेस");

    const shiftedTargetHtml = renderToStaticMarkup(
      React.createElement(VirtualKeyboard, {
        targetChar: "ख",
        activeCode: "KeyK",
        isShiftDown: false,
      })
    );
    expect(shiftedTargetHtml).toContain("उजवा मध्यमा (Right Middle)");
    expect(shiftedTargetHtml).toContain("ring-4 ring-emerald-400");
    expect(shiftedTargetHtml).toContain("translate-y-0.5");
    expect(shiftedTargetHtml).toContain("border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold");
  });

  it("renders HandsGuide for left, right, and thumb zones", () => {
    const leftHtml = renderToStaticMarkup(
      React.createElement(HandsGuide, { targetFinger: "left-pinky" })
    );
    expect(leftHtml).toContain("डावा करंगळी (Left Pinky)");

    const thumbHtml = renderToStaticMarkup(
      React.createElement(HandsGuide, { targetFinger: "thumb" })
    );
    expect(thumbHtml).toContain("अंगठा (Thumb)");
  });
});
