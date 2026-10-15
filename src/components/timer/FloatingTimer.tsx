"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatDuration } from "@/lib/utils";
import {
  Play,
  Pause,
  Square,
  Maximize2,
  Minimize2,
  CheckCircle,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  Clock,
  Sparkles,
} from "lucide-react";

export const FloatingTimer: React.FC = () => {
  const {
    activeSession,
    activeSeconds,
    isTimerRunning,
    pauseFocusSession,
    resumeFocusSession,
    stopFocusSession,
    completeTaskWithVerification,
    setActiveTab,
    isFloatingTimerOpen,
    setIsFloatingTimerOpen,
  } = useApp();

  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [minimized, setMinimized] = useState<boolean>(false);

  if (!activeSession || !isFloatingTimerOpen) return null;

  const minRequiredSeconds = activeSession.task?.minimum_focus_seconds || 600;
  const progressPercent = Math.min(100, Math.round((activeSeconds / minRequiredSeconds) * 100));
  const hasMetTenMinutes = activeSeconds >= minRequiredSeconds;

  const handleComplete = () => {
    if (!activeSession.task_id) return;
    const result = completeTaskWithVerification(activeSession.task_id);
    if (!result.success) {
      setVerificationError(result.message);
      setTimeout(() => setVerificationError(null), 6000);
    } else {
      setVerificationError(null);
    }
  };

  const handleOpenFocusRoom = () => {
    setActiveTab("focus");
  };

  if (minimized) {
    return (
      <div className="fixed bottom-5 right-5 z-40 flex items-center space-x-2 rounded-full border border-primary/40 bg-surface px-4 py-2 shadow-floating transition-all duration-200">
        <div className={`h-2.5 w-2.5 rounded-full ${isTimerRunning ? "animate-pulse bg-emerald-500" : "bg-warning"}`} />
        <span className="font-mono text-xs font-bold text-foreground">{formatDuration(activeSeconds)}</span>
        <button
          onClick={() => setMinimized(false)}
          className="rounded-full p-1 text-secondary hover:bg-surface-raised hover:text-foreground"
          title="Expand timer"
        >
          <ChevronUp className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 w-96 rounded-2xl border border-border bg-surface p-4 shadow-floating backdrop-blur transition-all duration-200 animate-scale-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-2.5">
        <div className="flex items-center space-x-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-subtle text-primary">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-foreground">Active Focus Session</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[9px] font-bold ${
                  isTimerRunning ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                }`}
              >
                {isTimerRunning ? "RUNNING" : "PAUSED"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={handleOpenFocusRoom}
            className="rounded-md p-1.5 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
            title="Expand to Full Focus Room"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setMinimized(true)}
            className="rounded-md p-1.5 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
            title="Minimize"
          >
            <Minimize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Task Info */}
      <div className="mt-3">
        <h4 className="text-xs font-semibold text-foreground line-clamp-1">
          {activeSession.task?.title || "Focusing"}
        </h4>
        <p className="text-[11px] text-secondary mt-0.5 line-clamp-1">
          {activeSession.task?.learning_objectives || "Concentrate deeply on core concepts and implementation."}
        </p>
      </div>

      {/* Timer Counter */}
      <div className="my-3 flex items-baseline justify-between">
        <div className="font-mono text-3xl font-extrabold tracking-tight text-foreground">
          {formatDuration(activeSeconds)}
        </div>
        <div className="text-right">
          <span className="text-[11px] font-medium text-secondary">
            Min Requirement: <strong className="text-foreground">{Math.floor(minRequiredSeconds / 60)}m</strong>
          </span>
          <div className="text-[10px] text-primary font-semibold">
            {hasMetTenMinutes ? "Rule Satisfied (Ready)" : `${Math.ceil((minRequiredSeconds - activeSeconds) / 60)}m left`}
          </div>
        </div>
      </div>

      {/* Progress Bar for 10-Minute Minimum Rule */}
      <div className="space-y-1">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-raised">
          <div
            className={`h-full transition-all duration-300 ${
              hasMetTenMinutes ? "bg-emerald-500" : "bg-primary"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Error / Warning Alert if 10-min rule is not met */}
      {verificationError && (
        <div className="mt-2.5 flex items-start space-x-2 rounded-lg bg-danger/10 border border-danger/20 p-2 text-[11px] text-danger animate-scale-in">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="leading-tight">{verificationError}</p>
        </div>
      )}

      {/* Control Buttons */}
      <div className="mt-3.5 flex items-center justify-between space-x-2">
        <div className="flex space-x-2">
          {isTimerRunning ? (
            <button
              onClick={pauseFocusSession}
              className="flex items-center space-x-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-border transition-colors"
            >
              <Pause className="h-3.5 w-3.5" />
              <span>Pause</span>
            </button>
          ) : (
            <button
              onClick={resumeFocusSession}
              className="flex items-center space-x-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Resume</span>
            </button>
          )}

          <button
            onClick={stopFocusSession}
            className="flex items-center space-x-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
            title="Stop & save session"
          >
            <Square className="h-3.5 w-3.5" />
            <span>Stop</span>
          </button>
        </div>

        <button
          onClick={handleComplete}
          className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all shadow-sm ${
            hasMetTenMinutes
              ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
              : "bg-surface-raised text-secondary hover:bg-border cursor-pointer"
          }`}
          title="Verify and complete task"
        >
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Complete</span>
        </button>
      </div>
    </div>
  );
};
