"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { JAYANT_USER, REKHA_USER } from "@/lib/mockData";
import {
  Users2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Sparkles,
  Flame,
  Award,
  BookOpen,
} from "lucide-react";

export const SharedWorkspaceView: React.FC = () => {
  const {
    tasks,
    currentUser,
    switchUser,
    workspace,
    addTask,
    activeSession,
    activeSeconds,
    completedSessions,
    setActiveTab,
  } = useApp();

  const [delegatedTitle, setDelegatedTitle] = useState("");
  const [delegatedMinutes, setDelegatedMinutes] = useState(45);

  const peer = currentUser.id === JAYANT_USER.id ? REKHA_USER : JAYANT_USER;

  // Tasks assigned to peer
  const tasksAssignedToPeer = tasks.filter((t) => t.assigned_to === peer.id);
  // Tasks assigned to me
  const tasksAssignedToMe = tasks.filter((t) => t.assigned_to === currentUser.id);

  const handleDelegateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!delegatedTitle.trim()) return;

    addTask({
      title: delegatedTitle.trim(),
      assigned_to: peer.id,
      created_by: currentUser.id,
      estimated_minutes: delegatedMinutes,
      priority: "high",
    });

    setDelegatedTitle("");
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Shared Workspace & Accountability
            </h1>
            <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-bold text-primary">
              Dual SDE Hub
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Collaborative command center for Jayant & Rekha with task delegation, shared deadlines, and mutual progress tracking.
          </p>
        </div>

        {/* Quick User Switcher Button */}
        <button
          onClick={() => switchUser(peer)}
          className="flex items-center space-x-2 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-bold text-foreground hover:bg-surface-raised transition-colors self-start sm:self-auto"
        >
          <span>Switch Perspective to {peer.display_name}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Profiles Side-by-Side Banner */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Jayant's Card */}
        <div
          className={`rounded-2xl border p-5 transition-all ${
            currentUser.id === JAYANT_USER.id
              ? "border-primary bg-primary-subtle/20 shadow-md"
              : "border-border bg-surface shadow-subtle"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-sm font-bold text-white shadow-sm">
                J
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-bold text-foreground">Jayant</h3>
                  {currentUser.id === JAYANT_USER.id && (
                    <span className="rounded-full bg-primary px-1.5 py-0.2 text-[9px] font-bold text-white">
                      ACTIVE YOU
                    </span>
                  )}
                </div>
                <p className="text-xs text-secondary">{JAYANT_USER.email}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-secondary">Completed</span>
              <div className="text-lg font-black text-foreground">
                {tasks.filter((t) => t.assigned_to === JAYANT_USER.id && t.status === "completed").length} /{" "}
                {tasks.filter((t) => t.assigned_to === JAYANT_USER.id).length}
              </div>
            </div>
          </div>
        </div>

        {/* Rekha's Card */}
        <div
          className={`rounded-2xl border p-5 transition-all ${
            currentUser.id === REKHA_USER.id
              ? "border-primary bg-primary-subtle/20 shadow-md"
              : "border-border bg-surface shadow-subtle"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-sm font-bold text-white shadow-sm">
                R
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-bold text-foreground">Rekha</h3>
                  {currentUser.id === REKHA_USER.id && (
                    <span className="rounded-full bg-primary px-1.5 py-0.2 text-[9px] font-bold text-white">
                      ACTIVE YOU
                    </span>
                  )}
                </div>
                <p className="text-xs text-secondary">{REKHA_USER.email}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-semibold text-secondary">Completed</span>
              <div className="text-lg font-black text-foreground">
                {tasks.filter((t) => t.assigned_to === REKHA_USER.id && t.status === "completed").length} /{" "}
                {tasks.filter((t) => t.assigned_to === REKHA_USER.id).length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Delegation Box */}
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
        <div className="flex items-center space-x-2 mb-3">
          <Send className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">
            Delegate Study Target to {peer.display_name}
          </h3>
        </div>
        <form onSubmit={handleDelegateTask} className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            required
            value={delegatedTitle}
            onChange={(e) => setDelegatedTitle(e.target.value)}
            placeholder={`e.g. Master Binary Search Lower Bound & Upper Bound (${peer.display_name})`}
            className="flex-1 rounded-xl border border-border bg-surface-raised px-3.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
          />
          <div className="flex space-x-2">
            <input
              type="number"
              min={15}
              step={5}
              value={delegatedMinutes}
              onChange={(e) => setDelegatedMinutes(Number(e.target.value))}
              className="w-20 rounded-xl border border-border bg-surface-raised px-2.5 py-2 text-xs font-mono text-foreground focus:border-primary focus:outline-none"
              title="Estimated minutes"
            />
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover whitespace-nowrap transition-colors"
            >
              Assign Target
            </button>
          </div>
        </form>
      </div>

      {/* Mutual Assigned Tasks Lists */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tasks Assigned to Peer */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <h4 className="text-xs font-bold text-foreground">
              Targets Assigned to {peer.display_name} ({tasksAssignedToPeer.length})
            </h4>
            <span className="text-[11px] text-secondary">Tracking accountability</span>
          </div>

          <div className="space-y-2">
            {tasksAssignedToPeer.length === 0 ? (
              <p className="py-6 text-center text-xs text-secondary">
                No active targets assigned to {peer.display_name}.
              </p>
            ) : (
              tasksAssignedToPeer.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between rounded-xl border border-border p-3 text-xs"
                >
                  <div className="truncate mr-2">
                    <span className="font-bold text-foreground block truncate">{t.title}</span>
                    <span className="text-[10px] text-secondary capitalize">{t.status.replace("_", " ")}</span>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase shrink-0 ${
                      t.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tasks Assigned to Current User */}
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
          <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
            <h4 className="text-xs font-bold text-foreground">
              Targets Assigned to You ({tasksAssignedToMe.length})
            </h4>
            <button
              onClick={() => setActiveTab("targets")}
              className="text-xs font-bold text-primary hover:underline"
            >
              Open Planner
            </button>
          </div>

          <div className="space-y-2">
            {tasksAssignedToMe.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-xl border border-border p-3 text-xs"
              >
                <div className="truncate mr-2">
                  <span className="font-bold text-foreground block truncate">{t.title}</span>
                  <span className="text-[10px] text-secondary capitalize">{t.status.replace("_", " ")}</span>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase shrink-0 ${
                    t.status === "completed"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-indigo-100 text-indigo-800"
                  }`}
                >
                  {t.status.replace("_", " ")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
