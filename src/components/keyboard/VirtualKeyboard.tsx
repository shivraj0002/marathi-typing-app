"use client";

import React from "react";
import { IN_SCRIPT_KEYS, findKeyForChar } from "@/lib/inscript/keymap";
import { KeyCap } from "./KeyCap";
import { HandsGuide } from "./HandsGuide";

export interface VirtualKeyboardProps {
  activeCode?: string | null;
  targetChar?: string | null;
  isShiftDown?: boolean;
}

export const KEYBOARD_ROWS = {
  row1: ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal"],
  row2: ["KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
  row3: ["KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote"],
  row4: ["KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash"],
} as const;

/** Full 5-row responsive InScript virtual keyboard with finger-zone colors, shift switching, and target highlighting. */
export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  activeCode,
  targetChar,
  isShiftDown = false,
}) => {
  const targetInfo = targetChar ? findKeyForChar(targetChar) : null;
  const targetCode = targetInfo?.code;
  const targetDef = targetCode ? IN_SCRIPT_KEYS[targetCode] : undefined;
  const isShiftActive = isShiftDown || !!targetInfo?.shift;

  const renderKey = (code: string, widthClass = "w-12") => {
    const def = IN_SCRIPT_KEYS[code];
    if (!def) return null;
    return (
      <KeyCap
        key={code}
        code={code}
        qwerty={def.qwerty}
        charNormal={def.normal}
        charShifted={def.shifted}
        finger={def.finger}
        isActive={activeCode === code}
        isTarget={targetCode === code}
        isShiftActive={isShiftActive}
        widthClass={widthClass}
      />
    );
  };

  const shiftKeyClass = `h-14 w-24 rounded-lg border-2 text-xs font-mono flex items-center justify-center transition-colors ${
    isShiftActive
      ? "border-emerald-400 bg-emerald-500/20 text-emerald-300 font-bold"
      : "border-slate-700 bg-slate-800/40 text-slate-400"
  }`;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-2 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-sm">
      <HandsGuide targetFinger={targetDef?.finger} />

      {/* Row 1 */}
      <div className="flex gap-1.5 justify-center">
        {KEYBOARD_ROWS.row1.map((code) => renderKey(code))}
        <div className="h-14 w-20 rounded-lg border-2 border-slate-700 bg-slate-800/40 text-slate-400 text-xs font-mono flex items-center justify-center">
          Backspace
        </div>
      </div>

      {/* Row 2 */}
      <div className="flex gap-1.5 justify-center">
        <div className="h-14 w-16 rounded-lg border-2 border-slate-700 bg-slate-800/40 text-slate-400 text-xs font-mono flex items-center justify-center">
          Tab
        </div>
        {KEYBOARD_ROWS.row2.map((code) => renderKey(code))}
      </div>

      {/* Row 3 */}
      <div className="flex gap-1.5 justify-center">
        <div className="h-14 w-20 rounded-lg border-2 border-slate-700 bg-slate-800/40 text-slate-400 text-xs font-mono flex items-center justify-center">
          Caps
        </div>
        {KEYBOARD_ROWS.row3.map((code) => renderKey(code))}
        <div className="h-14 w-20 rounded-lg border-2 border-slate-700 bg-slate-800/40 text-slate-400 text-xs font-mono flex items-center justify-center">
          Enter
        </div>
      </div>

      {/* Row 4 */}
      <div className="flex gap-1.5 justify-center">
        <div className={shiftKeyClass}>Shift</div>
        {KEYBOARD_ROWS.row4.map((code) => renderKey(code))}
        <div className={shiftKeyClass}>Shift</div>
      </div>

      {/* Row 5: Spacebar */}
      <div className="flex gap-1.5 justify-center">
        {renderKey("Space", "w-80")}
      </div>
    </div>
  );
};
