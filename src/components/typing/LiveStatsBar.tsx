"use client";

import React from "react";
import { TypingMetrics } from "@/lib/store/useTypingStore";
import { Gauge, Target, Timer, AlertCircle } from "lucide-react";

export interface LiveStatsBarProps {
  metrics: TypingMetrics;
  elapsedSeconds: number;
  timeLimit?: number;
}

/** Real-time HUD displaying Gross WPM, Accuracy, elapsed/countdown Time, and Mistakes. */
export const LiveStatsBar: React.FC<LiveStatsBarProps> = ({
  metrics,
  elapsedSeconds,
  timeLimit,
}) => {
  const displayTime =
    timeLimit !== undefined ? Math.max(0, timeLimit - elapsedSeconds) : elapsedSeconds;
  const minutes = Math.floor(displayTime / 60);
  const seconds = displayTime % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mx-auto mb-6">
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <Gauge className="w-6 h-6 text-emerald-400 shrink-0" />
        <div>
          <div className="text-xs text-slate-400">वेग (Gross WPM)</div>
          <div className="text-xl font-bold text-slate-100">{metrics.grossWpm}</div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <Target className="w-6 h-6 text-blue-400 shrink-0" />
        <div>
          <div className="text-xs text-slate-400">अचूकता (Accuracy)</div>
          <div className="text-xl font-bold text-slate-100">{metrics.accuracy}%</div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <Timer className="w-6 h-6 text-amber-400 shrink-0" />
        <div>
          <div className="text-xs text-slate-400">वेळ (Time)</div>
          <div className="text-xl font-bold text-slate-100">{formattedTime}</div>
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
        <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
        <div>
          <div className="text-xs text-slate-400">चुका (Mistakes)</div>
          <div className="text-xl font-bold text-slate-100">{metrics.mistakes}</div>
        </div>
      </div>
    </div>
  );
};
