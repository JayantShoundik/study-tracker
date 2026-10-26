"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { JAYANT_USER, REKHA_USER } from "@/lib/mockData";
import { formatDuration } from "@/lib/utils";
import {
  Flame,
  CheckCircle2,
  Clock,
  AlertCircle,
  Briefcase,
  Play,
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  BookOpen,
  Calendar as CalendarIcon,
  Bot,
  Check,
  Trophy,
  Plus,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { DailyQuestBanner } from "@/components/common/DailyQuestBanner";
import { TimeUrgencyClock } from "@/components/common/TimeUrgencyClock";

export const DashboardView: React.FC = () => {
  const {
    currentUser,
    tasks,
    subjects,
    placements,
    calendarEvents,
    activeSession,
    activeSeconds,
    isTimerRunning,
    startFocusSession,
    completedSessions,
    aiEvaluations,
    setActiveTab,
    setIsQuickAddOpen,
    xp,
    level,
    levelTitle,
    xpProgress,
    streak,
    quickCompleteTask,
    setCelebrationData,
  } = useApp();

  const [viewMode, setViewMode] = useState<"individual" | "shared">("individual");

  // User tasks
  const myTasks = tasks.filter((t) => t.assigned_to === currentUser.id);
  const completedTasks = myTasks.filter((t) => t.status === "completed");
  const inProgressTasks = myTasks.filter((t) => t.status === "in_progress");
  const pendingTasks = myTasks.filter((t) => t.status === "planned");
  const overdueTasks = myTasks.filter((t) => t.status === "overdue");

  // Focus time calculation
  let totalUserFocusSeconds = 0;
  completedSessions
    .filter((s) => s.user_id === currentUser.id)
    .forEach((s) => {
      totalUserFocusSeconds += s.accumulated_focus_seconds;
    });
  if (activeSession && activeSession.user_id === currentUser.id) {
    totalUserFocusSeconds += activeSeconds;
  }

  // Combined shared study time (Jayant + Rekha)
  let sharedFocusSeconds = 0;
  completedSessions.forEach((s) => (sharedFocusSeconds += s.accumulated_focus_seconds));
  if (activeSession) sharedFocusSeconds += activeSeconds;

  // Chart data for weekly planned vs actual study time
  const weeklyData = [
    { day: "Mon", planned: 4.0, actual: 3.8 },
    { day: "Tue", planned: 5.0, actual: 4.5 },
    { day: "Wed", planned: 4.5, actual: 5.0 },
    { day: "Thu", planned: 6.0, actual: 5.2 },
    { day: "Fri", planned: 5.5, actual: 5.8 },
    { day: "Sat", planned: 7.0, actual: 6.5 },
    { day: "Sun", planned: 4.0, actual: 3.5 },
  ];

  // Upcoming interviews and assessments
  const upcomingDeadlines = calendarEvents
    .filter((e) => new Date(e.start_at) >= new Date())
    .slice(0, 3);

  // Active Placement pipelines
  const activePlacements = placements.slice(0, 3);

  return (
    <div className="space-y-6 pb-16">
      {/* Welcome Banner & Mode Toggle */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-6 shadow-subtle sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              FocusForge Command Center
            </h1>
            <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-bold text-primary">
              Active Sprint
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Welcome back, <strong className="text-foreground">{currentUser.display_name}</strong>. Daily target completion rate is{" "}
            <strong className="text-emerald-600">
              {myTasks.length > 0 ? Math.round((completedTasks.length / myTasks.length) * 100) : 0}%
            </strong>
            .
          </p>
        </div>

        {/* Individual vs Shared Workspace Switcher */}
        <div className="flex items-center rounded-xl border border-border bg-surface-raised p-1">
          <button
            onClick={() => setViewMode("individual")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewMode === "individual"
                ? "bg-surface text-primary shadow-sm"
                : "text-secondary hover:text-foreground"
            }`}
          >
            My Target View
          </button>
          <button
            onClick={() => setViewMode("shared")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              viewMode === "shared"
                ? "bg-surface text-primary shadow-sm"
                : "text-secondary hover:text-foreground"
            }`}
          >
            Jayant & Rekha Shared
          </button>
        </div>
      </div>

      {/* Prominent Live Time Urgency Clock */}
      <TimeUrgencyClock />

      {/* Hero Daily Quest & Mindset Booster */}
      <DailyQuestBanner />

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4 shadow-subtle hover:border-indigo-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-secondary truncate">
              {viewMode === "individual" ? "Verified Focus" : "Combined Focus"}
            </span>
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-indigo-50 text-primary dark:bg-indigo-950/60 shrink-0">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-foreground">
            {viewMode === "individual"
              ? `${(totalUserFocusSeconds / 3600).toFixed(1)}h`
              : `${(sharedFocusSeconds / 3600).toFixed(1)}h`}
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-emerald-600 truncate block">Deep work verified</span>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-border bg-surface p-3 sm:p-4 shadow-subtle hover:border-emerald-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-secondary truncate">Today's Targets</span>
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-foreground">
            {completedTasks.length} / {myTasks.length}
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-secondary truncate block">
            {pendingTasks.length + inProgressTasks.length} in queue
          </span>
        </div>

        {/* Metric 3: Dynamic Streak */}
        <div
          onClick={() => {
            setCelebrationData({
              isOpen: true,
              title: `${streak}-Day Focus Streak! 🔥`,
              subtitle: "Every consecutive day primes your brain for interview excellence.",
              xpEarned: 25,
              streakCount: streak,
              type: "daily_goal",
            });
          }}
          className="rounded-2xl border border-amber-500/30 bg-surface p-3 sm:p-4 shadow-subtle cursor-pointer hover:border-amber-500 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-amber-600 dark:text-amber-400 truncate">Study Streak</span>
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 shrink-0">
              <Flame className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current text-amber-500 animate-flame" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-foreground flex items-center space-x-1">
            <span>{streak} Days</span>
            <span className="text-xs font-extrabold text-amber-500">🔥</span>
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-amber-600 dark:text-amber-400 truncate block">Streak active</span>
        </div>

        {/* Metric 4: Player Rank & XP */}
        <div
          onClick={() => setActiveTab("analytics")}
          className="rounded-2xl border border-indigo-500/30 bg-surface p-3 sm:p-4 shadow-subtle cursor-pointer hover:border-primary hover:bg-indigo-50/20 dark:hover:bg-indigo-950/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] sm:text-xs font-semibold text-primary truncate">Mastery Rank</span>
            <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-indigo-50 text-primary dark:bg-indigo-950/60 shrink-0">
              <Trophy className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-black text-foreground">
            Lv.{level}
          </div>
          <span className="text-[10px] sm:text-[11px] font-medium text-secondary truncate block">
            {xp} XP • {levelTitle.split(" ")[0]}
          </span>
        </div>
      </div>

      {/* Shared Accountability Banner (if Shared View is selected) */}
      {viewMode === "shared" && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50 p-5 dark:border-indigo-900 dark:from-indigo-950/40 dark:to-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Shared Accountability Matrix</h3>
                <p className="text-xs text-secondary">
                  Jayant & Rekha study sprint synergy: Mutual verification & task delegation.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("shared")}
              className="flex items-center space-x-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white shadow hover:bg-primary-hover"
            >
              <span>Shared Hub</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-surface p-3 border border-border">
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white">
                  J
                </div>
                <span className="text-xs font-bold text-foreground">Jayant's Progress</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-secondary">
                <span>Targets Completed:</span>
                <strong className="text-foreground">
                  {tasks.filter((t) => t.assigned_to === JAYANT_USER.id && t.status === "completed").length} /{" "}
                  {tasks.filter((t) => t.assigned_to === JAYANT_USER.id).length}
                </strong>
              </div>
            </div>

            <div className="rounded-xl bg-surface p-3 border border-border">
              <div className="flex items-center space-x-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-600 text-[11px] font-bold text-white">
                  R
                </div>
                <span className="text-xs font-bold text-foreground">Rekha's Progress</span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-secondary">
                <span>Targets Completed:</span>
                <strong className="text-foreground">
                  {tasks.filter((t) => t.assigned_to === REKHA_USER.id && t.status === "completed").length} /{" "}
                  {tasks.filter((t) => t.assigned_to === REKHA_USER.id).length}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Targets in Progress & Focus Engine */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Priority Targets for Today */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Priority Study Targets</h3>
                <p className="text-xs text-secondary">Enforcing the 10-minute minimum focused effort rule.</p>
              </div>
              <button
                onClick={() => setActiveTab("targets")}
                className="flex items-center space-x-1 text-xs font-semibold text-primary hover:underline"
              >
                <span>View All ({myTasks.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {myTasks.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface-raised/40 p-6 sm:p-8 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
                    <Sparkles className="h-6 w-6 text-amber-500 animate-pulse" />
                  </div>
                  <h4 className="text-sm font-black text-foreground">Clean Slate: Ready for Tomorrow!</h4>
                  <p className="mt-1 text-xs text-secondary max-w-sm mx-auto">
                    All previous task data has been erased. From tomorrow we start completely fresh! Set your targets tonight or start tomorrow morning.
                  </p>
                  <button
                    onClick={() => setIsQuickAddOpen(true)}
                    className="mt-4 inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:scale-[1.02] transition-all"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Plan Tomorrow&rsquo;s First Target</span>
                  </button>
                </div>
              ) : (
                myTasks.slice(0, 4).map((task) => {
                  const subject = subjects.find((s) => s.id === task.subject_id);
                  const isRunningThis = activeSession?.task_id === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`flex flex-col justify-between rounded-xl border p-3.5 transition-all sm:flex-row sm:items-center ${
                        isRunningThis
                          ? "border-primary bg-primary-subtle/30 shadow-sm"
                          : "border-border bg-surface hover:border-border hover:bg-surface-raised/50"
                      }`}
                    >
                      <div className="flex items-start space-x-3 truncate">
                        {/* 1-Click Complete Circle Button */}
                        <button
                          onClick={() => {
                            if (task.status === "completed") {
                              // toggle to planned
                            } else {
                              quickCompleteTask(task.id, true);
                            }
                          }}
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                            task.status === "completed"
                              ? "border-emerald-500 bg-emerald-500 text-white shadow-xs"
                              : "border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-500/10 text-transparent hover:text-emerald-500"
                          }`}
                          title={task.status === "completed" ? "Target Accomplished!" : "Mark Completed (+50 XP)"}
                        >
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </button>

                        <div
                          className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold text-white"
                          style={{ backgroundColor: subject?.color || "#4F46E5" }}
                        >
                          {subject?.code || "SUB"}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-foreground truncate">{task.title}</h4>
                            <span
                              className={`rounded-full px-2 py-0.2 text-[9px] font-semibold uppercase ${
                                task.status === "completed"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : task.status === "in_progress"
                                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                                  : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {task.status.replace("_", " ")}
                            </span>
                          </div>
                          <p className="mt-1 text-[11px] text-secondary line-clamp-1">{task.description}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between space-x-2 sm:mt-0 sm:justify-end">
                        <span className="text-[11px] font-mono text-secondary">
                          {task.estimated_minutes} min
                        </span>
                        {task.status !== "completed" && (
                          <button
                            onClick={() => startFocusSession(task.id)}
                            className="flex items-center space-x-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
                          >
                            <Play className="h-3 w-3 fill-current" />
                            <span>{isRunningThis ? "In Focus" : "Start"}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Weekly Planned vs Actual Focus Time Chart */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-foreground">Weekly Study Time: Planned vs Actual</h3>
                <p className="text-xs text-secondary">Hours spent in verified unpaused focus sessions.</p>
              </div>
              <div className="flex items-center space-x-4 text-xs">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-primary" />
                  <span className="text-secondary">Actual Focus</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-300 dark:bg-slate-700" />
                  <span className="text-secondary">Planned Target</span>
                </div>
              </div>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="h" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border)",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="actual" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="planned" fill="#CBD5E1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Col: Placement Pipeline & Upcoming Deadlines */}
        <div className="space-y-4">
          {/* Upcoming Deadlines & Interviews */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-bold text-foreground">Upcoming Deadlines</h3>
              </div>
              <button
                onClick={() => setActiveTab("calendar")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Calendar
              </button>
            </div>

            <div className="space-y-2.5">
              {upcomingDeadlines.length === 0 ? (
                <p className="text-xs text-secondary py-3 text-center">No upcoming deadlines.</p>
              ) : (
                upcomingDeadlines.map((ev) => (
                  <div key={ev.id} className="rounded-xl border border-border p-3 bg-surface-raised/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">{ev.title}</span>
                      <span className="rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-1.5 py-0.5 text-[10px] font-semibold uppercase">
                        {ev.event_type.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-secondary">
                      {new Date(ev.start_at).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Placement Opportunities Tracker Widget */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-foreground">Placement Pipeline</h3>
              </div>
              <button
                onClick={() => setActiveTab("placement")}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Pipeline
              </button>
            </div>

            <div className="space-y-2.5">
              {activePlacements.map((p) => (
                <div key={p.id} className="rounded-xl border border-border p-3 bg-surface-raised/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{p.company_name}</h4>
                      <p className="text-[11px] text-secondary">{p.role_title}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold capitalize">
                      {p.stage.replace("_", " ")}
                    </span>
                  </div>
                  {p.salary_or_stipend && (
                    <div className="mt-2 text-[11px] font-mono font-semibold text-primary">
                      {p.salary_or_stipend}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AI Study Coach Quick Link */}
          <div className="rounded-2xl border border-primary/30 bg-primary-subtle/50 p-4">
            <div className="flex items-center space-x-2">
              <Bot className="h-4 w-4 text-primary" />
              <h4 className="text-xs font-bold text-foreground">Gemini AI Study Coach</h4>
            </div>
            <p className="mt-1.5 text-[11px] text-secondary leading-relaxed">
              Submit your DSA code, SQL queries, or OOP explanations for rigorous rubric evaluation.
            </p>
            <button
              onClick={() => setActiveTab("aicoach")}
              className="mt-3 flex w-full items-center justify-center space-x-1.5 rounded-lg bg-primary py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
            >
              <span>Launch AI Study Coach</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
