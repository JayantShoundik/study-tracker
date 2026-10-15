"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MasteryLevel, Subject, Topic } from "@/types";
import {
  BookOpen,
  Plus,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronRight,
  BookmarkCheck,
  TrendingUp,
} from "lucide-react";

export const SubjectsView: React.FC = () => {
  const { subjects, topics, addSubject, addTopic, updateTopicMastery, tasks, setActiveTab } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || "sub-dsa");
  const [showAddSubjectModal, setShowAddSubjectModal] = useState(false);
  const [showAddTopicModal, setShowAddTopicModal] = useState(false);

  // New subject state
  const [newSubTitle, setNewSubTitle] = useState("");
  const [newSubCode, setNewSubCode] = useState("");
  const [newSubDesc, setNewSubDesc] = useState("");

  // New topic state
  const [newTopTitle, setNewTopTitle] = useState("");
  const [newTopDesc, setNewTopDesc] = useState("");

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const subjectTopics = topics.filter((t) => t.subject_id === activeSubject?.id);

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubTitle.trim() || !newSubCode.trim()) return;
    addSubject({
      title: newSubTitle.trim(),
      code: newSubCode.trim().toUpperCase(),
      description: newSubDesc.trim(),
    });
    setNewSubTitle("");
    setNewSubCode("");
    setNewSubDesc("");
    setShowAddSubjectModal(false);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopTitle.trim()) return;
    addTopic({
      subject_id: activeSubject.id,
      title: newTopTitle.trim(),
      description: newTopDesc.trim(),
    });
    setNewTopTitle("");
    setNewTopDesc("");
    setShowAddTopicModal(false);
  };

  const masteryColors: Record<MasteryLevel, string> = {
    not_started: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    learning: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    needs_revision: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    understood: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
    interview_ready: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Study Subjects & Topic Mastery
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Map out technical interview syllabi, track mastery progression, and schedule revision cycles.
          </p>
        </div>

        <button
          onClick={() => setShowAddSubjectModal(true)}
          className="flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subject Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {subjects.map((sub) => {
          const isSelected = sub.id === activeSubject?.id;
          const count = topics.filter((t) => t.subject_id === sub.id).length;

          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`flex shrink-0 items-center space-x-2 rounded-xl border px-3.5 py-2 text-xs font-bold transition-all ${
                isSelected
                  ? "border-primary bg-primary text-white shadow-sm"
                  : "border-border bg-surface text-secondary hover:border-border hover:bg-surface-raised"
              }`}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: isSelected ? "#FFFFFF" : sub.color }}
              />
              <span>{sub.code}</span>
              <span className="opacity-75">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Active Subject Card */}
      {activeSubject && (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle">
          <div className="flex flex-col justify-between gap-3 border-b border-border pb-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded bg-primary-subtle px-2 py-0.5 text-xs font-bold text-primary">
                  {activeSubject.code}
                </span>
                <h2 className="text-lg font-bold text-foreground">{activeSubject.title}</h2>
              </div>
              <p className="mt-1 text-xs text-secondary">{activeSubject.description}</p>
            </div>

            <button
              onClick={() => setShowAddTopicModal(true)}
              className="flex items-center space-x-1.5 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-border transition-colors self-start sm:self-auto"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Topic</span>
            </button>
          </div>

          {/* Topics Grid */}
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {subjectTopics.length === 0 ? (
              <p className="col-span-2 py-8 text-center text-xs text-secondary">
                No topics added for this subject yet. Click "Add Topic" to begin.
              </p>
            ) : (
              subjectTopics.map((topic) => {
                const currentLevel: MasteryLevel = topic.current_mastery || "not_started";
                const topicTasks = tasks.filter((t) => t.topic_id === topic.id);

                return (
                  <div
                    key={topic.id}
                    className="flex flex-col justify-between rounded-xl border border-border bg-surface-raised/40 p-4 transition-all hover:border-primary/40 hover:bg-surface"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground">{topic.title}</h4>
                        <span className="text-[10px] font-semibold text-secondary">
                          Level {topic.importance_level} / 5 Priority
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-secondary line-clamp-2">{topic.description}</p>
                    </div>

                    {/* Mastery Level Progression Selector */}
                    <div className="mt-4 border-t border-border pt-3">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="font-semibold text-secondary">Mastery Stage:</span>
                        <span
                          className={`rounded-full px-2 py-0.2 font-bold capitalize ${masteryColors[currentLevel]}`}
                        >
                          {currentLevel.replace("_", " ")}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1 text-[9px] font-bold">
                        {(
                          [
                            "not_started",
                            "learning",
                            "needs_revision",
                            "understood",
                            "interview_ready",
                          ] as MasteryLevel[]
                        ).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => updateTopicMastery(topic.id, lvl)}
                            className={`rounded py-1 text-center capitalize transition-colors ${
                              currentLevel === lvl
                                ? "bg-primary text-white shadow-xs"
                                : "bg-surface border border-border text-secondary hover:bg-surface-raised"
                            }`}
                            title={`Mark as ${lvl.replace("_", " ")}`}
                          >
                            {lvl === "interview_ready"
                              ? "Ready"
                              : lvl === "needs_revision"
                              ? "Revise"
                              : lvl.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Subject */}
      {showAddSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-floating">
            <h3 className="text-sm font-bold text-foreground">Add New Study Subject</h3>
            <form onSubmit={handleCreateSubject} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={newSubTitle}
                  onChange={(e) => setNewSubTitle(e.target.value)}
                  placeholder="e.g. Object-Oriented Design & LLD"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={newSubCode}
                  onChange={(e) => setNewSubCode(e.target.value)}
                  placeholder="e.g. LLD"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground">Description</label>
                <textarea
                  rows={2}
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  placeholder="Design patterns, SOLID principles, UML class diagrams..."
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddSubjectModal(false)}
                  className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-secondary hover:bg-surface-raised"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Topic */}
      {showAddTopicModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-floating">
            <h3 className="text-sm font-bold text-foreground">Add Topic to {activeSubject?.code}</h3>
            <form onSubmit={handleCreateTopic} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground">Topic Title *</label>
                <input
                  type="text"
                  required
                  value={newTopTitle}
                  onChange={(e) => setNewTopTitle(e.target.value)}
                  placeholder="e.g. Factory Pattern & Abstract Factory"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-foreground">Summary & Key Concepts</label>
                <textarea
                  rows={2}
                  value={newTopDesc}
                  onChange={(e) => setNewTopDesc(e.target.value)}
                  placeholder="When to use, disadvantages, real world code sample..."
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddTopicModal(false)}
                  className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-secondary hover:bg-surface-raised"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
                >
                  Save Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
