"use client";

import React from "react";
import { FingerZone } from "@/lib/inscript/keymap";

export interface KeyCapProps {
  code: string;
  qwerty: string;
  charNormal: string;
  charShifted: string;
  finger: FingerZone;
  isActive: boolean;
  isTarget: boolean;
  isShiftActive: boolean;
  widthClass?: string;
}

const FINGER_COLORS: Record<FingerZone, string> = {
  "left-pinky": "border-purple-500/40 bg-purple-950/20",
  "left-ring": "border-blue-500/40 bg-blue-950/20",
  "left-middle": "border-emerald-500/40 bg-emerald-950/20",
  "left-index": "border-amber-500/40 bg-amber-950/20",
  thumb: "border-slate-500/40 bg-slate-900/40",
  "right-index": "border-amber-500/40 bg-amber-950/20",
  "right-middle": "border-emerald-500/40 bg-emerald-950/20",
  "right-ring": "border-blue-500/40 bg-blue-950/20",
  "right-pinky": "border-purple-500/40 bg-purple-950/20",
};

/** Individual virtual keycap displaying QWERTY label, normal/shifted Marathi glyphs, and finger zone color. */
export const KeyCap: React.FC<KeyCapProps> = ({
  code,
  qwerty,
  charNormal,
  charShifted,
  finger,
  isActive,
  isTarget,
  isShiftActive,
  widthClass = "w-12",
}) => {
  const displayChar = isShiftActive ? charShifted : charNormal;
  const secondaryChar = isShiftActive ? charNormal : charShifted;
  const isSpace = code === "Space";

  return (
    <div
      data-key-code={code}
      className={`relative h-14 ${widthClass} rounded-lg border-2 flex flex-col justify-between p-1.5 select-none transition-all duration-75 shadow-sm ${
        FINGER_COLORS[finger]
      } ${
        isTarget
          ? "ring-4 ring-emerald-400 border-emerald-400 scale-105 z-10 shadow-emerald-500/30 shadow-lg animate-pulse"
          : ""
      } ${isActive ? "bg-emerald-500/40 border-emerald-300 translate-y-0.5" : ""}`}
    >
      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
        <span className="uppercase">{isSpace ? "Space" : qwerty}</span>
        {!isSpace && <span className="opacity-60 text-[9px]">{secondaryChar}</span>}
      </div>
      <div className="text-center font-bold text-lg text-slate-100 font-sans leading-none">
        {isSpace ? "स्पेस" : displayChar}
      </div>
    </div>
  );
};
