"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { translateKey } from "@/lib/inscript/keymap";
import { segmentGraphemes, normalizeDevanagari } from "@/lib/inscript/graphemes";
import { calculateMetrics, TypingMetrics } from "@/lib/store/useTypingStore";
import { soundEffects } from "@/lib/audio/soundEffects";

export interface TypedGraphemeEntry {
  char: string;
  isCorrect: boolean;
}

export interface UseInscriptEngineProps {
  targetText: string;
  soundEnabled?: boolean;
  timeLimitSeconds?: number;
  onFinish?: (metrics: TypingMetrics) => void;
  onKeyProcessed?: (char: string, isCorrect: boolean) => void;
}

const DIRECT_LIGATURES = ["क्ष", "ज्ञ", "त्र", "श्र"] as const;

/**
 * Returns the next expected InScript key character for a remaining grapheme slice.
 * Direct conjunct keys (क्ष, ज्ञ, त्र, श्र) are returned intact so VirtualKeyboard highlights Shift+5..8.
 */
export function getExpectedTargetChar(remainingGrapheme: string): string | null {
  if (!remainingGrapheme) return null;
  for (const ligature of DIRECT_LIGATURES) {
    if (remainingGrapheme.startsWith(ligature)) {
      return ligature;
    }
  }
  return remainingGrapheme[0] ?? null;
}

/**
 * Matches a single translated InScript keystroke against the remaining slice of the current grapheme.
 */
export function matchGraphemeKeystroke(
  remainingGrapheme: string,
  typedChar: string
): { isCorrect: boolean; consumedLength: number } {
  if (!remainingGrapheme) {
    return { isCorrect: false, consumedLength: 0 };
  }

  if (remainingGrapheme.startsWith(typedChar)) {
    return { isCorrect: true, consumedLength: typedChar.length };
  }

  const expected = getExpectedTargetChar(remainingGrapheme);
  return {
    isCorrect: false,
    consumedLength: expected ? expected.length : 1,
  };
}

interface ActiveGraphemeStep {
  typed: string;
  expectedLen: number;
  isCorrect: boolean;
}

/**
 * Core InScript typing hook: intercepts physical keydowns, maps them via InScript keymap,
 * matches against Devanagari grapheme clusters, tracks live WPM/accuracy, and manages session timers.
 */
