"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { LibraryEntry, LibraryEntryType } from "@/types";
import {
  Bookmark,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Star,
  Trash2,
  Youtube,
  Link as LinkIcon,
  FileText,
  Calendar,
  Briefcase,
  Share2,
  Check,
} from "lucide-react";

export const LibraryBagView: React.FC = () => {
  const {
    libraryEntries,
    addLibraryEntry,
    updateLibraryEntry,
    deleteLibraryEntry,
    toggleFavouriteEntry,
    currentUser,
    subjects,
    setIsQuickAddOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"all" | "links" | "youtube" | "notes" | "dates" | "applications" | "favourites">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url?: string, id?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredEntries = libraryEntries.filter((entry) => {
    // Tab filter
    if (activeTab === "links" && entry.entry_type !== "link") return false;
    if (activeTab === "youtube" && entry.entry_type !== "youtube_resource") return false;
    if (activeTab === "notes" && entry.entry_type !== "note" && entry.entry_type !== "code_snippet") return false;
    if (activeTab === "dates" && entry.entry_type !== "important_date") return false;
    if (activeTab === "applications" && entry.entry_type !== "application_record") return false;
    if (activeTab === "favourites" && !entry.is_favourite) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.description?.toLowerCase().includes(q) ||
        entry.written_content?.toLowerCase().includes(q) ||
        entry.url?.toLowerCase().includes(q) ||
        entry.confirmation_ref?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getIconForType = (type: LibraryEntryType) => {
    switch (type) {
      case "youtube_resource":
        return <Youtube className="h-4 w-4 text-red-500" />;
      case "link":
        return <LinkIcon className="h-4 w-4 text-primary" />;
      case "note":
      case "code_snippet":
        return <FileText className="h-4 w-4 text-emerald-500" />;
      case "important_date":
        return <Calendar className="h-4 w-4 text-amber-500" />;
      case "application_record":
        return <Briefcase className="h-4 w-4 text-indigo-500" />;
      default:
        return <Bookmark className="h-4 w-4 text-secondary" />;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Library Bag — Knowledge & Reference Vault
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Curate tutorials, YouTube videos, interview cheat-sheets, application tracking numbers, and critical dates.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Quick Capture</span>
        </button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
        {/* Category Filter Pills */}
        <div className="flex space-x-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Items" },
            { id: "links", label: "Links" },
            { id: "youtube", label: "YouTube" },
            { id: "notes", label: "Notes" },
            { id: "dates", label: "Important Dates" },
            { id: "applications", label: "Applications" },
            { id: "favourites", label: "★ Starred" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "text-secondary hover:bg-surface-raised hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-secondary" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vault..."
            className="w-full rounded-lg border border-border bg-surface pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-secondary focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Grid of Vault Entries */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-border bg-surface p-12 text-center">
            <Bookmark className="mx-auto h-8 w-8 text-secondary/40" />
            <h3 className="mt-3 text-sm font-bold text-foreground">No Vault Records Found</h3>
            <p className="mt-1 text-xs text-secondary">
              Use "Quick Capture" above to add links, notes, or application references.
            </p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const subject = subjects.find((s) => s.id === entry.subject_id);

            return (
              <div
                key={entry.id}
                className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-4 shadow-subtle transition-all hover:border-primary/40 hover:shadow-card"
              >
                <div>
                  {/* Top line: Type Icon, Subject Pill, Star Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-raised border border-border">
                        {getIconForType(entry.entry_type)}
                      </div>
                      <span className="text-[11px] font-bold text-secondary uppercase">
                        {entry.entry_type.replace("_", " ")}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleFavouriteEntry(entry.id)}
                      className="rounded-md p-1 text-secondary hover:text-amber-500 transition-colors"
                      title={entry.is_favourite ? "Unstar" : "Star"}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          entry.is_favourite ? "fill-amber-400 text-amber-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-3 text-sm font-bold text-foreground line-clamp-1">{entry.title}</h3>
                  <p className="mt-1 text-xs text-secondary line-clamp-2 leading-relaxed">
                    {entry.description}
                  </p>

                  {/* Written Note Snippet Preview */}
                  {entry.written_content && (
                    <div className="mt-2.5 rounded-lg border border-border bg-surface-raised/50 p-2 text-[11px] font-mono text-secondary line-clamp-3">
                      {entry.written_content}
                    </div>
                  )}

                  {/* Application Specific metadata */}
                  {entry.confirmation_ref && (
                    <div className="mt-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-900 p-2 text-[11px]">
                      <span className="text-secondary font-semibold">Ref Number:</span>{" "}
                      <strong className="text-foreground font-mono">{entry.confirmation_ref}</strong>
                      {entry.status && (
                        <span className="ml-2 rounded bg-indigo-100 dark:bg-indigo-900 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                          {entry.status}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Important Date metadata */}
                  {entry.event_at && (
                    <div className="mt-2 flex items-center space-x-1.5 text-xs text-amber-600 font-semibold">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(entry.event_at).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                {/* Footer Controls */}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                  {entry.url ? (
                    <div className="flex items-center space-x-2">
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1 font-semibold text-primary hover:underline truncate max-w-[150px]"
                      >
                        <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">Open Link</span>
                      </a>

                      <button
                        onClick={() => handleCopyLink(entry.url, entry.id)}
                        className="rounded p-1 text-secondary hover:bg-surface-raised hover:text-foreground transition-colors"
                        title="Copy URL"
                      >
                        {copiedId === entry.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-secondary">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  )}

                  <button
                    onClick={() => deleteLibraryEntry(entry.id)}
                    className="rounded p-1 text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
