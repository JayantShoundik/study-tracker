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
  const { tasks, subjects, completedSessions, activeSeconds, activeSession } = useApp();

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
    { metric: "Current Streak", Jayant: 14, Rekha: 14 },
    { metric: "AI Score Avg", Jayant: 92, Rekha: 94 },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Productivity Analytics & Reports
        </h1>
        <p className="mt-1 text-xs text-secondary sm:text-sm">
          Transparent metrics derived from unpaused focus records, task completions, and AI evaluation scores.
        </p>
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
