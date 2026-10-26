"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar as CalendarIcon,
  Flame,
  Zap,
  Sparkles,
  Hourglass,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export const TimeUrgencyClock: React.FC = () => {
  const [now, setNow] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format Time: HH:MM:SS AM/PM
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const formattedHours = (hours % 12 || 12).toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  // Full formatted Date
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = now.toLocaleDateString("en-US", dateOptions);

  // Day elapsed calculation (86400 seconds in a day)
  const totalSecondsToday = hours * 3600 + minutes * 60 + seconds;
  const dayPercentage = Math.min(100, Math.max(0, (totalSecondsToday / 86400) * 100));

  // Time remaining until Midnight (Tomorrow's clean slate)
  const secondsRemaining = 86400 - totalSecondsToday;
  const remHours = Math.floor(secondsRemaining / 3600);
  const remMins = Math.floor((secondsRemaining % 3600) / 60);
  const remSecs = secondsRemaining % 60;

  // Day of Year calculation
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diffTime = now.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
  const isLeapYear = (year: number) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDaysInYear = isLeapYear(now.getFullYear()) ? 366 : 365;
  const yearPercentage = ((dayOfYear / totalDaysInYear) * 100).toFixed(1);

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-4 sm:p-7 shadow-2xl backdrop-blur-xl">
      {/* Background ambient pulsing lights */}
      <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full bg-rose-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-4 sm:gap-6">
        {/* Top Tag & Date Header */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 border-b border-white/10 pb-3 sm:pb-4">
          <div className="flex items-center space-x-2">
            <span className="flex items-center space-x-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-rose-300 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-rose-400" />
              <span>Time Passing Live</span>
            </span>

            <span className="hidden sm:inline-flex items-center space-x-1 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-slate-300">
              <CalendarIcon className="h-3 w-3 text-indigo-400" />
              <span>IST Timezone</span>
            </span>
          </div>

          <div className="text-xs sm:text-sm font-semibold tracking-wide text-slate-300 flex items-center space-x-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-amber-200 font-bold">{formattedDate}</span>
          </div>
        </div>

        {/* Big Highlighted Digital Clock */}
        <div className="flex flex-col items-center justify-center text-center py-1 sm:py-4">
          <div className="flex items-baseline justify-center space-x-1 sm:space-x-3 font-mono font-black tracking-tighter">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className="text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-md">
                {formattedHours}
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mt-1">
                Hours
              </span>
            </div>

            {/* Pulsing Colon */}
            <span className="text-2xl min-[380px]:text-3xl sm:text-5xl md:text-6xl text-rose-400/80 animate-pulse">
              :
            </span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className="text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl bg-gradient-to-b from-white via-slate-100 to-slate-400 bg-clip-text text-transparent drop-shadow-md">
                {formattedMinutes}
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mt-1">
                Minutes
              </span>
            </div>

            {/* Pulsing Colon */}
            <span className="text-2xl min-[380px]:text-3xl sm:text-5xl md:text-6xl text-rose-400/80 animate-pulse">
              :
            </span>

            {/* Seconds (Highlighted with Accent) */}
            <div className="flex flex-col items-center">
              <span className="text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl bg-gradient-to-b from-amber-300 via-orange-400 to-rose-500 bg-clip-text text-transparent drop-shadow-lg">
                {formattedSeconds}
              </span>
              <span className="text-[9px] sm:text-[10px] font-sans font-bold text-amber-400 uppercase tracking-widest mt-1">
                Seconds
              </span>
            </div>

            {/* AM/PM */}
            <div className="self-start pl-1 sm:pl-2">
              <span className="rounded-lg bg-indigo-500/20 border border-indigo-400/30 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[11px] sm:text-sm font-black text-indigo-300">
                {ampm}
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-slate-300 font-medium italic">
            &ldquo;Every second ticking away is potential either spent or squandered.&rdquo;
          </p>
        </div>

        {/* Visual Day & Time Urgency Meters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Meter 1: Today's Time Slipped Away */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center space-x-1.5 font-bold text-slate-200">
                <Hourglass className="h-3.5 w-3.5 text-rose-400" />
                <span>Today Slipped Away:</span>
              </span>
              <span className="font-mono font-black text-rose-300">
                {dayPercentage.toFixed(1)}%
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 transition-all duration-1000 relative overflow-hidden"
                style={{ width: `${dayPercentage}%` }}
              >
                <div className="absolute inset-0 animate-shimmer" />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Time before midnight:</span>
              <strong className="text-amber-300">
                {remHours}h {remMins}m {remSecs}s
              </strong>
            </div>
          </div>

          {/* Meter 2: Year & Placement Urgency */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center space-x-1.5 font-bold text-slate-200">
                <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
                <span>Year {now.getFullYear()} Elapsed:</span>
              </span>
              <span className="font-mono font-black text-indigo-300">
                {yearPercentage}% (Day {dayOfYear}/{totalDaysInYear})
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800 border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-1000"
                style={{ width: `${yearPercentage}%` }}
              />
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>Tomorrow&rsquo;s Clean Start:</span>
              <strong className="text-emerald-400 font-bold">100% Fresh Canvas Ahead</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
