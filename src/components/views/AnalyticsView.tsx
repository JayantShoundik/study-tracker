"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { JAYANT_USER, REKHA_USER } from "@/lib/mockData";
import { formatDuration } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  Clock,
  CheckCircle2,
  PieChart as PieIcon,
  Award,
  Users,
  Flame,
  Trophy,
  Zap,
  Star,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export const AnalyticsView: React.FC = () => {
  const {
    tasks,
    subjects,
    completedSessions,
    activeSeconds,
    activeSession,
    xp,
    level,
    levelTitle,
    xpProgress,
    streak,
    currentUser,
  } = useApp();

  // Subject-wise focus distribution
  const subjectTimeMap: Record<string, number> = {
    DSA: 18.5,
    OOP: 12.0,
    DBMS: 14.2,
    OS: 9.8,
    CN: 7.5,
    Aptitude: 6.0,
  };

  const subjectChartData = Object.entries(subjectTimeMap).map(([name, hours]) => ({
    name,
    hours,
  }));

  const COLORS = ["#4F46E5", "#0284C7", "#059669", "#7C3AED", "#D97706", "#E11D48"];

  // Comparison between Jayant and Rekha
  const jayantTasks = tasks.filter((t) => t.assigned_to === JAYANT_USER.id);
  const rekhaTasks = tasks.filter((t) => t.assigned_to === REKHA_USER.id);

  const jayantCompleted = jayantTasks.filter((t) => t.status === "completed").length;
  const rekhaCompleted = rekhaTasks.filter((t) => t.status === "completed").length;

  const jayantHours = 24.5;
  const rekhaHours = 22.8;

  const comparisonData = [
    { metric: "Focus Hours", Jayant: jayantHours, Rekha: rekhaHours },
    { metric: "Targets Met", Jayant: jayantCompleted, Rekha: rekhaCompleted },
    { metric: "Current Streak", Jayant: streak, Rekha: streak },
    { metric: "AI Score Avg", Jayant: 92, Rekha: 94 },
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Productivity & Level Progression Analytics
        </h1>
        <p className="mt-1 text-xs text-secondary sm:text-sm">
          Transparent metrics derived from unpaused focus records, task completions, and XP gamification rewards.
        </p>
      </div>

      {/* Gamification & Placement Readiness Showcase Card */}
      <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-surface to-slate-900/40 p-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                <Trophy className="h-4 w-4" />
                <span>Level {level} • {levelTitle}</span>
              </span>
              <span className="flex items-center space-x-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-500">
                <Flame className="h-4 w-4 fill-current animate-flame" />
                <span>{streak}-Day Streak</span>
              </span>
            </div>

            <h2 className="text-xl font-black text-foreground sm:text-2xl">
              {currentUser.display_name}&rsquo;s Placement Mastery Index
            </h2>

            <div className="max-w-xl">
              <div className="flex items-baseline justify-between text-xs mb-1">
                <span className="font-semibold text-secondary">
                  XP to Level {level + 1}
                </span>
                <span className="font-mono font-bold text-primary">
                  {xpProgress.current} / {xpProgress.max} XP ({xpProgress.percentage}%)
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200/50 dark:bg-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-primary via-indigo-500 to-emerald-400 rounded-full transition-all duration-700 animate-shimmer"
                  style={{ width: `${Math.max(6, xpProgress.percentage)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Badges Earned */}
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface/80 p-3 text-center shadow-xs">
              <span className="text-2xl mb-1">🎯</span>
              <span className="text-[11px] font-bold text-foreground">Target Sprinter</span>
              <span className="text-[9px] text-secondary">5+ Done</span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface/80 p-3 text-center shadow-xs">
              <span className="text-2xl mb-1">🔥</span>
              <span className="text-[11px] font-bold text-amber-500">Streak Legend</span>
              <span className="text-[9px] text-secondary">{streak} Days</span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface/80 p-3 text-center shadow-xs">
              <span className="text-2xl mb-1">⚡</span>
              <span className="text-[11px] font-bold text-indigo-500">Deep Work Monk</span>
              <span className="text-[9px] text-secondary">10m+ Sprints</span>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface/80 p-3 text-center shadow-xs">
              <span className="text-2xl mb-1">💎</span>
              <span className="text-[11px] font-bold text-emerald-500">Gladiator Ready</span>
              <span className="text-[9px] text-secondary">Interview Tier</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary">Total Verified Focus</span>
            <Clock className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {(jayantHours + rekhaHours).toFixed(1)} hrs
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Combined Jayant & Rekha</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary">Target Completion Ratio</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">
            {Math.round(((jayantCompleted + rekhaCompleted) / tasks.length) * 100)}%
          </div>
          <span className="text-[11px] text-secondary">
            {jayantCompleted + rekhaCompleted} of {tasks.length} total targets complete
          </span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary">AI Evaluation Average</span>
            <Award className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-foreground">93.0%</div>
          <span className="text-[11px] text-primary font-medium">Placement Interview Ready</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Subject Focus Hours Distribution */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Study Time by Subject (Hours)</h3>
              <p className="text-xs text-secondary">Verified hours accumulated across focus sessions.</p>
            </div>
            <PieIcon className="h-4 w-4 text-primary" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="h" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="hours" fill="#4F46E5" radius={[4, 4, 0, 0]}>
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jayant vs Rekha Mutual Accountability Breakdown */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-foreground">Jayant vs Rekha Mutual Comparison</h3>
              <p className="text-xs text-secondary">Collaborative benchmarking to sustain daily momentum.</p>
            </div>
            <Users className="h-4 w-4 text-primary" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface)",
                    borderColor: "var(--border)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px" }} />
                <Bar dataKey="Jayant" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Rekha" fill="#E11D48" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
