"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/common/Header";
import { COMMON_MARATHI_WORDS } from "@/lib/curriculum/words";
import { useInscriptEngine } from "@/hooks/useInscriptEngine";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { useMounted } from "@/hooks/useMounted";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { ResultModal } from "@/components/typing/ResultModal";
import { RotateCcw } from "lucide-react";

const SPRINT_DURATIONS = [15, 30, 60, 120] as const;

function getSprintWordCount(seconds: number): number {
  if (seconds === 15) return 25;
  if (seconds === 30) return 45;
  if (seconds === 60) return 80;
  return 140;
}

function getRandomWords(count: number): string {
  const result: string[] = [];
  while (result.length < count) {
    const chunk = [...COMMON_MARATHI_WORDS];
    for (let i = chunk.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chunk[i], chunk[j]] = [chunk[j], chunk[i]];
    }
    result.push(...chunk);
  }
  return result.slice(0, count).join(" ");
}

/** Monkeytype-style timed Marathi speed sprint mode (15s, 30s, 60s, 120s). */
export default function SprintPage() {
  const mounted = useMounted();
  const [timeLimit, setTimeLimit] = useState<number>(30);
  const [drillText, setDrillText] = useState(() =>
    COMMON_MARATHI_WORDS.slice(0, getSprintWordCount(30)).join(" ")
  );
  const { soundEnabled, recordKeyStroke } = useTypingStore();
  const effectiveSoundEnabled = mounted ? soundEnabled : true;
  const hasShuffledInitialRef = useRef(false);

  useEffect(() => {
    if (mounted && !hasShuffledInitialRef.current) {
      hasShuffledInitialRef.current = true;
      setDrillText(getRandomWords(getSprintWordCount(30)));
    }
  }, [mounted]);

  const engine = useInscriptEngine({
    targetText: drillText,
    soundEnabled: effectiveSoundEnabled,
    timeLimitSeconds: timeLimit,
    onKeyProcessed: (char, isCorrect) => recordKeyStroke(char, isCorrect),
  });

  const handleTimeChange = (t: number) => {
    setTimeLimit(t);
    setDrillText(getRandomWords(getSprintWordCount(t)));
    engine.restart();
  };

  const handleRestart = () => {
    setDrillText(getRandomWords(getSprintWordCount(timeLimit)));
    engine.restart();
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-slate-100">स्पीड स्प्रिंट (Speed Sprint)</h1>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1 rounded-xl">
              {SPRINT_DURATIONS.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={timeLimit === t}
                  onClick={() => handleTimeChange(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    timeLimit === t
                      ? "bg-emerald-500 text-slate-950 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {t}s
                </button>
              ))}
              <button
                type="button"
                onClick={handleRestart}
                className="p-1.5 text-slate-400 hover:text-slate-200 ml-1"
                aria-label="Restart"
                title="Restart"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <LiveStatsBar
            metrics={engine.metrics}
            elapsedSeconds={engine.elapsedSeconds}
            timeLimit={timeLimit}
          />

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
          title="स्प्रिंट पूर्ण झाला! (Sprint Complete)"
          subtitle="आपला स्प्रिंट निकाल खालीलप्रमाणे आहे."
          onRetry={handleRestart}
        />
      </main>
    </>
  );
}
