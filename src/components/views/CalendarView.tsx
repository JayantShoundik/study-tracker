"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { CalendarEvent, CalendarEventType } from "@/types";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Briefcase,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
} from "lucide-react";

export const CalendarView: React.FC = () => {
  const { calendarEvents, addCalendarEvent, deleteCalendarEvent, currentUser } = useApp();

  const [activeView, setActiveView] = useState<"agenda" | "upcoming">("agenda");
  const [showEventModal, setShowEventModal] = useState(false);

  // Form state
  const [eventTitle, setEventTitle] = useState("");
  const [eventType, setEventType] = useState<CalendarEventType>("online_assessment");
  const [eventDate, setEventDate] = useState(new Date().toISOString().split("T")[0]);
  const [eventTime, setEventTime] = useState("10:00");
  const [eventDesc, setEventDesc] = useState("");

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addCalendarEvent({
      title: eventTitle.trim(),
      event_type: eventType,
      start_at: new Date(`${eventDate}T${eventTime}:00`).toISOString(),
      description: eventDesc.trim(),
    });

    setEventTitle("");
    setEventDesc("");
    setShowEventModal(false);
  };

  const eventTypeColors: Record<CalendarEventType, string> = {
    technical_interview: "bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
    hr_interview: "bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300 dark:border-teal-800",
    online_assessment: "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    placement_test: "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
    application_deadline: "bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
    form_submission: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    college_examination: "bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800",
    project_deadline: "bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800",
    revision_session: "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
    personal_reminder: "bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
  };

  const sortedEvents = [...calendarEvents].sort(
    (a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime()
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Calendar & Deadline Manager
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Unified schedule tracking Online Assessments, Technical Interviews, Exams, and Deadlines.
          </p>
        </div>

        <button
          onClick={() => setShowEventModal(true)}
          className="flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Event</span>
        </button>
      </div>

      {/* View Switcher */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex rounded-xl border border-border bg-surface-raised p-1">
          <button
            onClick={() => setActiveView("agenda")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeView === "agenda"
                ? "bg-surface text-primary shadow-sm"
                : "text-secondary hover:text-foreground"
            }`}
          >
            Agenda View
          </button>
          <button
            onClick={() => setActiveView("upcoming")}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              activeView === "upcoming"
                ? "bg-surface text-primary shadow-sm"
                : "text-secondary hover:text-foreground"
            }`}
          >
            Placement & Interview Deadlines
          </button>
        </div>

        <span className="text-xs text-secondary font-medium">
          {calendarEvents.length} scheduled event(s)
        </span>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {sortedEvents.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <CalendarIcon className="mx-auto h-8 w-8 text-secondary/40" />
            <h3 className="mt-3 text-sm font-bold text-foreground">No Scheduled Events</h3>
            <p className="mt-1 text-xs text-secondary">
              Schedule your next mock interview, placement test, or project deadline.
            </p>
          </div>
        ) : (
          sortedEvents.map((event) => {
            const eventDateObj = new Date(event.start_at);
            const isUpcoming = eventDateObj >= new Date();

            return (
              <div
                key={event.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 shadow-subtle transition-all hover:border-primary/40 sm:flex-row sm:items-center"
              >
                <div className="flex items-start space-x-3.5 truncate">
                  <div className="flex flex-col items-center justify-center rounded-xl bg-surface-raised border border-border px-3 py-2 text-center">
                    <span className="text-[10px] font-bold text-secondary uppercase">
                      {eventDateObj.toLocaleDateString("en-US", { month: "short" })}
                    </span>
                    <span className="text-lg font-black text-foreground">
                      {eventDateObj.getDate()}
                    </span>
                  </div>

                  <div className="truncate">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-foreground truncate">{event.title}</h3>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${
                          eventTypeColors[event.event_type] || "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {event.event_type.replace("_", " ")}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-secondary line-clamp-1">
                      {event.description || "No additional description."}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between space-x-3 sm:mt-0 sm:justify-end">
                  <div className="flex items-center space-x-1 text-xs text-secondary font-mono">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {eventDateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteCalendarEvent(event.id)}
                    className="rounded-lg border border-border p-1.5 text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
                    title="Delete event"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Add Event */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-scale-in">
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-floating">
            <h3 className="text-sm font-bold text-foreground">Schedule Calendar Event</h3>
            <form onSubmit={handleCreateEvent} className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-foreground">Event Title *</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g. Amazon Online Assessment (HackerRank)"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as CalendarEventType)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="technical_interview">Technical Interview</option>
                  <option value="hr_interview">HR Interview</option>
                  <option value="online_assessment">Online Assessment (OA)</option>
                  <option value="placement_test">Placement Test</option>
                  <option value="application_deadline">Application Deadline</option>
                  <option value="college_examination">College Exam</option>
                  <option value="revision_session">Revision Session</option>
                  <option value="personal_reminder">Personal Reminder</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                <div>
                  <label className="block text-xs font-semibold text-foreground">Time</label>
                  <input
                    type="time"
                    required
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground">Description / Meeting Link</label>
                <textarea
                  rows={2}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Platform instructions, syllabus topics..."
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              <div className="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="rounded-lg border border-border px-3.5 py-1.5 text-xs font-medium text-secondary hover:bg-surface-raised"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover"
                >
                  Save to Calendar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
