"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Flame,
  Sparkles,
  Zap,
  Target,
  RefreshCw,
  Play,
  CheckCircle2,
  Trophy,
  ArrowRight,
  TrendingUp,
  Plus,
} from "lucide-react";
import { playSubtaskSound, triggerConfetti } from "@/lib/soundFx";

const BOOST_QUOTES = [
  "Accenture and top tier recruiters don't look for geniuses; they look for relentless consistency.",
  "Every problem you debug today is one less surprise in your upcoming technical interview.",
  "Small daily disciplines compound into life-changing packages.",
  "Action cures anxiety. Knocking out 1 target builds unstoppable momentum.",
  "Champions train when no one is watching. Slay your targets today!",
  "The secret to cracking placements is simple: show up every single day.",
];

export const DailyQuestBanner: React.FC = () => {
  const {
    tasks,
    currentUser,
    startFocusSession,
    activeSession,
    isTimerRunning,
    streak,
    xp,
    level,
    levelTitle,
    xpProgress,
    quickCompleteTask,
    setCelebrationData,
    setIsQuickAddOpen,
  } = useApp();

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  // User tasks
  const myTasks = tasks.filter((t) => t.assigned_to === currentUser.id);
  const completedCount = myTasks.filter((t) => t.status === "completed").length;
  const totalCount = myTasks.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Next up target to crush
  const nextTarget =
    myTasks.find((t) => t.status === "in_progress") ||
    myTasks.find((t) => (t.priority === "urgent" || t.priority === "high") && t.status !== "completed") ||
    myTasks.find((t) => t.status !== "completed");

  const isNextRunning = activeSession?.task_id === nextTarget?.id;

  const handleShuffleQuote = () => {
    setIsRotating(true);
    playSubtaskSound();
    setQuoteIndex((prev) => (prev + 1) % BOOST_QUOTES.length);
    setTimeout(() => setIsRotating(false), 500);
  };

  const handleQuickFinish = (taskId: string, title: string) => {
    quickCompleteTask(taskId, true);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-surface to-slate-900/30 p-5 sm:p-6 shadow-xl backdrop-blur-md">
      {/* Dynamic ambient lights */}
      <div className="absolute -top-24 -right-12 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-12 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Section: Daily Quest Status & Progress */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center space-x-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary">
              <Target className="h-3.5 w-3.5" />
              <span>Daily Quest Objective</span>
            </span>

            <div className="flex items-center space-x-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <Flame className="h-3.5 w-3.5 fill-current animate-flame" />
              <span>{streak}-Day Streak Shield</span>
            </div>

            <div className="flex items-center space-x-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <Trophy className="h-3.5 w-3.5" />
              <span>Lv.{level} {levelTitle.split(" ")[0]}</span>
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <h2 className="text-lg font-black tracking-tight text-foreground sm:text-xl">
                {totalCount === 0
                  ? "🌅 Clean Slate: Start Fresh Tomorrow!"
                  : completedCount >= totalCount
                  ? "🎉 Daily Quest Conquered! All Targets Crushed!"
                  : `🎯 ${completedCount} of ${totalCount} Targets Finished (${progressPercentage}%)`}
              </h2>
              <span className="text-xs font-bold text-primary font-mono">
                {totalCount === 0 ? "Ready For Day 1" : `+${completedCount * 50} XP Today`}
              </span>
            </div>

            {/* Glowing animated progress bar */}
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-200/60 dark:bg-slate-800/80 border border-border">
              <div
                className="h-full bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 transition-all duration-700 relative overflow-hidden"
                style={{ width: `${Math.max(5, progressPercentage)}%` }}
              >
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            </div>

            <p className="mt-1 text-[11px] text-secondary">
              {totalCount === 0
                ? "All previous tasks erased. Wake up tomorrow morning with a clean mind and unstoppable discipline!"
                : completedCount >= totalCount
                ? "Incredible work! You secured today's streak and full XP milestone reward!"
                : `${totalCount - completedCount} more target(s) to guarantee your placement streak lock!`}
            </p>
          </div>

          {/* Motivational Mindset Quote */}
          <div className="flex items-center justify-between rounded-2xl border border-border/80 bg-surface/70 px-3.5 py-2 backdrop-blur-sm">
            <div className="flex items-center space-x-2.5 truncate mr-2">
              <Sparkles className="h-4 w-4 shrink-0 text-amber-500" />
              <p className="text-xs italic text-foreground/90 truncate font-medium">
                &ldquo;{BOOST_QUOTES[quoteIndex]}&rdquo;
              </p>
            </div>
            <button
              onClick={handleShuffleQuote}
              className={`p-1.5 text-secondary hover:text-foreground rounded-lg hover:bg-surface-raised transition-all ${
                isRotating ? "rotate-180" : ""
              }`}
              title="Shuffle Mindset Quote"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Section: 1-Click Focus Blitz Card or Tomorrow's Fresh Start Card */}
        {nextTarget ? (
          <div className="flex flex-col justify-between rounded-2xl border border-primary/30 bg-surface/90 p-4 shadow-md sm:min-w-[280px] lg:max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1 text-[11px] font-bold text-amber-500">
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Next Recommended Sprint</span>
              </span>
              <span className="rounded bg-primary-subtle px-1.5 py-0.5 text-[10px] font-bold font-mono text-primary">
                {nextTarget.estimated_minutes}m
              </span>
            </div>

            <h3 className="text-xs font-bold text-foreground line-clamp-1 mb-1">
              {nextTarget.title}
            </h3>
            <p className="text-[11px] text-secondary line-clamp-1 mb-3">
              {nextTarget.description || "High priority target ready for deep focus."}
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => startFocusSession(nextTarget.id)}
                className={`flex flex-1 items-center justify-center space-x-1.5 rounded-xl py-2 px-3 text-xs font-bold text-white shadow-sm transition-all hover:scale-[1.02] ${
                  isNextRunning
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-primary hover:bg-primary-hover"
                }`}
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isNextRunning ? "In Session" : "Start Sprint"}</span>
              </button>

              <button
                onClick={() => handleQuickFinish(nextTarget.id, nextTarget.title)}
                className="flex items-center justify-center rounded-xl border border-border bg-surface px-3 py-2 text-xs font-bold text-foreground hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors"
                title="Mark finished immediately"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-between rounded-2xl border border-dashed border-indigo-400/40 bg-surface/80 p-4 shadow-md sm:min-w-[280px] lg:max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center space-x-1 text-[11px] font-bold text-indigo-500 dark:text-indigo-400">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Tomorrow&rsquo;s Fresh Slate</span>
              </span>
              <span className="rounded bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 text-[10px] font-bold text-indigo-500 dark:text-indigo-400">
                Day 1 Ready
              </span>
            </div>

            <h3 className="text-xs font-bold text-foreground mb-1">
              Start Fresh Tomorrow Morning
            </h3>
            <p className="text-[11px] text-secondary mb-3 leading-relaxed">
              Your profile is intact. Plan tomorrow&rsquo;s first priority target now or hit the ground running at sunrise.
            </p>

            <button
              onClick={() => setIsQuickAddOpen(true)}
              className="flex items-center justify-center space-x-1.5 rounded-xl bg-gradient-to-r from-primary to-indigo-600 py-2.5 px-3 text-xs font-bold text-white shadow-md hover:from-primary-hover hover:to-indigo-700 transition-all hover:scale-[1.02]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>+ Plan Tomorrow&rsquo;s Target</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
