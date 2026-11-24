"use client";

import React from "react";
import { Header } from "@/components/common/Header";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { useMounted } from "@/hooks/useMounted";
import { STAGES } from "@/lib/curriculum/stages";
import { BarChart3, Award, CheckCircle2, RotateCcw } from "lucide-react";

const TOTAL_LESSONS = STAGES.reduce((sum, stage) => sum + stage.lessons.length, 0);

/** Analytics dashboard showing completed lessons, weak-key error heatmap, and exam history. */
export default function StatsPage() {
  const mounted = useMounted();
  const { lessonScores, examHistory, weakKeys, resetProgress } = useTypingStore();

  const effectiveLessonScores = mounted ? lessonScores : {};
  const effectiveExamHistory = mounted ? examHistory : [];
  const effectiveWeakKeys = mounted ? weakKeys : {};

  const completedCount = Object.keys(effectiveLessonScores).length;
  const passedCount = effectiveExamHistory.filter((e) => e.passed).length;
  const sortedWeak = Object.values(effectiveWeakKeys)
    .filter((k) => k.missCount > 0 && k.totalAttempts > 0)
    .sort((a, b) => b.missCount - a.missCount || b.totalAttempts - a.totalAttempts);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">आपली प्रगती (Your Statistics)</h1>
            <p className="text-xs text-slate-400 mt-1">आपल्या सरावाची आकडेवारी आणि परीक्षा इतिहास.</p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (confirm("आपला संपूर्ण प्रगती डेटा रीसेट करायचा आहे का?")) resetProgress();
            }}
            className="px-3 py-1.5 bg-rose-950/30 border border-rose-500/30 text-rose-300 hover:bg-rose-950/50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> डेटा रीसेट करा
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> पूर्ण केलेले धडे
            </div>
            <div className="text-3xl font-bold text-slate-100">
              {completedCount} / {TOTAL_LESSONS}
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <Award className="w-4 h-4 text-amber-400" /> दिलेल्या परीक्षा
            </div>
            <div className="text-3xl font-bold text-slate-100">{effectiveExamHistory.length}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <BarChart3 className="w-4 h-4 text-blue-400" /> उत्तीर्ण परीक्षा
            </div>
            <div className="text-3xl font-bold text-slate-100">{passedCount}</div>
          </div>
        </div>

        {/* Weak Keys Heatmap / Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
          <h2 className="text-base font-bold text-slate-100 mb-4">अचूकता विश्लेषण (Key Accuracy Analysis)</h2>
          {sortedWeak.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {sortedWeak.slice(0, 10).map((k) => {
                const errorRate = Math.round((k.missCount / k.totalAttempts) * 100);
                return (
                  <div key={k.char} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <div className="text-2xl font-bold text-slate-100 mb-1">{k.char}</div>
                    <div className="text-[10px] text-slate-400">
                      चूक दर: <span className="text-rose-400 font-semibold">{errorRate}%</span> ({k.missCount}/{k.totalAttempts})
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500">अद्याप पुरेशी आकडेवारी उपलब्ध नाही. सराव सुरू करा!</p>
          )}
        </div>

        {/* Exam History */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-base font-bold text-slate-100 mb-4">परीक्षा निकाल इतिहास (Exam History)</h2>
          {effectiveExamHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="text-[11px] text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2">दिनांक</th>
                    <th>टार्गेट</th>
                    <th>Net WPM</th>
                    <th>Accuracy</th>
                    <th>निकाल</th>
                    <th>श्रेणी</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {effectiveExamHistory.map((e) => (
                    <tr key={e.id}>
                      <td className="py-2.5 font-mono text-slate-400">
                        {new Date(e.timestamp).toLocaleDateString("mr-IN")}
                      </td>
                      <td>{e.targetWpm} WPM</td>
                      <td className="font-semibold text-emerald-400">{e.netWpm}</td>
                      <td>{e.accuracy}%</td>
                      <td>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            e.passed
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          }`}
                        >
                          {e.passed ? "उत्तीर्ण" : "अनुत्तीर्ण"}
                        </span>
                      </td>
                      <td className="text-amber-400 font-medium">{e.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-500">अद्याप कोणतीही परीक्षा दिलेली नाही.</p>
          )}
        </div>
      </main>
    </>
  );
}
