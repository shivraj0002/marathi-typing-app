"use client";

import React, { use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Header } from "@/components/common/Header";
import { STAGES, getNextLessonId, Lesson } from "@/lib/curriculum/stages";
import { useInscriptEngine } from "@/hooks/useInscriptEngine";
import { useTypingStore, TypingMetrics } from "@/lib/store/useTypingStore";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { ResultModal } from "@/components/typing/ResultModal";

function hasPassedLesson(metrics: Pick<TypingMetrics, "accuracy" | "grossWpm">, lesson: Pick<Lesson, "minAccuracy" | "minWpm">) {
  return metrics.accuracy >= lesson.minAccuracy && metrics.grossWpm >= lesson.minWpm;
}

/** Guided interactive lesson runner that records scores and unlocks the next lesson upon passing. */
export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const allLessons = STAGES.flatMap((s) => s.lessons);
  const lesson = allLessons.find((l) => l.id === resolvedParams.id);

  if (!lesson) notFound();

  const { unlockLesson, recordLessonScore, recordKeyStroke, soundEnabled } = useTypingStore();

  const engine = useInscriptEngine({
    targetText: lesson.targetText,
    soundEnabled,
    onKeyProcessed: (char, isCorrect) => recordKeyStroke(char, isCorrect),
    onFinish: (metrics) => {
      const passed = hasPassedLesson(metrics, lesson);
      recordLessonScore({
        lessonId: lesson.id,
        bestWpm: metrics.grossWpm,
        bestAccuracy: metrics.accuracy,
        passed,
        completedAt: new Date().toISOString(),
      });
      if (passed) {
        const nextId = getNextLessonId(lesson.id);
        if (nextId) unlockLesson(nextId);
      }
    },
  });

  const nextLessonId = getNextLessonId(lesson.id);
  const isPassed = hasPassedLesson(engine.metrics, lesson);

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <Link href="/academy" className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> अभ्यासक्रमाकडे परत
            </Link>
            <div className="text-xs text-emerald-400 font-mono">
              लक्ष्य: {lesson.minWpm} WPM | अचूकता: {lesson.minAccuracy}%
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-100">{lesson.title}</h1>
            <p className="text-xs text-slate-400 mt-1">{lesson.description}</p>
          </div>

          <LiveStatsBar metrics={engine.metrics} elapsedSeconds={engine.elapsedSeconds} />

          <TypingArea
            targetChars={engine.targetChars}
            currentIndex={engine.currentIndex}
            typedHistory={engine.typedHistory}
          />
        </div>

        <div className="mt-8">
          <VirtualKeyboard
            activeCode={engine.activeCode}
            targetChar={engine.targetChar}
            isShiftDown={engine.isShiftDown}
          />
        </div>

        <ResultModal
          isOpen={engine.isFinished}
          metrics={engine.metrics}
          isPassed={isPassed}
          onRetry={engine.restart}
          onNext={nextLessonId ? () => router.push(`/academy/${nextLessonId}`) : undefined}
        />
      </main>
    </>
  );
}
