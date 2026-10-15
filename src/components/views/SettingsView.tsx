"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  Settings as SettingsIcon,
  Bell,
  Clock,
  Volume2,
  Database,
  Key,
  Download,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export const SettingsView: React.FC = () => {
  const { preferences, updatePreferences, tasks, libraryEntries, placements, calendarEvents } = useApp();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleExportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      tasks,
      libraryEntries,
      placements,
      calendarEvents,
      preferences,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `focusforge-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const isDbLive = isSupabaseConfigured();

  return (
    <div className="space-y-6 pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Account & System Preferences
        </h1>
        <p className="mt-1 text-xs text-secondary sm:text-sm">
          Customize hourly accountability notifications, quiet hours, sound cues, and external service credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Hourly Accountability Notifications Card */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 border-b border-border pb-3">
            <Bell className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Hourly Reminders & Accountability</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-foreground">
                Reminder Interval (Minutes)
              </label>
              <input
                type="number"
                min={15}
                step={15}
                value={preferences.reminder_interval_minutes}
                onChange={(e) =>
                  updatePreferences({ reminder_interval_minutes: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
              <span className="text-[11px] text-secondary mt-1 block">
                Default: 60 minutes. Alerts you to pending targets or active focus sessions.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-foreground">
                Daily Planning Reminder Time
              </label>
              <input
                type="time"
                value={preferences.daily_planning_reminder_time}
                onChange={(e) =>
                  updatePreferences({ daily_planning_reminder_time: e.target.value })
                }
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground">Quiet Hours Start</label>
              <input
                type="time"
                value={preferences.quiet_hours_start}
                onChange={(e) => updatePreferences({ quiet_hours_start: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-foreground">Quiet Hours End</label>
              <input
                type="time"
                value={preferences.quiet_hours_end}
                onChange={(e) => updatePreferences({ quiet_hours_end: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Sound & Vibration Toggles */}
          <div className="pt-2 flex flex-wrap gap-4 text-xs">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.sound_enabled}
                onChange={(e) => updatePreferences({ sound_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="font-semibold text-foreground">Audio Chimes & Tones Enabled</span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.vibration_enabled}
                onChange={(e) => updatePreferences({ vibration_enabled: e.target.checked })}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span className="font-semibold text-foreground">Haptic Vibration on Mobile</span>
            </label>
          </div>
        </div>

        {/* Database & Supabase Configuration Status */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 border-b border-border pb-3">
            <Database className="h-4 w-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-foreground">
              Persistence Engine & Supabase Status
            </h3>
          </div>

          <div className="rounded-xl border border-border bg-surface-raised p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${isDbLive ? "bg-emerald-500" : "bg-amber-500"}`}
                />
                <span className="text-xs font-bold text-foreground">
                  {isDbLive ? "Connected to Supabase PostgreSQL" : "Local Storage Vault Mode Active"}
                </span>
              </div>
              <span className="rounded-full bg-surface border border-border px-2 py-0.5 text-[10px] font-semibold text-secondary">
                {isDbLive ? "PostgreSQL 15" : "Offline Capable"}
              </span>
            </div>
            <p className="mt-2 text-xs text-secondary leading-relaxed">
              To connect your live Supabase cloud project, copy your Supabase URL and Anon Key into{" "}
              <code className="text-primary font-mono">.env.local</code> and run the migration in{" "}
              <code className="text-primary font-mono">supabase/migrations/</code>.
            </p>
          </div>
        </div>

        {/* Gemini AI Status */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle space-y-4">
          <div className="flex items-center space-x-2 border-b border-border pb-3">
            <Key className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Google Gemini 2.5 Flash API</h3>
          </div>

          <div className="rounded-xl border border-border bg-surface-raised p-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground">Server-Side AI Evaluation Route</span>
              <span className="rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 text-[10px] font-bold">
                /api/ai/evaluate
              </span>
            </div>
            <p className="mt-2 text-secondary leading-relaxed">
              AI requests are executed strictly from server-side Next.js endpoints. API keys are never exposed to browser bundles or public repositories.
            </p>
          </div>
        </div>

        {/* Data Backup & Export */}
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-subtle flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Export Data Backup</h3>
            <p className="text-xs text-secondary mt-0.5">
              Download your complete task history, library vault, and placement records as JSON.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center space-x-2 rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-foreground hover:bg-surface-raised transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Download JSON</span>
          </button>
        </div>

        {/* Save Confirmation Button */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess && (
            <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Preferences saved successfully!</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
};
