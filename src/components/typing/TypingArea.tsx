"use client";

import React, { useRef, useEffect } from "react";

export interface TypingAreaProps {
  targetChars: string[];
  currentIndex: number;
  typedHistory: { char: string; isCorrect: boolean }[];
}

/** Live Devanagari passage display with auto-scrolling caret and correct/incorrect character feedback. */
export const TypingArea: React.FC<TypingAreaProps> = ({
  targetChars,
  currentIndex,
  typedHistory,
}) => {
  const activeCharRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (activeCharRef.current) {
      activeCharRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentIndex]);

  return (
    <div className="w-full max-w-4xl mx-auto min-h-[140px] max-h-[220px] overflow-y-auto bg-slate-900/90 border-2 border-slate-800 rounded-2xl p-6 font-sans text-2xl leading-relaxed tracking-wide shadow-xl select-none">
      {targetChars.map((char, index) => {
        const isCurrent = index === currentIndex;
        const typed = typedHistory[index];

        let styleClass = "text-slate-500";
        if (typed) {
          styleClass = typed.isCorrect
            ? "text-emerald-400 font-medium"
            : "text-rose-500 bg-rose-950/40 rounded px-0.5";
        } else if (isCurrent) {
          styleClass =
            "bg-emerald-500/20 text-slate-100 px-1 rounded shadow-sm ring-1 ring-emerald-400 animate-pulse font-semibold";
        }

        return (
          <span
            key={index}
            ref={isCurrent ? activeCharRef : null}
            className={`relative transition-colors duration-75 ${styleClass}`}
          >
            {char === " " ? " " : char}
          </span>
        );
      })}
    </div>
  );
};
