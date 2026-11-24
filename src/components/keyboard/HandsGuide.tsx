"use client";

import React from "react";
import { FingerZone } from "@/lib/inscript/keymap";

export interface HandsGuideProps {
  targetFinger?: FingerZone;
}

const FINGER_LABELS: Record<FingerZone, string> = {
  "left-pinky": "डावा करंगळी (Left Pinky)",
  "left-ring": "डावा अनामिका (Left Ring)",
  "left-middle": "डावा मध्यमा (Left Middle)",
  "left-index": "डावा तर्जनी (Left Index)",
  thumb: "अंगठा (Thumb)",
  "right-index": "उजवा तर्जनी (Right Index)",
  "right-middle": "उजवा मध्यमा (Right Middle)",
  "right-ring": "उजवा अनामिका (Right Ring)",
  "right-pinky": "उजवा करंगळी (Right Pinky)",
};

/** Minimalist hands and finger guide indicating which hand and finger to use for the next keystroke. */
export const HandsGuide: React.FC<HandsGuideProps> = ({ targetFinger }) => {
  const isLeft = targetFinger?.startsWith("left");
  const isRight = targetFinger?.startsWith("right");

  return (
    <div className="flex items-center justify-between px-6 py-2 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-300">
      <div className={`flex items-center gap-2 ${isLeft ? "text-emerald-400 font-semibold" : "opacity-60"}`}>
        <span>👈 डावा हात (Left Hand)</span>
      </div>
      <div className="text-center">
        {targetFinger ? (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full font-medium">
            बोट: {FINGER_LABELS[targetFinger] || targetFinger}
          </span>
        ) : (
          <span className="text-slate-500">तयार राहा (Ready)</span>
        )}
      </div>
      <div className={`flex items-center gap-2 ${isRight ? "text-emerald-400 font-semibold" : "opacity-60"}`}>
        <span>👉 उजवा हात (Right Hand)</span>
      </div>
    </div>
  );
};
