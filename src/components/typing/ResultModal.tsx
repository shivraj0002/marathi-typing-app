"use client";

import React from "react";
import { TypingMetrics } from "@/lib/store/useTypingStore";
import { CheckCircle2, AlertCircle, RotateCcw, ArrowRight } from "lucide-react";

export interface ResultModalProps {
  isOpen: boolean;
  metrics: TypingMetrics;
  onRetry: () => void;
  onNext?: () => void;
  title?: string;
  isPassed?: boolean;
}

/** Post-session scorecard modal showing Gross/Net WPM, Accuracy, Mistakes, and Retry/Next controls. */
export const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  metrics,
  onRetry,
  onNext,
  title = "सराव पूर्ण झाला! (Practice Completed)",
  isPassed = true,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center">
        {isPassed ? (
          <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-3" />
        ) : (
          <AlertCircle className="w-14 h-14 text-amber-400 mb-3" />
        )}
        <h2 className="text-2xl font-bold text-slate-100">{title}</h2>
        <p className="text-sm text-slate-400 mt-1">
          {isPassed
            ? "छान प्रयत्न! आपण पुढील टप्प्यासाठी पात्र आहात."
            : "पुन्हा सराव करून ९५% पेक्षा जास्त अचूकता मिळवा."}
        </p>

        <div className="grid grid-cols-2 gap-3 w-full my-6">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Gross WPM</div>
            <div className="text-2xl font-bold text-emerald-400">{metrics.grossWpm}</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Net WPM</div>
            <div className="text-2xl font-bold text-blue-400">{metrics.netWpm}</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Accuracy</div>
            <div className="text-2xl font-bold text-amber-400">{metrics.accuracy}%</div>
          </div>
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
            <div className="text-xs text-slate-400">Mistakes</div>
            <div className="text-2xl font-bold text-rose-400">{metrics.mistakes}</div>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={onRetry}
            className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-medium flex items-center justify-center gap-2 transition"
          >
            <RotateCcw className="w-4 h-4" /> पुन्हा करा (Retry)
          </button>
          {onNext && isPassed && (
            <button
              onClick={onNext}
              className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-500/20"
            >
              पुढे चला (Next) <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
