"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  LayoutDashboard,
  CheckSquare,
  Timer,
  Bot,
  Menu,
  Calendar,
  BookOpen,
  Briefcase,
  BarChart3,
  Settings,
  X,
  Plus,
  Users2,
  Flame,
} from "lucide-react";
import { JAYANT_USER, REKHA_USER } from "@/lib/mockData";

export const MobileBottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeSession,
    isTimerRunning,
    tasks,
    currentUser,
    switchUser,
    setIsQuickAddOpen,
    streak,
  } = useApp();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const pendingCount = tasks.filter(
    (t) => t.assigned_to === currentUser.id && t.status !== "completed"
  ).length;

  const mainTabs = [
    { id: "dashboard", label: "Home", icon: LayoutDashboard },
    {
      id: "targets",
      label: "Targets",
      icon: CheckSquare,
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      id: "focus",
      label: "Focus",
      icon: Timer,
      activePulse: Boolean(activeSession && isTimerRunning),
    },
    { id: "aicoach", label: "AI Coach", icon: Bot },
  ];

  const moreItems = [
    { id: "calendar", label: "Calendar & Deadlines", icon: Calendar },
    { id: "subjects", label: "Study Subjects", icon: BookOpen },
    { id: "placement", label: "Placement Tracker", icon: Briefcase },
    { id: "analytics", label: "Analytics & Levels", icon: BarChart3 },
    { id: "shared", label: "Shared Hub", icon: Users2 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay for "More" */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm md:hidden animate-scale-in">
          <div className="relative rounded-t-3xl border-t border-border bg-surface p-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-black text-foreground">Navigation Menu</span>
                <span className="flex items-center space-x-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-500">
                  <Flame className="h-3 w-3 fill-current" />
                  <span>{streak}d</span>
                </span>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="rounded-full p-1.5 text-secondary hover:bg-surface-raised transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Switch User on Mobile */}
            <div className="rounded-2xl border border-border bg-surface-raised p-3 mb-4">
              <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block mb-2">
                Active Student
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => switchUser(JAYANT_USER)}
                  className={`flex items-center justify-center space-x-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all ${
                    currentUser.id === JAYANT_USER.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface text-foreground border border-border"
                  }`}
                >
                  <span>Jayant</span>
                </button>
                <button
                  onClick={() => switchUser(REKHA_USER)}
                  className={`flex items-center justify-center space-x-1.5 rounded-xl py-2 px-3 text-xs font-bold transition-all ${
                    currentUser.id === REKHA_USER.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface text-foreground border border-border"
                  }`}
                >
                  <span>Rekha</span>
                </button>
              </div>
            </div>

            {/* More Menu Items */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2.5 rounded-xl border p-3 text-left transition-all ${
                      isActive
                        ? "border-primary bg-primary-subtle text-primary font-bold shadow-xs"
                        : "border-border bg-surface hover:bg-surface-raised text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => {
                setIsMenuOpen(false);
                setIsQuickAddOpen(true);
              }}
              className="flex w-full items-center justify-center space-x-2 rounded-2xl bg-gradient-to-r from-primary to-indigo-600 py-3 text-xs font-bold text-white shadow-md"
            >
              <Plus className="h-4 w-4" />
              <span>Create New Target</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Nav Bar for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-border bg-surface/95 px-2 pt-1.5 pb-3 backdrop-blur-xl md:hidden shadow-floating">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all ${
                isActive ? "text-primary" : "text-secondary hover:text-foreground"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform ${
                    isActive ? "scale-110 text-primary" : "text-secondary"
                  }`}
                />
                {tab.activePulse && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`mt-1 text-[10px] font-bold ${
                  isActive ? "text-primary" : "text-secondary"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More Tab Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-2xl text-secondary hover:text-foreground transition-all`}
        >
          <Menu className="h-5 w-5" />
          <span className="mt-1 text-[10px] font-bold text-secondary">More</span>
        </button>
      </nav>
    </>
  );
};
