"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Timer,
  Calendar,
  Bookmark,
  Briefcase,
  Bot,
  BarChart3,
  Users2,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, activeSession, isTimerRunning, tasks, currentUser } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const pendingCount = tasks.filter(
    (t) => t.assigned_to === currentUser.id && (t.status === "planned" || t.status === "in_progress")
  ).length;

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "targets", label: "My Targets", icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : undefined },
    { id: "subjects", label: "Study Subjects", icon: BookOpen },
    {
      id: "focus",
      label: "Focus Room",
      icon: Timer,
      activePulse: Boolean(activeSession && isTimerRunning),
    },
    { id: "calendar", label: "Calendar & Deadlines", icon: Calendar },
    { id: "library", label: "Library Bag", icon: Bookmark },
    { id: "placement", label: "Placement Tracker", icon: Briefcase },
    { id: "aicoach", label: "AI Study Coach", icon: Bot },
    { id: "analytics", label: "Analytics & Reports", icon: BarChart3 },
    { id: "shared", label: "Shared Workspace", icon: Users2 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-border bg-surface transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Workspace Banner */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3.5">
        {!collapsed && (
          <div className="flex items-center space-x-2 truncate">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-subtle text-primary">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="truncate text-xs font-bold text-foreground">Jayant & Rekha Hub</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-secondary hover:bg-surface-raised hover:text-foreground transition-colors mx-auto"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 p-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group flex w-full items-center rounded-lg px-2.5 py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-secondary hover:bg-surface-raised hover:text-foreground"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="relative flex items-center justify-center">
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isActive ? "text-white" : "text-secondary group-hover:text-foreground"
                  }`}
                />
                {item.activePulse && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}
              </div>

              {!collapsed && (
                <span className="ml-3 truncate font-medium tracking-tight text-left flex-1">
                  {item.label}
                </span>
              )}

              {!collapsed && item.badge && (
                <span
                  className={`ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-primary-subtle text-primary"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-border p-3">
        {!collapsed ? (
          <div className="rounded-lg bg-surface-raised p-2.5 text-[11px] text-secondary">
            <div className="flex items-center justify-between font-semibold text-foreground">
              <span>Sprint Target</span>
              <span className="text-primary font-mono">10m / task</span>
            </div>
            <p className="mt-1 text-[10px] leading-tight text-secondary">
              Strict 600s verified focus rule active for placement mastery.
            </p>
          </div>
        ) : (
          <div className="flex justify-center text-[10px] font-bold text-primary">10m</div>
        )}
      </div>
    </aside>
  );
};