export function useInscriptEngine({
  targetText,
  soundEnabled = true,
  timeLimitSeconds,
  onFinish,
  onKeyProcessed,
}: UseInscriptEngineProps) {
  const normalizedTarget = normalizeDevanagari(targetText);
  const targetChars = segmentGraphemes(normalizedTarget);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [subOffset, setSubOffset] = useState(0);
  const [typedHistory, setTypedHistory] = useState<TypedGraphemeEntry[]>([]);
  const [activeCode, setActiveCode] = useState<string | null>(null);
  const [isShiftDown, setIsShiftDown] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [keystrokeCount, setKeystrokeCount] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const keystrokeCountRef = useRef(0);
  const mistakesRef = useRef(0);
  const isFinishedRef = useRef(false);
  const activeStepsRef = useRef<ActiveGraphemeStep[]>([]);
  const onFinishRef = useRef(onFinish);
  const onKeyProcessedRef = useRef(onKeyProcessed);

  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  useEffect(() => {
    onKeyProcessedRef.current = onKeyProcessed;
  }, [onKeyProcessed]);

  const currentGrapheme = currentIndex < targetChars.length ? targetChars[currentIndex] : "";
  const remainingGrapheme = currentGrapheme.slice(subOffset);
  const targetChar = getExpectedTargetChar(remainingGrapheme);

  const finishSession = useCallback(
    (durationSec: number) => {
      if (isFinishedRef.current) return;
      isFinishedRef.current = true;
      setIsFinished(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (soundEnabled) soundEffects.playSuccess();

      const finalDuration = Math.max(1, durationSec);
      setElapsedSeconds(finalDuration);

      const metrics = calculateMetrics({
        charCount: keystrokeCountRef.current,
        mistakes: mistakesRef.current,
        durationSeconds: finalDuration,
      });

      if (onFinishRef.current) onFinishRef.current(metrics);
    },
    [soundEnabled]
  );

  const restart = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    startTimeRef.current = null;
    keystrokeCountRef.current = 0;
    mistakesRef.current = 0;
    isFinishedRef.current = false;
    activeStepsRef.current = [];

    setCurrentIndex(0);
    setSubOffset(0);
    setTypedHistory([]);
    setActiveCode(null);
    setMistakes(0);
    setKeystrokeCount(0);
    setStartTime(null);
    setElapsedSeconds(0);
    setIsFinished(false);
  }, []);

  // Reset engine state automatically when targetText changes
  const prevTargetRef = useRef(normalizedTarget);
  useEffect(() => {
    if (prevTargetRef.current !== normalizedTarget) {
      prevTargetRef.current = normalizedTarget;
      restart();
    }
  }, [normalizedTarget, restart]);

  // Timer loop
  useEffect(() => {
    if (startTime && !isFinished) {
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const diff = Math.floor((now - startTime) / 1000);
        setElapsedSeconds(diff);

        if (timeLimitSeconds && diff >= timeLimitSeconds) {
          finishSession(timeLimitSeconds);
        }
      }, 500);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [startTime, isFinished, timeLimitSeconds, finishSession]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isFinishedRef.current) return;

      if (e.key === "Shift") {
        setIsShiftDown(true);
        return;
      }

      // Ignore standard browser shortcuts
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      setIsShiftDown(e.shiftKey);
      setActiveCode(e.code);

      // Backspace handling: step back within active multi-keystroke grapheme first, otherwise previous grapheme
      if (e.key === "Backspace") {
        e.preventDefault();
        if (activeStepsRef.current.length > 0) {
          const popped = activeStepsRef.current.pop()!;
          setSubOffset((prev) => Math.max(0, prev - popped.expectedLen));
        } else if (currentIndex > 0) {
          setCurrentIndex((prev) => prev - 1);
          setSubOffset(0);
          setTypedHistory((prev) => prev.slice(0, -1));
        }
        return;
      }

      if (currentIndex >= targetChars.length) return;

      const marathiChar = translateKey(e.code, e.shiftKey);
      if (!marathiChar) return;

      e.preventDefault();

      // Start timer on first valid keypress
      if (!startTimeRef.current) {
        const now = Date.now();
        startTimeRef.current = now;
        setStartTime(now);
      }

      const expectedTargetChar = getExpectedTargetChar(remainingGrapheme);
      const { isCorrect, consumedLength } = matchGraphemeKeystroke(remainingGrapheme, marathiChar);

      keystrokeCountRef.current += 1;
      setKeystrokeCount(keystrokeCountRef.current);

      if (isCorrect) {
        if (soundEnabled) soundEffects.playKeyClick();
      } else {
        if (soundEnabled) soundEffects.playError();
        mistakesRef.current += 1;
        setMistakes(mistakesRef.current);
      }

      if (onKeyProcessedRef.current) {
        onKeyProcessedRef.current(expectedTargetChar ?? targetChar ?? marathiChar, isCorrect);
      }

      const nextSteps: ActiveGraphemeStep[] = [
        ...activeStepsRef.current,
        { typed: marathiChar, expectedLen: consumedLength, isCorrect },
      ];
      const nextSubOffset = subOffset + consumedLength;

      if (nextSubOffset >= currentGrapheme.length) {
        const combinedTyped = nextSteps.map((s) => s.typed).join("");
        const graphemeCorrect = nextSteps.every((s) => s.isCorrect);

        activeStepsRef.current = [];
        setSubOffset(0);
        setTypedHistory((prev) => [...prev, { char: combinedTyped, isCorrect: graphemeCorrect }]);

        const nextIndex = currentIndex + 1;
        setCurrentIndex(nextIndex);

        if (nextIndex >= targetChars.length) {
          const dur = Math.max(1, Math.floor((Date.now() - (startTimeRef.current || Date.now())) / 1000));
          finishSession(dur);
        }
      } else {
        activeStepsRef.current = nextSteps;
        setSubOffset(nextSubOffset);
      }
    },
    [
      currentIndex,
      subOffset,
      currentGrapheme,
      remainingGrapheme,
      targetChar,
      targetChars.length,
      soundEnabled,
      finishSession,
    ]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === "Shift") {
      setIsShiftDown(false);
    }
    setActiveCode(null);
  }, []);

  const handleBlur = useCallback(() => {
    setIsShiftDown(false);
    setActiveCode(null);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  const metrics = calculateMetrics({
    charCount: keystrokeCount,
    mistakes,
    durationSeconds: Math.max(1, elapsedSeconds),
  });

  return {
    currentIndex,
    targetChars,
    targetChar,
    typedHistory,
    activeCode,
    isShiftDown,
    isFinished,
    elapsedSeconds,
    metrics,
    restart,
  };
}
