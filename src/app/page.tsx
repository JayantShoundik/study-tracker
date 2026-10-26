"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { FloatingTimer } from "@/components/timer/FloatingTimer";
import { QuickAddModal } from "@/components/common/QuickAddModal";
import { GlobalSearchModal } from "@/components/common/GlobalSearchModal";

// Views
import { DashboardView } from "@/components/views/DashboardView";
import { TargetsView } from "@/components/views/TargetsView";
import { SubjectsView } from "@/components/views/SubjectsView";
import { FocusRoomView } from "@/components/views/FocusRoomView";
import { CalendarView } from "@/components/views/CalendarView";
import { LibraryBagView } from "@/components/views/LibraryBagView";
import { PlacementTrackerView } from "@/components/views/PlacementTrackerView";
import { AiCoachView } from "@/components/views/AiCoachView";
import { AnalyticsView } from "@/components/views/AnalyticsView";
import { SharedWorkspaceView } from "@/components/views/SharedWorkspaceView";
import { SettingsView } from "@/components/views/SettingsView";

export default function Home() {
  const { activeTab, isQuickAddOpen, setIsQuickAddOpen } = useApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView />;
      case "targets":
        return <TargetsView />;
      case "subjects":
        return <SubjectsView />;
      case "focus":
        return <FocusRoomView />;
      case "calendar":
        return <CalendarView />;
      case "library":
        return <LibraryBagView />;
      case "placement":
        return <PlacementTrackerView />;
      case "aicoach":
        return <AiCoachView />;
      case "analytics":
        return <AnalyticsView />;
      case "shared":
        return <SharedWorkspaceView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
      />

      {/* Main Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Desktop only) */}
        <div className="hidden md:flex">
          <Sidebar />
        </div>

        {/* Dynamic Content Area (Mobile-friendly padding & scroll) */}
        <main className="flex-1 overflow-y-auto px-3 py-4 sm:px-6 sm:py-6 pb-28 md:pb-8">
          <div className="mx-auto max-w-7xl">{renderActiveView()}</div>
        </main>
      </div>

      {/* Mobile Smartphone Bottom Navigation Bar */}
      <MobileBottomNav />

      {/* Persistent Floating Focus Timer */}
      <FloatingTimer />

      {/* Quick Add Modal */}
      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />

      {/* Global Search Palette Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
}
