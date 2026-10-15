"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import {
  Search,
  X,
  CheckSquare,
  Bookmark,
  Briefcase,
  BookOpen,
  Calendar,
  ArrowRight,
} from "lucide-react";

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { tasks, libraryEntries, placements, subjects, setActiveTab } = useApp();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  const matchingTasks = q
    ? tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.learning_objectives?.toLowerCase().includes(q)
      )
    : tasks.slice(0, 3);

  const matchingLibrary = q
    ? libraryEntries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.written_content?.toLowerCase().includes(q)
      )
    : libraryEntries.slice(0, 2);

  const matchingPlacements = q
    ? placements.filter(
        (p) =>
          p.company_name.toLowerCase().includes(q) ||
          p.role_title.toLowerCase().includes(q) ||
          p.required_skills?.some((s) => s.toLowerCase().includes(q))
      )
    : placements.slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-4 pt-20 animate-scale-in">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-floating overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-4 w-4 text-secondary shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search FocusForge (tasks, library notes, placements, DSA, SQL...)"
            className="ml-3 flex-1 bg-transparent text-sm text-foreground placeholder:text-secondary focus:outline-none"
          />
          <kbd className="rounded border border-border bg-surface-raised px-1.5 py-0.5 text-[10px] font-mono text-secondary">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="ml-2 rounded-lg p-1 text-secondary hover:bg-surface-raised hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Tasks */}
          {matchingTasks.length > 0 && (
            <div>
              <span className="px-2 text-[11px] font-bold text-secondary uppercase tracking-wider">
                Study Targets ({matchingTasks.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchingTasks.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActiveTab("targets");
                      onClose();
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-surface-raised transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <CheckSquare className="h-4 w-4 text-primary shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-foreground truncate">{t.title}</p>
                        <span className="text-[10px] text-secondary capitalize">{t.status.replace("_", " ")}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Library Entries */}
          {matchingLibrary.length > 0 && (
            <div>
              <span className="px-2 text-[11px] font-bold text-secondary uppercase tracking-wider">
                Library Bag Vault ({matchingLibrary.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchingLibrary.map((e) => (
                  <div
                    key={e.id}
                    onClick={() => {
                      setActiveTab("library");
                      onClose();
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-surface-raised transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Bookmark className="h-4 w-4 text-indigo-500 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-foreground truncate">{e.title}</p>
                        <span className="text-[10px] text-secondary capitalize">{e.entry_type.replace("_", " ")}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placement Opportunities */}
          {matchingPlacements.length > 0 && (
            <div>
              <span className="px-2 text-[11px] font-bold text-secondary uppercase tracking-wider">
                Placements & Companies ({matchingPlacements.length})
              </span>
              <div className="mt-1 space-y-1">
                {matchingPlacements.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setActiveTab("placement");
                      onClose();
                    }}
                    className="flex cursor-pointer items-center justify-between rounded-lg p-2 hover:bg-surface-raised transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Briefcase className="h-4 w-4 text-emerald-500 shrink-0" />
                      <div className="truncate">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {p.company_name} — {p.role_title}
                        </p>
                        <span className="text-[10px] text-secondary capitalize">{p.stage.replace("_", " ")}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchingTasks.length === 0 && matchingLibrary.length === 0 && matchingPlacements.length === 0 && (
            <p className="py-6 text-center text-xs text-secondary">No matching records found for "{query}".</p>
          )}
        </div>
      </div>
    </div>
  );
};
