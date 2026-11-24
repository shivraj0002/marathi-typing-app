"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Header } from "@/components/common/Header";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { useInscriptEngine } from "@/hooks/useInscriptEngine";
import { useMounted } from "@/hooks/useMounted";
import { generateClinicDrill, getTopWeakChars } from "@/lib/clinic/drill";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { ResultModal } from "@/components/typing/ResultModal";
import { Stethoscope, AlertTriangle, RotateCcw } from "lucide-react";

/** Adaptive Weak Key Clinic targeting the user's top 5 most frequently missed characters. */
export default function ClinicPage() {
  const mounted = useMounted();
  const { weakKeys, soundEnabled, recordKeyStroke } = useTypingStore();
  const effectiveWeakKeys = mounted ? weakKeys : {};
  const effectiveSoundEnabled = mounted ? soundEnabled : true;

  const sortedWeak = useMemo(
    () => getTopWeakChars(effectiveWeakKeys, 5),
    [effectiveWeakKeys]
  );

  const [drillText, setDrillText] = useState(() => generateClinicDrill([]));
  const hasSyncedInitialDrillRef = useRef(false);

  useEffect(() => {
    if (mounted && !hasSyncedInitialDrillRef.current) {
      hasSyncedInitialDrillRef.current = true;
      if (sortedWeak.length > 0) {
        setDrillText(generateClinicDrill(sortedWeak));
      }
    }
  }, [mounted, sortedWeak]);

  const engine = useInscriptEngine({
    targetText: drillText,
    soundEnabled: effectiveSoundEnabled,
    onKeyProcessed: (char, isCorrect) => recordKeyStroke(char, isCorrect),
  });

  const handleRefresh = () => {
    setDrillText(generateClinicDrill(sortedWeak));
    engine.restart();
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-6 h-6 text-emerald-400" />
              <div>
                <h1 className="text-xl font-bold text-slate-100">वीक की क्लिनिक (Weak Key Clinic)</h1>
                <p className="text-xs text-slate-400">आपल्या सर्वात जास्त चुकणाऱ्या अक्षरांचा विशेष सराव.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> नवीन सराव तयार करा
            </button>
          </div>

          <div className="mb-6 p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              {sortedWeak.length > 0 ? (
                <span>
                  सध्याची कठीण अक्षरे:{" "}
                  {sortedWeak.map((c, i) => (
                    <span key={i} className="font-bold text-amber-300 px-1.5 py-0.5 bg-amber-950/40 rounded mr-1">
                      {c}
                    </span>
                  ))}
                </span>
              ) : (
                <span>उत्कृष्ट! अद्याप कोणतीही गंभीर चूक नोंदवलेली नाही. सरावासाठी सामान्य कठीण शब्द दिले आहेत.</span>
              )}
            </div>
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
          title="क्लिनिक सराव पूर्ण! (Clinic Completed)"
          subtitle="आपला क्लिनिक सराव पूर्ण झाला आहे."
          onRetry={handleRefresh}
        />
      </main>
    </>
  );
}
