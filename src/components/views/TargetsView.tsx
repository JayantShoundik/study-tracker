"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { JAYANT_USER, REKHA_USER } from "@/lib/mockData";
import { Task } from "@/types";
import { DailyQuestBanner } from "@/components/common/DailyQuestBanner";
import {
  CheckSquare,
  Plus,
  Play,
  RotateCcw,
  User,
  Filter,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Trash2,
  Copy,
  Zap,
  Check,
  Flame,
  Star,
  CheckCircle,
} from "lucide-react";

export const TargetsView: React.FC = () => {
  const {
    tasks,
    subjects,
    currentUser,
    addTask,
    updateTask,
    deleteTask,
    carryForwardTask,
    toggleSubtask,
    addSubtask,
    startFocusSession,
    activeSession,
    completeTaskWithVerification,
    quickCompleteTask,
    setActiveTab,
    setIsQuickAddOpen,
  } = useApp();

  const [activeFilterTab, setActiveFilterTab] = useState<"all" | "high_priority" | "in_progress" | "completed">("all");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newSubtaskInput, setNewSubtaskInput] = useState<{ [taskId: string]: string }>({});

  // Filter tasks based on tabs and dropdowns
  const filteredTasks = tasks.filter((t) => {
    if (selectedSubject !== "all" && t.subject_id !== selectedSubject) return false;
    if (selectedAssignee !== "all" && t.assigned_to !== selectedAssignee) return false;

    if (activeFilterTab === "high_priority") {
      return (t.priority === "urgent" || t.priority === "high") && t.status !== "completed";
    }
    if (activeFilterTab === "in_progress") {
      return t.status === "in_progress";
    }
    if (activeFilterTab === "completed") {
      return t.status === "completed";
    }

    return true;
  });

  const handleDuplicate = (task: Task) => {
    addTask({
      ...task,
      title: `${task.title} (Copy)`,
      status: "planned",
      carry_forward_count: 0,
    });
  };

  const handleAddSubtaskSubmit = (taskId: string, e: React.FormEvent) => {
    e.preventDefault();
    const title = newSubtaskInput[taskId];
    if (title && title.trim()) {
      addSubtask(taskId, title.trim());
      setNewSubtaskInput((prev) => ({ ...prev, [taskId]: "" }));
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-black tracking-tight text-foreground sm:text-2xl flex items-center space-x-2">
            <span>Daily Target Planner</span>
            <span className="rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-bold text-primary uppercase tracking-wider">
              Sprint Engine
            </span>
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Curated placement targets with 1-click completion, subtask checklists, and deep focus tracking.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-primary-hover hover:to-indigo-700 transition-all hover:scale-[1.02] self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Target (+50 XP)</span>
        </button>
      </div>

      {/* Hero: Daily Quest & Motivation Banner */}
      <DailyQuestBanner />

      {/* Quick Filter Navigation Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 rounded-2xl border border-border bg-surface p-1 shadow-subtle">
          <button
            onClick={() => setActiveFilterTab("all")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilterTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "text-secondary hover:text-foreground"
            }`}
          >
            All Targets ({tasks.length})
          </button>

          <button
            onClick={() => setActiveFilterTab("high_priority")}
            className={`flex items-center space-x-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilterTab === "high_priority"
                ? "bg-amber-500 text-white shadow-xs"
                : "text-secondary hover:text-amber-500"
            }`}
          >
            <Flame className="h-3.5 w-3.5" />
            <span>Focus Today</span>
          </button>

          <button
            onClick={() => setActiveFilterTab("in_progress")}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilterTab === "in_progress"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-secondary hover:text-foreground"
            }`}
          >
            In Progress ({tasks.filter((t) => t.status === "in_progress").length})
          </button>

          <button
            onClick={() => setActiveFilterTab("completed")}
            className={`flex items-center space-x-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              activeFilterTab === "completed"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-secondary hover:text-emerald-500"
            }`}
          >
            <Check className="h-3.5 w-3.5" />
            <span>Done ({tasks.filter((t) => t.status === "completed").length})</span>
          </button>
        </div>

        {/* Filters dropdowns */}
        <div className="flex items-center space-x-2">
          {/* Filter by Subject */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Subjects</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.code} - {s.title}
              </option>
            ))}
          </select>

          {/* Filter by Assignee */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="rounded-xl border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
          >
            <option value="all">All Assignees</option>
            <option value={JAYANT_USER.id}>Jayant</option>
            <option value={REKHA_USER.id}>Rekha</option>
          </select>
        </div>
      </div>

      {/* Targets List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-primary/30 bg-surface/80 p-8 sm:p-12 text-center shadow-subtle backdrop-blur-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-3">
              <Sparkles className="h-7 w-7 text-amber-500 animate-pulse" />
            </div>
            <h3 className="text-base font-black text-foreground">Clean Slate: Ready for Tomorrow!</h3>
            <p className="mt-1.5 text-xs text-secondary max-w-md mx-auto leading-relaxed">
              All previous tasks have been erased. Only your user profiles are preserved. From tomorrow we start fresh with disciplined daily sprints!
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsQuickAddOpen(true)}
                className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-primary to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:from-primary-hover hover:to-indigo-700 transition-all hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" />
                <span>+ Plan Tomorrow&rsquo;s Target</span>
              </button>
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const subject = subjects.find((s) => s.id === task.subject_id);
            const isAssignedToJayant = task.assigned_to === JAYANT_USER.id;
            const isExpanded = expandedTaskId === task.id;
            const isRunning = activeSession?.task_id === task.id;
            const isCompleted = task.status === "completed";

            const subtasksCount = task.subtasks?.length || 0;
            const subtasksDone = task.subtasks?.filter((s) => s.is_completed).length || 0;
            const subtaskProgress =
              subtasksCount > 0 ? Math.round((subtasksDone / subtasksCount) * 100) : 0;

            return (
              <div
                key={task.id}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isRunning
                    ? "border-primary bg-primary/5 shadow-md timer-active-glow"
                    : isCompleted
                    ? "border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/10 opacity-90"
                    : task.priority === "urgent" || task.priority === "high"
                    ? "border-amber-500/40 bg-surface hover:shadow-card"
                    : "border-border bg-surface hover:border-border hover:shadow-subtle"
                }`}
              >
                {/* Main Target Row */}
                <div className="flex flex-col justify-between p-4 sm:flex-row sm:items-center gap-3">
                  <div className="flex items-center space-x-3 truncate flex-1">
                    {/* 1-Click Complete Circle Button */}
                    <button
                      onClick={() => {
                        if (isCompleted) {
                          updateTask(task.id, { status: "planned" });
                        } else {
                          quickCompleteTask(task.id, true);
                        }
                      }}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                        isCompleted
                          ? "border-emerald-500 bg-emerald-500 text-white shadow-xs"
                          : "border-slate-300 dark:border-slate-600 hover:border-emerald-500 hover:bg-emerald-500/10 text-transparent hover:text-emerald-500"
                      }`}
                      title={isCompleted ? "Mark Uncompleted" : "Click to Complete Target (+50 XP)!"}
                    >
                      <Check className="h-4 w-4 stroke-[3]" />
                    </button>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="rounded-md p-1 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
                      title={isExpanded ? "Collapse subtasks" : "View subtasks & rubric"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {/* Subject Pill */}
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-xs"
                      style={{ backgroundColor: subject?.color || "#4F46E5" }}
                    >
                      {subject?.code || "SUB"}
                    </div>

                    <div className="truncate flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-xs font-bold transition-all sm:text-sm truncate ${
                            isCompleted ? "line-through text-secondary" : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* Priority Badge */}
                        <span
                          className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                            task.priority === "urgent"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : task.priority === "high"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : task.priority === "medium"
                              ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Subtasks Counter Pill */}
                        {subtasksCount > 0 && (
                          <span className="flex items-center space-x-1 rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[10px] font-semibold text-secondary">
                            <span>
                              {subtasksDone}/{subtasksCount} subtasks
                            </span>
                          </span>
                        )}

                        {/* Assignee Pill */}
                        <span className="flex items-center space-x-1 rounded-full border border-border bg-surface-raised px-2 py-0.5 text-[10px] font-semibold text-secondary">
                          <User className="h-3 w-3" />
                          <span>{isAssignedToJayant ? "Jayant" : "Rekha"}</span>
                        </span>

                        {/* Carry Forward history tag */}
                        {task.carry_forward_count > 0 && (
                          <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300">
                            Carried forward ({task.carry_forward_count}x)
                          </span>
                        )}
                      </div>

                      <p className="mt-0.5 text-xs text-secondary line-clamp-1">{task.description}</p>
                    </div>
                  </div>

                  {/* Actions on Right */}
                  <div className="flex items-center justify-between space-x-2 sm:justify-end">
                    <span className="text-xs font-mono text-secondary mr-1">
                      {task.estimated_minutes} min
                    </span>

                    {/* Focus Session Trigger */}
                    {!isCompleted && (
                      <button
                        onClick={() => startFocusSession(task.id)}
                        className={`flex items-center space-x-1.5 rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm transition-all hover:scale-[1.02] ${
                          isRunning
                            ? "bg-emerald-600 text-white"
                            : "bg-primary text-white hover:bg-primary-hover"
                        }`}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{isRunning ? "Focusing" : "Focus"}</span>
                      </button>
                    )}

                    {/* Reschedule / Carry Forward */}
                    {!isCompleted && (
                      <button
                        onClick={() => carryForwardTask(task.id)}
                        className="rounded-xl border border-border p-2 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
                        title="Carry forward to tomorrow (keeps placement tracking history)"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicate(task)}
                      className="rounded-xl border border-border p-2 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
                      title="Duplicate target"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-xl border border-border p-2 text-secondary hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-600 transition-colors"
                      title="Delete target"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtask progress bar indicator */}
                {subtasksCount > 0 && !isCompleted && (
                  <div className="h-1 w-full bg-slate-200/50 dark:bg-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-300"
                      style={{ width: `${subtaskProgress}%` }}
                    />
                  </div>
                )}

                {/* Expanded Details: Subtask Checklists, Inline Quick Add, Rubric */}
                {isExpanded && (
                  <div className="border-t border-border bg-surface-raised/40 p-4 space-y-4">
                    {/* Objectives & Expected Output */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {task.learning_objectives && (
                        <div className="rounded-xl border border-border bg-surface p-3">
                          <span className="font-bold text-foreground">Learning Objectives</span>
                          <p className="mt-1 text-secondary leading-relaxed">{task.learning_objectives}</p>
                        </div>
                      )}
                      {task.expected_output && (
                        <div className="rounded-xl border border-border bg-surface p-3">
                          <span className="font-bold text-foreground">Expected Output Format</span>
                          <p className="mt-1 text-secondary leading-relaxed">{task.expected_output}</p>
                        </div>
                      )}
                    </div>

                    {/* Subtasks Checklist */}
                    <div className="rounded-xl border border-border bg-surface p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-foreground flex items-center space-x-1.5">
                          <span>Subtask Verification Checklist</span>
                          <span className="text-secondary font-normal">
                            ({subtasksDone} / {subtasksCount})
                          </span>
                        </span>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                          +15 XP per checked item
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        {task.subtasks?.map((st) => (
                          <label
                            key={st.id}
                            className="flex items-center space-x-2.5 cursor-pointer text-xs text-foreground hover:bg-surface-raised p-1.5 rounded-lg transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={st.is_completed}
                              onChange={() => toggleSubtask(task.id, st.id)}
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <span className={st.is_completed ? "line-through text-secondary" : ""}>
                              {st.title}
                            </span>
                          </label>
                        ))}
                      </div>

                      {/* Super Easy Inline Subtask Adder */}
                      <form
                        onSubmit={(e) => handleAddSubtaskSubmit(task.id, e)}
                        className="mt-3 flex items-center gap-2 pt-2 border-t border-border"
                      >
                        <input
                          type="text"
                          value={newSubtaskInput[task.id] || ""}
                          onChange={(e) =>
                            setNewSubtaskInput((prev) => ({ ...prev, [task.id]: e.target.value }))
                          }
                          placeholder="+ Add another subtask and hit Enter..."
                          className="flex-1 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs text-foreground placeholder:text-secondary focus:border-primary focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="rounded-lg bg-surface-raised border border-border px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-primary hover:text-white transition-colors"
                        >
                          Add
                        </button>
                      </form>
                    </div>

                    {/* Quick AI Evaluation Button & Minimum Focus Rule */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="text-[11px] text-secondary">
                        Standard Focus Rule: <strong>{task.minimum_focus_seconds / 60} mins</strong>{" "}
                        (Can also be completed directly)
                      </div>
                      <div className="flex items-center space-x-3">
                        {!isCompleted && (
                          <button
                            onClick={() => quickCompleteTask(task.id, true)}
                            className="flex items-center space-x-1 text-xs font-bold text-emerald-600 hover:underline"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Quick Complete (+50 XP)</span>
                          </button>
                        )}
                        <button
                          onClick={() => setActiveTab("aicoach")}
                          className="flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline"
                        >
                          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          <span>Submit Work to AI Study Coach</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
