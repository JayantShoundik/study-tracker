"use client";

import React, { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { formatDuration } from "@/lib/utils";
import {
  Timer,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertTriangle,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  BookOpen,
  RotateCcw,
  ListOrdered,
  FileEdit,
} from "lucide-react";

export const FocusRoomView: React.FC = () => {
  const {
    activeSession,
    activeSeconds,
    isTimerRunning,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    stopFocusSession,
    completeTaskWithVerification,
    tasks,
    currentUser,
    completedSessions,
    setActiveTab,
  } = useApp();

  const [activeMode, setActiveMode] = useState<"task_timer" | "stopwatch">("task_timer");
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const [stopwatchTitle, setStopwatchTitle] = useState("Mock Technical Interview Speed Drill");
  const stopwatchIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [scratchpadText, setScratchpadText] = useState("");
  const [ambientSound, setAmbientSound] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Stopwatch interval
  useEffect(() => {
    if (isStopwatchRunning) {
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    }
    return () => {
      if (stopwatchIntervalRef.current) clearInterval(stopwatchIntervalRef.current);
    };
  }, [isStopwatchRunning]);

  // Ambient sound generator via Web Audio API (gentle focus white noise / tone)
  useEffect(() => {
    if (ambientSound) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(144, ctx.currentTime); // 144Hz grounding focus hum
        gain.gain.setValueAtTime(0.015, ctx.currentTime); // gentle ambient volume

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();

        audioContextRef.current = ctx;
        oscillatorRef.current = osc;
      } catch (e) {
        console.warn("Web Audio ambient generator error", e);
      }
    } else {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {}
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    }

    return () => {
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch {}
      }
      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch {}
      }
    };
  }, [ambientSound]);

  const minRequiredSeconds = activeSession?.task?.minimum_focus_seconds || 600;
  const hasMetTenMinutes = activeSeconds >= minRequiredSeconds;
  const progressPercent = Math.min(100, Math.round((activeSeconds / minRequiredSeconds) * 100));

  const handleComplete = () => {
    if (!activeSession?.task_id) return;
    const res = completeTaskWithVerification(activeSession.task_id);
    if (!res.success) {
      setErrorMessage(res.message);
      setTimeout(() => setErrorMessage(null), 7000);
    } else {
      setErrorMessage(null);
    }
  };

  const userPendingTasks = tasks.filter(
    (t) => t.assigned_to === currentUser.id && t.status !== "completed"
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Focus Room & Timers
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Distraction-free environment with persistent focus tracking and separate practice stopwatch.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {/* Ambient Audio Toggle */}
          <button
            onClick={() => setAmbientSound(!ambientSound)}
            className={`flex items-center space-x-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors ${
              ambientSound
                ? "border-primary bg-primary-subtle text-primary"
                : "border-border bg-surface text-secondary hover:bg-surface-raised"
            }`}
          >
            {ambientSound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span>{ambientSound ? "Binaural Tone: ON" : "Ambient Tone: OFF"}</span>
          </button>

          {/* Mode Switcher */}
          <div className="flex rounded-xl border border-border bg-surface-raised p-1">
            <button
              onClick={() => setActiveMode("task_timer")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeMode === "task_timer"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Task Timer
            </button>
            <button
              onClick={() => setActiveMode("stopwatch")}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeMode === "stopwatch"
                  ? "bg-surface text-primary shadow-sm"
                  : "text-secondary hover:text-foreground"
              }`}
            >
              Practice Stopwatch
            </button>
          </div>
        </div>
      </div>

      {/* Main Focus Card */}
      {activeMode === "task_timer" ? (
        activeSession ? (
          <div className="rounded-3xl border border-border bg-surface p-8 shadow-floating transition-all">
            <div className="mx-auto max-w-2xl text-center space-y-6">
              {/* Task Title & Status */}
              <div>
                <span
                  className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    isTimerRunning
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isTimerRunning ? "animate-ping bg-emerald-500" : "bg-amber-500"
                    }`}
                  />
                  <span>{isTimerRunning ? "Deep Focus In Progress" : "Session Paused"}</span>
                </span>

                <h2 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">
                  {activeSession.task?.title}
                </h2>
                <p className="mt-1 text-sm text-secondary">
                  {activeSession.task?.learning_objectives || "Focus intently on understanding and implementation."}
                </p>
              </div>

              {/* Big Digital Display */}
              <div className="my-6">
                <div className="font-mono text-6xl font-black tracking-tight text-foreground sm:text-7xl">
                  {formatDuration(activeSeconds)}
                </div>
                <div className="mt-2 text-xs font-semibold text-secondary">
                  Verified Unpaused Focus (Strict 600s Minimum Rule)
                </div>
              </div>

              {/* 10-Minute Progress Indicator */}
              <div className="mx-auto max-w-md space-y-2">
                <div className="flex justify-between text-xs font-bold text-secondary">
                  <span>
                    Min Requirement: <strong>{Math.floor(minRequiredSeconds / 60)} minutes</strong>
                  </span>
                  <span className={hasMetTenMinutes ? "text-emerald-600" : "text-primary"}>
                    {hasMetTenMinutes
                      ? "10-Minute Rule Satisfied"
                      : `${Math.ceil((minRequiredSeconds - activeSeconds) / 60)} mins remaining`}
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-surface-raised border border-border">
                  <div
                    className={`h-full transition-all duration-300 ${
                      hasMetTenMinutes ? "bg-emerald-500" : "bg-primary"
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Verification Error */}
              {errorMessage && (
                <div className="mx-auto flex max-w-md items-start space-x-2 rounded-xl bg-danger/10 border border-danger/20 p-3 text-xs text-danger text-left">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p className="leading-tight">{errorMessage}</p>
                </div>
              )}

              {/* Control Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {isTimerRunning ? (
                  <button
                    onClick={pauseFocusSession}
                    className="flex items-center space-x-2 rounded-xl border border-border bg-surface-raised px-6 py-3 text-sm font-bold text-foreground hover:bg-border transition-colors shadow-sm"
                  >
                    <Pause className="h-4 w-4" />
                    <span>Pause Timer</span>
                  </button>
                ) : (
                  <button
                    onClick={resumeFocusSession}
                    className="flex items-center space-x-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover transition-colors shadow-md"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Resume Timer</span>
                  </button>
                )}

                <button
                  onClick={stopFocusSession}
                  className="flex items-center space-x-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
                >
                  <Square className="h-4 w-4" />
                  <span>Stop Session</span>
                </button>

                <button
                  onClick={handleComplete}
                  className={`flex items-center space-x-2 rounded-xl px-6 py-3 text-sm font-bold shadow-sm transition-all ${
                    hasMetTenMinutes
                      ? "bg-emerald-600 text-white hover:bg-emerald-700"
                      : "bg-surface-raised text-secondary border border-border hover:bg-border"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Target</span>
                </button>
              </div>

              {/* Focus Scratchpad */}
              <div className="mx-auto max-w-lg pt-6 text-left border-t border-border">
                <div className="flex items-center space-x-2 text-xs font-bold text-foreground mb-2">
                  <FileEdit className="h-3.5 w-3.5 text-primary" />
                  <span>Session Scratchpad & Key Insights</span>
                </div>
                <textarea
                  rows={3}
                  value={scratchpadText}
                  onChange={(e) => setScratchpadText(e.target.value)}
                  placeholder="Record edge cases, dry-run values, or questions to verify..."
                  className="w-full rounded-xl border border-border bg-surface-raised p-3 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-surface p-12 text-center shadow-subtle">
            <Clock className="mx-auto h-12 w-12 text-secondary/40" />
            <h2 className="mt-4 text-lg font-bold text-foreground">No Focus Session Running</h2>
            <p className="mt-1 text-xs text-secondary max-w-md mx-auto">
              Select any target below to initiate a focused study sprint with unpaused time verification.
            </p>

            <div className="mt-6 max-w-md mx-auto space-y-2 text-left">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                Ready to Study:
              </span>
              {userPendingTasks.slice(0, 3).map((t) => (
                <div
                  key={t.id}
                  onClick={() => startFocusSession(t.id)}
                  className="flex cursor-pointer items-center justify-between rounded-xl border border-border p-3 hover:border-primary/50 hover:bg-primary-subtle/20 transition-all"
                >
                  <span className="text-xs font-bold text-foreground truncate">{t.title}</span>
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-primary">
                    <Play className="h-3.5 w-3.5 fill-current" />
                    <span>Start</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        /* Stopwatch Mode for Practice / Mock Interviews */
        <div className="rounded-3xl border border-border bg-surface p-8 shadow-floating transition-all">
          <div className="mx-auto max-w-xl text-center space-y-6">
            <div>
              <span className="rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-3 py-1 text-xs font-bold uppercase">
                Practice Stopwatch
              </span>
              <div className="mt-3">
                <input
                  type="text"
                  value={stopwatchTitle}
                  onChange={(e) => setStopwatchTitle(e.target.value)}
                  className="w-full text-center text-xl font-bold text-foreground bg-transparent border-b border-border focus:border-primary focus:outline-none pb-1"
                />
              </div>
              <p className="mt-1 text-xs text-secondary">
                For timed coding questions, mock interview viva, or quantitative aptitude tests.
              </p>
            </div>

            <div className="my-6">
              <div className="font-mono text-6xl font-black text-foreground sm:text-7xl">
                {formatDuration(stopwatchSeconds)}
              </div>
            </div>

            <div className="flex justify-center space-x-3">
              {isStopwatchRunning ? (
                <button
                  onClick={() => setIsStopwatchRunning(false)}
                  className="flex items-center space-x-2 rounded-xl border border-border bg-surface-raised px-6 py-3 text-sm font-bold text-foreground hover:bg-border"
                >
                  <Pause className="h-4 w-4" />
                  <span>Pause</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsStopwatchRunning(true)}
                  className="flex items-center space-x-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-hover shadow-md"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Start Drill</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsStopwatchRunning(false);
                  setStopwatchSeconds(0);
                }}
                className="flex items-center space-x-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold text-secondary hover:bg-surface-raised"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Focus History Log */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
        <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <ListOrdered className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Verified Focus Session Log</h3>
          </div>
          <span className="text-xs text-secondary font-medium">
            {completedSessions.length} logged sessions
          </span>
        </div>

        <div className="space-y-2">
          {completedSessions.slice(0, 5).map((sess) => {
            const task = tasks.find((t) => t.id === sess.task_id);
            return (
              <div
                key={sess.id}
                className="flex items-center justify-between rounded-xl border border-border bg-surface-raised/40 p-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-foreground">{task?.title || "Focus Session"}</h4>
                  <p className="text-[11px] text-secondary">
                    {new Date(sess.started_at).toLocaleDateString()} — Status: {sess.status}
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-foreground">
                    {formatDuration(sess.accumulated_focus_seconds)}
                  </span>
                  <span className="block text-[10px] text-emerald-600 font-semibold">Verified</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
