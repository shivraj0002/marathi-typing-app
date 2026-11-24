"use client";

import React, { useRef } from "react";
import { Award, Printer } from "lucide-react";
import { ExamGrade } from "@/lib/exam/grading";

export interface ExamCertificateProps {
  candidateName: string;
  targetWpm: 30 | 40;
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  grade: ExamGrade | string;
  date: string;
  onClose: () => void;
}

/** Printable GCC-TBC simulation achievement certificate modal. */
export const ExamCertificate: React.FC<ExamCertificateProps> = ({
  candidateName,
  targetWpm,
  grossWpm,
  netWpm,
  accuracy,
  grade,
  date,
  onClose,
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto print:static print:inset-auto print:bg-transparent print:backdrop-blur-none print:p-0 print:overflow-visible">
      <div className="flex flex-col items-center gap-4 max-w-2xl w-full print:max-w-none">
        <div
          ref={certRef}
          className="w-full bg-amber-50 text-slate-900 border-8 border-double border-amber-800 rounded-3xl p-8 shadow-2xl relative select-none font-serif print:w-full print:m-0 print:shadow-none print:rounded-none"
        >
          <div className="border border-amber-700/30 rounded-2xl p-6 print:rounded-none">
            <div className="text-center border-b-2 border-amber-700/40 pb-4 mb-6">
              <Award className="w-16 h-16 text-amber-700 mx-auto mb-2" />
              <h1 className="text-3xl font-bold tracking-wide text-amber-950">
                प्रमाणपत्र (CERTIFICATE OF PROFICIENCY)
              </h1>
              <p className="text-sm font-sans text-amber-800 font-semibold mt-1">
                महाराष्ट्र राज्य शासकीय संगणक टंकलेखन सराव परीक्षा (GCC-TBC SIMULATION)
              </p>
            </div>

            <div className="text-center space-y-4 my-8 font-sans">
              <p className="text-sm text-slate-700">प्रमाणित करण्यात येते की</p>
              <h2 className="text-2xl font-bold text-slate-900 underline decoration-amber-600 decoration-2 underline-offset-4">
                {candidateName.trim() || "माननीय विद्यार्थी"}
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed max-w-lg mx-auto">
                यांनी मराठी इन्स्क्रिप्ट टंकलेखन परीक्षा (मर्यादा:{" "}
                <strong>{targetWpm} शब्द प्रति मिनिट</strong>) यशस्वीरीत्या उत्तीर्ण केली असून
                खालीलप्रमाणे श्रेणी संपादन केली आहे:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-amber-100/60 border border-amber-300 rounded-xl p-3 max-w-lg mx-auto">
                <div>
                  <div className="text-[10px] text-slate-600">Gross WPM</div>
                  <div className="text-lg font-bold text-slate-900">{grossWpm}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600">Net WPM</div>
                  <div className="text-lg font-bold text-emerald-800">{netWpm}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600">Accuracy</div>
                  <div className="text-lg font-bold text-slate-900">{accuracy}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-600">Grade</div>
                  <div className="text-lg font-bold text-amber-900">{grade}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-amber-700/40 pt-6 mt-8 text-xs text-slate-600 font-sans">
              <div>
                दिनांक: <strong>{date}</strong>
              </div>
              <div className="text-center">
                <div className="font-serif font-bold text-amber-900 italic text-sm">
                  Marathi InScript Academy
                </div>
                <div>परीक्षक स्वाक्षरी (Examiner)</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl flex items-center gap-2 shadow-lg transition cursor-pointer"
          >
            <Printer className="w-4 h-4" /> प्रमाणपत्र मुद्रित करा (Print)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition cursor-pointer"
          >
            बंद करा (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
