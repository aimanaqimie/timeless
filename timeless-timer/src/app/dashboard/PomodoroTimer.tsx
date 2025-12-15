"use client";

import { useState, useEffect, useCallback } from "react";

type TimerMode = "work" | "shortBreak" | "longBreak";

const DEFAULT_DURATIONS: Record<TimerMode, number> = {
  work: 25,
  shortBreak: 5,
  longBreak: 15,
};

const MODE_LABELS: Record<TimerMode, string> = {
  work: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<TimerMode>("work");
  const [durations, setDurations] = useState(DEFAULT_DURATIONS);
  const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATIONS.work * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [isEditingDuration, setIsEditingDuration] = useState(false);
  const [tempDuration, setTempDuration] = useState("");

  const resetTimer = useCallback((newMode: TimerMode, newDurations?: Record<TimerMode, number>, autoStart: boolean = false) => {
    const durs = newDurations || durations;
    setMode(newMode);
    setTimeLeft(durs[newMode] * 60);
    setIsRunning(autoStart);
  }, [durations]);

  const handleModeChange = (newMode: TimerMode) => {
    resetTimer(newMode);
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setTimeLeft(durations[mode] * 60);
    setIsRunning(false);
  };

  const fastForward = (seconds: number) => {
    setTimeLeft((prev) => Math.max(0, prev - seconds));
  };

  const startEditDuration = () => {
    setTempDuration(durations[mode].toString());
    setIsEditingDuration(true);
  };

  const saveDuration = () => {
    const newMinutes = parseInt(tempDuration);
    if (newMinutes > 0 && newMinutes <= 120) {
      const newDurations = { ...durations, [mode]: newMinutes };
      setDurations(newDurations);
      setTimeLeft(newMinutes * 60);
    }
    setIsEditingDuration(false);
  };

  const cancelEditDuration = () => {
    const defaultMinutes = DEFAULT_DURATIONS[mode];
    setDurations({ ...durations, [mode]: defaultMinutes });
    setTimeLeft(defaultMinutes * 60);
    setIsEditingDuration(false);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (mode === "work") {
        setSessions((prev) => prev + 1);
        const newSessions = sessions + 1;
        if (newSessions % 4 === 0) {
          resetTimer("longBreak", undefined, true);
        } else {
          resetTimer("shortBreak", undefined, true);
        }
      } else {
        resetTimer("work", undefined, true);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, sessions, resetTimer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((durations[mode] * 60 - timeLeft) / (durations[mode] * 60)) * 100;

  return (
    <div className="w-full max-w-130 rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-nowrap gap-2">
          {(["work", "shortBreak", "longBreak"] as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                mode === m
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        <div className="relative flex h-48 w-48 items-center justify-center">
          <svg className="absolute h-full w-full -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-zinc-200 dark:text-zinc-800"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 88}
              strokeDashoffset={2 * Math.PI * 88 * (1 - progress / 100)}
              strokeLinecap="round"
              className={`transition-all duration-1000 ${
                mode === "work"
                  ? "text-black dark:text-white"
                  : mode === "shortBreak"
                    ? "text-emerald-500"
                    : "text-blue-500"
              }`}
            />
          </svg>
          {isEditingDuration ? (
            <div className="flex flex-col items-center gap-1">
              <input
                type="number"
                value={tempDuration}
                onChange={(e) => setTempDuration(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveDuration();
                  if (e.key === "Escape") cancelEditDuration();
                }}
                onBlur={saveDuration}
                min="1"
                max="120"
                className="w-20 rounded-lg border border-black/20 bg-transparent px-2 py-1 text-center text-4xl font-bold text-black outline-none focus:border-black dark:border-white/20 dark:text-white dark:focus:border-white"
                autoFocus
              />
              <span className="text-sm text-zinc-500">minutes</span>
            </div>
          ) : (
            <span className="text-5xl font-bold tabular-nums text-black dark:text-white">
              {formatTime(timeLeft)}
            </span>
          )}
        </div>

        {isEditingDuration ? (
          <div className="flex gap-2">
            <button
              onClick={saveDuration}
              className="flex h-9 items-center justify-center rounded-full bg-black px-4 text-sm font-medium text-white dark:bg-white dark:text-black"
            >
              Save
            </button>
            <button
              onClick={cancelEditDuration}
              className="flex h-9 items-center justify-center rounded-full border border-black/20 px-4 text-sm font-medium text-black dark:border-white/20 dark:text-white"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={startEditDuration}
            disabled={isRunning}
            className="flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-black disabled:opacity-50 dark:text-zinc-400 dark:hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            Edit Duration
          </button>
        )}

        <div className="flex gap-3">
          <button
            onClick={toggleTimer}
            className="flex h-12 w-32 items-center justify-center rounded-full bg-black text-base font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={handleReset}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-black/20 text-black transition-colors hover:bg-zinc-100 dark:border-white/20 dark:text-white dark:hover:bg-zinc-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => fastForward(15)}
            className="flex h-9 items-center justify-center rounded-full border border-black/20 px-3 text-xs font-medium text-black transition-colors hover:bg-zinc-100 dark:border-white/20 dark:text-white dark:hover:bg-zinc-800"
          >
            +15s
          </button>
          <button
            onClick={() => fastForward(30)}
            className="flex h-9 items-center justify-center rounded-full border border-black/20 px-3 text-xs font-medium text-black transition-colors hover:bg-zinc-100 dark:border-white/20 dark:text-white dark:hover:bg-zinc-800"
          >
            +30s
          </button>
          <button
            onClick={() => fastForward(60)}
            className="flex h-9 items-center justify-center rounded-full border border-black/20 px-3 text-xs font-medium text-black transition-colors hover:bg-zinc-100 dark:border-white/20 dark:text-white dark:hover:bg-zinc-800"
          >
            +1m
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>Sessions completed:</span>
          <span className="font-semibold text-black dark:text-white">{sessions}</span>
          <button
            onClick={() => setSessions(0)}
            className="ml-1 rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
            title="Reset sessions"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
