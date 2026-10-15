"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { JAYANT_USER, REKHA_USER } from "@/lib/mockData";
import {
  X,
  CheckSquare,
  Bookmark,
  Briefcase,
  Calendar,
  FileText,
  Plus,
} from "lucide-react";

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({ isOpen, onClose }) => {
  const { addTask, addLibraryEntry, addPlacement, addCalendarEvent, subjects, currentUser } = useApp();
  const [activeType, setActiveType] = useState<"task" | "library" | "placement" | "calendar">("task");

  // Task form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskSubject, setTaskSubject] = useState(subjects[0]?.id || "");
  const [taskAssignee, setTaskAssignee] = useState(currentUser.id);
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [taskMinutes, setTaskMinutes] = useState(45);
  const [taskDescription, setTaskDescription] = useState("");

  // Library form state
  const [libTitle, setLibTitle] = useState("");
  const [libType, setLibType] = useState<"link" | "youtube_resource" | "note" | "important_date">("link");
  const [libUrl, setLibUrl] = useState("");
  const [libContent, setLibContent] = useState("");

  // Placement form state
  const [compName, setCompName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [appUrl, setAppUrl] = useState("");
  const [stipend, setStipend] = useState("");

  // Calendar form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState<"technical_interview" | "online_assessment" | "college_examination">("online_assessment");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeType === "task") {
      if (!taskTitle.trim()) return;
      addTask({
        title: taskTitle.trim(),
        subject_id: taskSubject,
        assigned_to: taskAssignee,
        priority: taskPriority,
        estimated_minutes: taskMinutes,
        description: taskDescription,
      });
    } else if (activeType === "library") {
      if (!libTitle.trim()) return;
      addLibraryEntry({
        title: libTitle.trim(),
        entry_type: libType,
        url: libUrl.trim(),
        written_content: libContent,
      });
    } else if (activeType === "placement") {
      if (!compName.trim()) return;
      addPlacement({
        company_name: compName.trim(),
        role_title: roleTitle.trim() || "Software Engineer",
        application_url: appUrl.trim(),
        salary_or_stipend: stipend.trim(),
        stage: "applied",
      });
    } else if (activeType === "calendar") {
      if (!eventTitle.trim()) return;
      addCalendarEvent({
        title: eventTitle.trim(),
        event_type: eventType,
        start_at: new Date(`${eventDate}T10:00:00`).toISOString(),
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6 shadow-floating">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center space-x-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white">
              <Plus className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-bold text-foreground">Quick Create</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-secondary hover:bg-surface-raised hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Type Selectors */}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { id: "task", label: "Study Target", icon: CheckSquare },
            { id: "library", label: "Library Item", icon: Bookmark },
            { id: "placement", label: "Placement", icon: Briefcase },
            { id: "calendar", label: "Event", icon: Calendar },
          ].map((item) => {
            const Icon = item.icon;
            const isSel = activeType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveType(item.id as typeof activeType)}
                className={`flex flex-col items-center justify-center rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                  isSel
                    ? "border-primary bg-primary-subtle text-primary shadow-sm"
                    : "border-border text-secondary hover:border-border hover:bg-surface-raised"
                }`}
              >
                <Icon className="h-4 w-4 mb-1" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {activeType === "task" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-foreground">Target Title *</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Implement Dijkstra Algorithm & Priority Queue"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Subject</label>
                  <select
                    value={taskSubject}
                    onChange={(e) => setTaskSubject(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">Assignee</label>
                  <select
                    value={taskAssignee}
                    onChange={(e) => setTaskAssignee(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value={JAYANT_USER.id}>Jayant</option>
                    <option value={REKHA_USER.id}>Rekha</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as typeof taskPriority)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Placement Critical)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">Est. Minutes</label>
                  <input
                    type="number"
                    min={15}
                    step={5}
                    value={taskMinutes}
                    onChange={(e) => setTaskMinutes(Number(e.target.value))}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">Description & Objectives</label>
                <textarea
                  rows={2}
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  placeholder="Key concepts to prove or questions to solve..."
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </>
          )}

          {activeType === "library" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-foreground">Entry Title *</label>
                <input
                  type="text"
                  required
                  value={libTitle}
                  onChange={(e) => setLibTitle(e.target.value)}
                  placeholder="e.g. Abdul Bari Divide & Conquer Video"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Type</label>
                  <select
                    value={libType}
                    onChange={(e) => setLibType(e.target.value as typeof libType)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="link">Website Link</option>
                    <option value="youtube_resource">YouTube Video</option>
                    <option value="note">Written Note / Snippet</option>
                    <option value="important_date">Important Date</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">URL (optional)</label>
                  <input
                    type="url"
                    value={libUrl}
                    onChange={(e) => setLibUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">Notes / Code Snippet</label>
                <textarea
                  rows={3}
                  value={libContent}
                  onChange={(e) => setLibContent(e.target.value)}
                  placeholder="Key summary or reference points..."
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>
            </>
          )}

          {activeType === "placement" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Company *</label>
                  <input
                    type="text"
                    required
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    placeholder="e.g. Google / Microsoft"
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Role Title</label>
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. SWE Intern"
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Application URL</label>
                  <input
                    type="url"
                    value={appUrl}
                    onChange={(e) => setAppUrl(e.target.value)}
                    placeholder="https://careers..."
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-foreground">Stipend / Package</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    placeholder="e.g. ₹1,20,000 / mo"
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {activeType === "calendar" && (
            <>
              <div>
                <label className="block text-xs font-semibold text-foreground">Event Name *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. TCS Online Assessment Exam"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-foreground">Event Type</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as typeof eventType)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  >
                    <option value="online_assessment">Online Assessment (OA)</option>
                    <option value="technical_interview">Technical Interview</option>
                    <option value="college_examination">College Exam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground">Date</label>
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="mt-5 flex items-center justify-end space-x-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-secondary hover:bg-surface-raised"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
