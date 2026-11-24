"use client";

import React, { useState } from "react";
import { Header } from "@/components/common/Header";
import {
  EXAM_PASSAGES_30_WPM,
  EXAM_PASSAGES_40_WPM,
  ExamPassage,
} from "@/lib/curriculum/examPassages";
import { evaluateExamGrade } from "@/lib/exam/grading";
import { useInscriptEngine } from "@/hooks/useInscriptEngine";
import { useMounted } from "@/hooks/useMounted";
import { useTypingStore } from "@/lib/store/useTypingStore";
import { TypingArea } from "@/components/typing/TypingArea";
import { LiveStatsBar } from "@/components/typing/LiveStatsBar";
import { VirtualKeyboard } from "@/components/keyboard/VirtualKeyboard";
import { ExamCertificate } from "@/components/exam/ExamCertificate";
import { Award, ShieldAlert, Play, RotateCcw, FileText } from "lucide-react";

interface ActiveExamSessionProps {
  candidateName: string;
  selectedTier: 30 | 40;
  selectedPassage: ExamPassage;
  soundEnabled: boolean;
  onExit: () => void;
}

/** Mounted only during an active exam so global key listeners never block the registration input. */
const ActiveExamSession: React.FC<ActiveExamSessionProps> = ({
  candidateName,
  selectedTier,
  selectedPassage,
  soundEnabled,
  onExit,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [completedDate, setCompletedDate] = useState("");
  const { recordExamResult, recordKeyStroke } = useTypingStore();

  const timeLimitSeconds = selectedPassage.durationMinutes * 60;

  const engine = useInscriptEngine({
    targetText: selectedPassage.text,
    soundEnabled,
    timeLimitSeconds,
    onKeyProcessed: (char, isCorrect) => recordKeyStroke(char, isCorrect),
    onFinish: (metrics) => {
      const evaluation = evaluateExamGrade(metrics.netWpm, metrics.accuracy, selectedTier);
      setCompletedDate(new Date().toLocaleDateString("mr-IN"));

      recordExamResult({
        id: `exam-${Date.now()}`,
        targetWpm: selectedTier,
        grossWpm: metrics.grossWpm,
        netWpm: metrics.netWpm,
        accuracy: metrics.accuracy,
        passed: evaluation.passed,
        grade: evaluation.grade,
        timestamp: new Date().toISOString(),
      });
    },
  });

  const evaluation = evaluateExamGrade(
    engine.metrics.netWpm,
    engine.metrics.accuracy,
    selectedTier
  );

  return (
    <>
      <div className="print:hidden">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-bold text-slate-100">{selectedPassage.title}</h1>
            <p className="text-xs text-slate-400">
              उमेदवार: {candidateName} | टार्गेट: {selectedTier} WPM
            </p>
          </div>
          <button
            type="button"
            onClick={onExit}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition cursor-pointer"
          >
            बाहेर पडा (Exit)
          </button>
        </div>

        <LiveStatsBar
          metrics={engine.metrics}
          elapsedSeconds={engine.elapsedSeconds}
          timeLimit={timeLimitSeconds}
        />

        <TypingArea
          targetChars={engine.targetChars}
          currentIndex={engine.currentIndex}
          typedHistory={engine.typedHistory}
        />

        <div className="mt-8">
          <VirtualKeyboard
            activeCode={engine.activeCode}
            targetChar={engine.targetChar}
            isShiftDown={engine.isShiftDown}
          />
        </div>
      </div>

      {engine.isFinished && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 print:hidden">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl text-center">
            <Award
              className={`w-14 h-14 mx-auto mb-3 ${
                evaluation.passed ? "text-emerald-400" : "text-rose-400"
              }`}
            />
            <h2 className="text-2xl font-bold text-slate-100">
              {evaluation.passed
                ? "अभिनंदन! परीक्षा उत्तीर्ण!"
                : "प्रयत्न चांगला होता (अनुत्तीर्ण)"}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {evaluation.passed
                ? `आपण '${evaluation.grade}' श्रेणीमध्ये परीक्षा उत्तीर्ण केली आहे.`
                : "अचूकता किंवा वेग निकषांपेक्षा कमी पडला. पुन्हा प्रयत्न करा."}
            </p>

            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">Gross Speed</div>
                <div className="text-xl font-bold text-slate-100">
                  {engine.metrics.grossWpm} WPM
                </div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">Net Speed</div>
                <div className="text-xl font-bold text-emerald-400">
                  {engine.metrics.netWpm} WPM
                </div>
              </div>
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                <div className="text-[10px] text-slate-400">Accuracy</div>
                <div className="text-xl font-bold text-blue-400">
                  {engine.metrics.accuracy}%
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" /> पुन्हा द्या
              </button>
              {evaluation.passed && (
                <button
                  type="button"
                  onClick={() => setShowCertificate(true)}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition cursor-pointer"
                >
                  प्रमाणपत्र पहा <Award className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showCertificate && (
        <ExamCertificate
          candidateName={candidateName}
          targetWpm={selectedTier}
          grossWpm={engine.metrics.grossWpm}
          netWpm={engine.metrics.netWpm}
          accuracy={engine.metrics.accuracy}
          grade={evaluation.grade}
          date={completedDate}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </>
  );
};

/** Official Maharashtra GCC-TBC 30/40 WPM 7-minute exam simulator and certificate viewer. */
export default function ExamPage() {
  const mounted = useMounted();
  const [selectedTier, setSelectedTier] = useState<30 | 40>(30);
  const [candidateName, setCandidateName] = useState("");
  const [isStarted, setIsStarted] = useState(false);

  const passages = selectedTier === 30 ? EXAM_PASSAGES_30_WPM : EXAM_PASSAGES_40_WPM;
  const [selectedPassage, setSelectedPassage] = useState<ExamPassage>(passages[0]);

  const { soundEnabled } = useTypingStore();
  const effectiveSoundEnabled = mounted ? soundEnabled : true;

  const handleStartExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim()) return;
    setIsStarted(true);
  };

  const handleTierChange = (tier: 30 | 40) => {
    setSelectedTier(tier);
    const newPassages = tier === 30 ? EXAM_PASSAGES_30_WPM : EXAM_PASSAGES_40_WPM;
    setSelectedPassage(newPassages[0]);
    setIsStarted(false);
  };

  return (
    <>
      <div className="print:hidden">
        <Header />
      </div>
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full flex flex-col justify-between print:p-0 print:max-w-none">
        {!isStarted ? (
          <div className="max-w-xl mx-auto my-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <Award className="w-10 h-10 text-amber-400 shrink-0" />
              <div>
                <h1 className="text-xl font-bold text-slate-100">
                  GCC-TBC शासकीय परीक्षा सिम्युलेटर
                </h1>
                <p className="text-xs text-slate-400">
                  Maharashtra State Government Typing Test Simulation
                </p>
              </div>
            </div>

            <form onSubmit={handleStartExam} className="space-y-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  परीक्षेचा वेग निवडा (Speed Tier):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    aria-pressed={selectedTier === 30}
                    onClick={() => handleTierChange(30)}
                    className={`py-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                      selectedTier === 30
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    ३० शब्द/मिनिट (30 WPM)
                  </button>
                  <button
                    type="button"
                    aria-pressed={selectedTier === 40}
                    onClick={() => handleTierChange(40)}
                    className={`py-3 rounded-xl border text-sm font-bold transition cursor-pointer ${
                      selectedTier === 40
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    ४० शब्द/मिनिट (40 WPM)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  उतारा निवडा (Select Exam Passage):
                </label>
                <div className="space-y-2">
                  {passages.map((passage) => {
                    const isSelected = selectedPassage.id === passage.id;
                    return (
                      <button
                        key={passage.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setSelectedPassage(passage)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/15 border-emerald-400 text-emerald-200"
                            : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <span className="flex items-center gap-2 text-xs font-medium">
                          <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                          {passage.title}
                        </span>
                        <span className="text-[11px] text-slate-400 shrink-0">
                          {passage.durationMinutes} min • ~{passage.wordCount} words
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="candidate-name"
                  className="block text-xs font-semibold text-slate-300 mb-2"
                >
                  विद्यार्थ्याचे पूर्ण नाव (Candidate Name):
                </label>
                <input
                  id="candidate-name"
                  type="text"
                  required
                  placeholder="उदा. राहुल प्रकाश पाटील"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
                />
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> परीक्षा नियम:
                </div>
                <div>• वेळ: ७ मिनिटे (Duration: 7 minutes)</div>
                <div>
                  • उत्तीर्णता: किमान ८५% अचूकता आणि नेट स्पीड {selectedTier - 2}+ WPM (Pass)
                </div>
                <div>
                  • First Class: ९०%+ व {selectedTier}+ WPM | Distinction: ९५%+ व{" "}
                  {selectedTier + 5}+ WPM
                </div>
                <div>• उत्तीर्ण झाल्यानंतर डिजिटल प्रमाणपत्र मिळेल.</div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" /> परीक्षा सुरू करा (Start Exam)
              </button>
            </form>
          </div>
        ) : (
          <ActiveExamSession
            candidateName={candidateName.trim()}
            selectedTier={selectedTier}
            selectedPassage={selectedPassage}
            soundEnabled={effectiveSoundEnabled}
            onExit={() => setIsStarted(false)}
          />
        )}
      </main>
    </>
  );
}
