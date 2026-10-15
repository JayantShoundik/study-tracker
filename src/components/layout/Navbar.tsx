"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { JAYANT_USER, REKHA_USER } from "@/lib/mockData";
import {
  Bell,
  Search,
  Plus,
  Sun,
  Moon,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenQuickAdd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenQuickAdd }) => {
  const {
    currentUser,
    switchUser,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    activeSession,
    activeSeconds,
    isTimerRunning,
    setActiveTab,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-surface/95 px-4 backdrop-blur transition-colors md:px-6">
      {/* Left: Branding & Status */}
      <div className="flex items-center space-x-3">
        <div
          onClick={() => setActiveTab("dashboard")}
          className="flex cursor-pointer items-center space-x-2"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm">
            <Flame className="h-5 w-5 text-amber-300" />
          </div>
          <div className="hidden sm:block">
            <div className="flex items-center space-x-1.5">
              <span className="text-base font-bold tracking-tight text-foreground">FocusForge</span>
              <span className="rounded-full bg-primary-subtle px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-secondary">Study & Placement Command Center</p>
          </div>
        </div>

        {/* Active Timer Indicator in Navbar */}
        {activeSession && (
          <div
            onClick={() => setActiveTab("focus")}
            className="hidden cursor-pointer items-center space-x-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary transition-all hover:bg-primary/10 md:flex"
          >
            <span className={`h-2 w-2 rounded-full ${isTimerRunning ? "animate-ping bg-primary" : "bg-warning"}`} />
            <Clock className="h-3.5 w-3.5" />
            <span className="max-w-[140px] truncate font-medium">{activeSession.task?.title}</span>
            <span className="font-mono font-semibold">
              {Math.floor(activeSeconds / 60)}:{(activeSeconds % 60).toString().padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Center: Global Search Trigger */}
      <div className="flex flex-1 max-w-md mx-4">
        <button
          onClick={onOpenSearch}
          className="flex h-9 w-full items-center justify-between rounded-lg border border-border bg-surface-raised px-3 text-xs text-secondary hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-3.5 w-3.5" />
            <span>Search tasks, notes, placements...</span>
          </div>
          <kbd className="hidden rounded bg-surface border border-border px-1.5 py-0.5 text-[10px] font-mono text-secondary sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2">
        {/* Quick Add Button */}
        <button
          onClick={onOpenQuickAdd}
          className="flex h-9 items-center space-x-1.5 rounded-lg bg-primary px-3 text-xs font-semibold text-white shadow-sm hover:bg-primary-hover transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Quick Add</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-raised transition-colors"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Flyout */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border bg-surface p-3 shadow-floating z-50 animate-scale-in">
              <div className="flex items-center justify-between border-b border-border pb-2 mb-2">
                <span className="text-xs font-bold text-foreground">Notifications</span>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-[11px] text-primary hover:underline"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-72 space-y-2 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-xs text-secondary">No new notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`cursor-pointer rounded-lg p-2 text-xs transition-colors ${
                        n.is_read ? "opacity-60 bg-surface-raised/40" : "bg-primary-subtle/50 border border-primary/20"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-foreground">{n.title}</span>
                        {!n.is_read && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                      </div>
                      <p className="mt-1 text-secondary text-[11px] leading-relaxed">{n.message}</p>
                      <span className="mt-1 block text-[10px] text-secondary/70">
                        {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-surface-raised transition-colors"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} theme`}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
        </button>

        {/* User Switcher (Jayant & Rekha) */}
        <div className="relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex h-9 items-center space-x-2 rounded-lg border border-border bg-surface-raised px-2.5 hover:border-primary/50 transition-colors"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary font-bold text-white text-[11px]">
              {currentUser.display_name[0]}
            </div>
            <span className="text-xs font-semibold text-foreground">{currentUser.display_name}</span>
            <ChevronDown className="h-3 w-3 text-secondary" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-surface p-2 shadow-floating z-50 animate-scale-in">
              <div className="px-2 py-1.5 text-[11px] font-semibold text-secondary">Switch Active User</div>
              <button
                onClick={() => {
                  switchUser(JAYANT_USER);
                  setShowUserDropdown(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
                  currentUser.id === JAYANT_USER.id ? "bg-primary-subtle text-primary font-semibold" : "hover:bg-surface-raised text-foreground"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">J</div>
                  <span>Jayant</span>
                </div>
                {currentUser.id === JAYANT_USER.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </button>

              <button
                onClick={() => {
                  switchUser(REKHA_USER);
                  setShowUserDropdown(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-xs font-medium transition-colors mt-1 ${
                  currentUser.id === REKHA_USER.id ? "bg-primary-subtle text-primary font-semibold" : "hover:bg-surface-raised text-foreground"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-600 text-[10px] text-white">R</div>
                  <span>Rekha</span>
                </div>
                {currentUser.id === REKHA_USER.id && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </button>

              <div className="my-1.5 border-t border-border" />
              <button
                onClick={() => {
                  setActiveTab("shared");
                  setShowUserDropdown(false);
                }}
                className="flex w-full items-center space-x-2 rounded-lg px-2 py-1.5 text-xs text-secondary hover:bg-surface-raised"
              >
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Shared Workspace Hub</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
