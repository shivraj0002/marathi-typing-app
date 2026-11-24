"use client";

import React from "react";
import Link from "next/link";
import { Header } from "@/components/common/Header";
import { STAGES } from "@/lib/curriculum/stages";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { useMounted } from "@/hooks/useMounted";
import { Lock, CheckCircle2, Play } from "lucide-react";

/** 6-Stage Marathi InScript curriculum roadmap showing locked/unlocked lessons and best scores. */
export default function AcademyPage() {
  const mounted = useMounted();
  const { unlockedLessons, lessonScores } = useTypingStore();
  const effectiveUnlocked = mounted ? unlockedLessons : ["stage-1-lesson-1"];
  const effectiveScores = mounted ? lessonScores : {};

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-100">मराठी टायपिंग अभ्यासक्रम</h1>
          <p className="text-slate-400 text-sm mt-1">
            ६ टप्प्यांचा परिपूर्ण कोर्स — मूलभूत अक्षरांपासून ते अस्खलित परीक्षा परिच्छेदांपर्यंत.
          </p>
        </div>

        <div className="space-y-6">
          {STAGES.map((stage) => (
            <div key={stage.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-100">{stage.title}</h2>
                <p className="text-xs text-emerald-400 mt-0.5">{stage.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {stage.lessons.map((lesson) => {
                  const isUnlocked = effectiveUnlocked.includes(lesson.id);
                  const score = effectiveScores[lesson.id];
                  const isCompleted = Boolean(
                    score && score.bestAccuracy >= lesson.minAccuracy && score.bestWpm >= lesson.minWpm
                  );

                  return (
                    <div
                      key={lesson.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        isUnlocked
                          ? "bg-slate-800/40 border-slate-700/80 hover:border-emerald-500/50"
                          : "bg-slate-950/40 border-slate-900 opacity-60"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            लक्ष्य: {lesson.minWpm} WPM
                          </span>
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : !isUnlocked ? (
                            <Lock className="w-3.5 h-3.5 text-slate-500" />
                          ) : null}
                        </div>
                        <h3 className="font-semibold text-sm text-slate-200">{lesson.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{lesson.description}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        {score ? (
                          <div className="text-[11px] text-slate-400">
                            सर्वोत्तम: <span className="text-emerald-400 font-semibold">{score.bestWpm} WPM</span> ({score.bestAccuracy}%)
                          </div>
                        ) : (
                          <div className="text-[11px] text-slate-500">पूर्ण केलेले नाही</div>
                        )}

                        {isUnlocked ? (
                          <Link
                            href={`/academy/${lesson.id}`}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg flex items-center gap-1 transition"
                          >
                            <Play className="w-3 h-3 fill-current" /> सुरू करा
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-600 font-medium">लॉक केलेले</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
