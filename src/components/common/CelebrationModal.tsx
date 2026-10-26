"use client";

import React, { useEffect } from "react";
import { Flame, Trophy, Sparkles, X, ArrowRight, Coffee, Award, Star } from "lucide-react";
import { triggerConfetti, playLevelUpSound } from "@/lib/soundFx";

export interface CelebrationData {
  isOpen: boolean;
  title: string;
  subtitle: string;
  xpEarned: number;
  streakCount: number;
  quote?: string;
  type?: "target" | "daily_goal" | "level_up";
}

interface CelebrationModalProps {
  data: CelebrationData;
  onClose: () => void;
  onStartNext?: () => void;
}

const MOTIVATIONAL_QUOTES = [
  "Champions do daily what others do occasionally. One target closer to your dream offer!",
  "Small daily disciplines compound into life-changing engineering packages.",
  "Your future self is thanking you right now for not giving up on today's targets.",
  "Consistency is the ultimate unfair advantage in tech placements.",
  "Code by code, problem by problem—you are building the mindset of a top-tier engineer.",
];

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  data,
  onClose,
  onStartNext,
}) => {
  useEffect(() => {
    if (data.isOpen) {
      if (data.type === "level_up" || data.type === "daily_goal") {
        triggerConfetti("fireworks");
        playLevelUpSound();
      } else {
        triggerConfetti("standard");
      }
    }
  }, [data.isOpen, data.type]);

  if (!data.isOpen) return null;

  const randomQuote =
    data.quote ||
    MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-scale-in">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-indigo-500/30 bg-surface p-6 sm:p-8 shadow-2xl">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -left-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Hero Visual */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 shadow-lg animate-soft-bounce">
            {data.type === "level_up" ? (
              <Trophy className="h-10 w-10 text-white" />
            ) : data.type === "daily_goal" ? (
              <Award className="h-10 w-10 text-white" />
            ) : (
              <Flame className="h-10 w-10 text-white animate-flame" />
            )}
            <div className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-300 text-slate-900 shadow-md">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
          </div>

          <span className="rounded-full bg-primary-subtle px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary">
            {data.type === "level_up"
              ? "Level Up Unlocked!"
              : data.type === "daily_goal"
              ? "Daily Quest Victory!"
              : "Target Accomplished!"}
          </span>

          <h2 className="mt-2 text-2xl font-black text-foreground sm:text-3xl">
            {data.title}
          </h2>

          <p className="mt-1 text-xs text-secondary sm:text-sm">
            {data.subtitle}
          </p>

          {/* Rewards Grid */}
          <div className="mt-5 grid grid-cols-2 gap-3 w-full">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-950/30 p-3">
              <div className="flex items-center space-x-1 text-primary">
                <Star className="h-4 w-4 fill-current" />
                <span className="text-lg font-black">+{data.xpEarned} XP</span>
              </div>
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider mt-0.5">
                Focus Rewarded
              </span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/30 p-3">
              <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400">
                <Flame className="h-4 w-4 fill-current animate-flame" />
                <span className="text-lg font-black">{data.streakCount} Days</span>
              </div>
              <span className="text-[10px] font-semibold text-secondary uppercase tracking-wider mt-0.5">
                Streak Maintained
              </span>
            </div>
          </div>

          {/* Inspirational Quote Card */}
          <div className="mt-5 rounded-2xl border border-border bg-surface-raised/70 p-3.5 text-left w-full">
            <p className="text-xs italic text-foreground/90 leading-relaxed">
              &ldquo;{randomQuote}&rdquo;
            </p>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-2.5 w-full">
            {onStartNext && (
              <button
                onClick={() => {
                  onClose();
                  onStartNext();
                }}
                className="flex items-center justify-center space-x-2 w-full rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md hover:from-primary-hover hover:to-indigo-700 transition-all hover:scale-[1.02]"
              >
                <span>Crush Next Target</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="flex items-center justify-center space-x-2 w-full rounded-xl border border-border bg-surface px-5 py-3 text-xs font-bold text-foreground hover:bg-surface-raised transition-all"
            >
              <Coffee className="h-4 w-4 text-secondary" />
              <span>Take a Quick Breath</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
