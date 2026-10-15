"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { JAYANT_USER, REKHA_USER } from "@/lib/mockData";
import { Task, TaskPriority, TaskStatus } from "@/types";
import {
  CheckSquare,
  Plus,
  Play,
  RotateCcw,
  Calendar,
  User,
  Filter,
  CheckCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Trash2,
  Copy,
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
    startFocusSession,
    activeSession,
    completeTaskWithVerification,
    setActiveTab,
    setIsQuickAddOpen,
  } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<string>("all");
  const [selectedAssignee, setSelectedAssignee] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedSubject !== "all" && t.subject_id !== selectedSubject) return false;
    if (selectedAssignee !== "all" && t.assigned_to !== selectedAssignee) return false;
    if (selectedStatus !== "all" && t.status !== selectedStatus) return false;
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

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Daily Target Planner
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Curated placement targets with subtask verification and strict 10-minute focus enforcement.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>New Target</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-border bg-surface p-3 shadow-subtle">
        <div className="flex items-center space-x-2 text-xs font-semibold text-secondary mr-2">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
        </div>

        {/* Filter by Subject */}
        <select
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
          className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
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
          className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Assignees</option>
          <option value={JAYANT_USER.id}>Assigned to Jayant</option>
          <option value={REKHA_USER.id}>Assigned to Rekha</option>
        </select>

        {/* Filter by Status */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="completed">Completed</option>
          <option value="needs_revision">Needs Revision</option>
          <option value="overdue">Overdue</option>
        </select>

        <span className="ml-auto text-xs text-secondary font-medium">
          Showing <strong className="text-foreground">{filteredTasks.length}</strong> target(s)
        </span>
      </div>

      {/* Targets List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <CheckSquare className="mx-auto h-8 w-8 text-secondary/40" />
            <h3 className="mt-3 text-sm font-bold text-foreground">No Targets Found</h3>
            <p className="mt-1 text-xs text-secondary">
              No tasks match your selected filter criteria. Create a target or reset filters.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const subject = subjects.find((s) => s.id === task.subject_id);
            const isAssignedToJayant = task.assigned_to === JAYANT_USER.id;
            const isExpanded = expandedTaskId === task.id;
            const isRunning = activeSession?.task_id === task.id;

            return (
              <div
                key={task.id}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isRunning
                    ? "border-primary bg-primary-subtle/20 shadow-md"
                    : "border-border bg-surface hover:border-border hover:shadow-subtle"
                }`}
              >
                {/* Main Row */}
                <div className="flex flex-col justify-between p-4 sm:flex-row sm:items-center">
                  <div className="flex items-start space-x-3.5 truncate">
                    <button
                      onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                      className="mt-0.5 rounded-md p-1 text-secondary hover:bg-surface-raised transition-colors"
                    >
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>

                    <div
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white shadow-xs"
                      style={{ backgroundColor: subject?.color || "#4F46E5" }}
                    >
                      {subject?.code || "SUB"}
                    </div>

                    <div className="truncate">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-xs font-bold text-foreground sm:text-sm truncate">{task.title}</h3>

                        {/* Priority Badge */}
                        <span
                          className={`rounded-md px-1.5 py-0.2 text-[9px] font-bold uppercase ${
                            task.priority === "high" || task.priority === "urgent"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                              : task.priority === "medium"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {task.priority}
                        </span>

                        {/* Status Badge */}
                        <span
                          className={`rounded-full px-2 py-0.2 text-[9px] font-bold uppercase ${
                            task.status === "completed"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : task.status === "in_progress"
                              ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300"
                              : task.status === "submitted"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                              : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>

                        {/* Assignee Pill */}
                        <span className="flex items-center space-x-1 rounded-full border border-border bg-surface-raised px-2 py-0.2 text-[10px] font-semibold text-secondary">
                          <User className="h-3 w-3" />
                          <span>{isAssignedToJayant ? "Jayant" : "Rekha"}</span>
                        </span>

                        {/* Carry Forward history tag */}
                        {task.carry_forward_count > 0 && (
                          <span className="rounded bg-amber-50 border border-amber-200 px-1.5 py-0.2 text-[9px] font-bold text-amber-700 dark:bg-amber-950/60 dark:border-amber-900 dark:text-amber-300">
                            Carried forward ({task.carry_forward_count}x)
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-secondary line-clamp-1">{task.description}</p>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="mt-3 flex items-center justify-between space-x-2 sm:mt-0 sm:justify-end">
                    <span className="text-xs font-mono text-secondary mr-2">{task.estimated_minutes} min</span>

                    {task.status !== "completed" && (
                      <button
                        onClick={() => startFocusSession(task.id)}
                        className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors ${
                          isRunning
                            ? "bg-emerald-600 text-white"
                            : "bg-primary text-white hover:bg-primary-hover"
                        }`}
                      >
                        <Play className="h-3.5 w-3.5 fill-current" />
                        <span>{isRunning ? "In Session" : "Focus"}</span>
                      </button>
                    )}

                    {task.status !== "completed" && (
                      <button
                        onClick={() => carryForwardTask(task.id)}
                        className="rounded-lg border border-border p-1.5 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
                        title="Carry forward to tomorrow (preserves history)"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleDuplicate(task)}
                      className="rounded-lg border border-border p-1.5 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
                      title="Duplicate target"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="rounded-lg border border-border p-1.5 text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
                      title="Delete target"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expanded Details: Subtasks Checklist, Rubric, Objectives */}
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
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div className="rounded-xl border border-border bg-surface p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-foreground">
                            Subtask Verification Checklist ({task.subtasks.filter((s) => s.is_completed).length} /{" "}
                            {task.subtasks.length})
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {task.subtasks.map((st) => (
                            <label
                              key={st.id}
                              className="flex items-center space-x-2.5 cursor-pointer text-xs text-foreground hover:bg-surface-raised p-1 rounded-md"
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
                      </div>
                    )}

                    {/* Quick AI Evaluation Button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="text-[11px] text-secondary">
                        Minimum Required Focus: <strong>{task.minimum_focus_seconds / 60} minutes</strong>
                      </div>
                      <button
                        onClick={() => setActiveTab("aicoach")}
                        className="flex items-center space-x-1.5 text-xs font-bold text-primary hover:underline"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Submit Work to AI Study Coach</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
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
