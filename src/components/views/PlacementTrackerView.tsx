"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PlacementOpportunity, PlacementStage } from "@/types";
import {
  Briefcase,
  Plus,
  CheckCircle,
  ExternalLink,
  Calendar,
  Building,
  DollarSign,
  TrendingUp,
  Award,
  ChevronRight,
  Trash2,
} from "lucide-react";

export const PlacementTrackerView: React.FC = () => {
  const { placements, addPlacement, updatePlacement, deletePlacement, currentUser, setIsQuickAddOpen } = useApp();

  const [selectedStage, setSelectedStage] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const stages: { id: PlacementStage; label: string }[] = [
    { id: "interested", label: "Interested" },
    { id: "applied", label: "Applied" },
    { id: "assessment_scheduled", label: "Assessment Scheduled" },
    { id: "interview_scheduled", label: "Interview Scheduled" },
    { id: "offer_received", label: "Offer Received" },
    { id: "rejected", label: "Rejected" },
  ];

  const filteredPlacements = placements.filter((p) => {
    if (selectedStage !== "all" && p.stage !== selectedStage) return false;
    return true;
  });

  const handleStageChange = (id: string, newStage: PlacementStage) => {
    updatePlacement(id, { stage: newStage });
  };

  const handleToggleChecklist = (placementId: string, itemIdx: number) => {
    const opp = placements.find((p) => p.id === placementId);
    if (!opp || !opp.preparation_checklist) return;

    const updated = [...opp.preparation_checklist];
    updated[itemIdx].completed = !updated[itemIdx].completed;
    updatePlacement(placementId, { preparation_checklist: updated });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Placement Tracker & Opportunities
          </h1>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Manage your company application pipeline, assessment dates, interview stages, and prep checklists.
          </p>
        </div>

        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="flex items-center space-x-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary-hover transition-colors self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Add Opportunity</span>
        </button>
      </div>

      {/* Top Placement Summary Metrics */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-surface p-4 shadow-subtle">
          <span className="text-xs font-semibold text-secondary">Active Applications</span>
          <div className="mt-1 text-2xl font-black text-foreground">
            {placements.filter((p) => p.stage !== "rejected" && p.stage !== "withdrawn").length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">In active pipeline</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-subtle">
          <span className="text-xs font-semibold text-secondary">Assessments Scheduled</span>
          <div className="mt-1 text-2xl font-black text-foreground">
            {placements.filter((p) => p.stage === "assessment_scheduled").length}
          </div>
          <span className="text-[11px] text-primary font-medium">Coding & aptitude tests</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-subtle">
          <span className="text-xs font-semibold text-secondary">Interviews Scheduled</span>
          <div className="mt-1 text-2xl font-black text-foreground">
            {placements.filter((p) => p.stage === "interview_scheduled").length}
          </div>
          <span className="text-[11px] text-purple-600 font-medium">Live technical rounds</span>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-4 shadow-subtle">
          <span className="text-xs font-semibold text-secondary">Offers Received</span>
          <div className="mt-1 text-2xl font-black text-foreground">
            {placements.filter((p) => p.stage === "offer_received").length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium">Final selection</span>
        </div>
      </div>

      {/* Stage Filters */}
      <div className="flex space-x-1.5 overflow-x-auto rounded-2xl border border-border bg-surface p-2 shadow-subtle">
        <button
          onClick={() => setSelectedStage("all")}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
            selectedStage === "all"
              ? "bg-primary text-white shadow-xs"
              : "text-secondary hover:bg-surface-raised hover:text-foreground"
          }`}
        >
          All Stages ({placements.length})
        </button>
        {stages.map((st) => (
          <button
            key={st.id}
            onClick={() => setSelectedStage(st.id)}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
              selectedStage === st.id
                ? "bg-primary text-white shadow-xs"
                : "text-secondary hover:bg-surface-raised hover:text-foreground"
            }`}
          >
            {st.label} ({placements.filter((p) => p.stage === st.id).length})
          </button>
        ))}
      </div>

      {/* Placement List */}
      <div className="space-y-4">
        {filteredPlacements.length === 0 ? (
          <div className="rounded-2xl border border-border bg-surface p-12 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-secondary/40" />
            <h3 className="mt-3 text-sm font-bold text-foreground">No Placements in this Stage</h3>
            <p className="mt-1 text-xs text-secondary">
              Record new company applications to track tests, deadlines, and technical interviews.
            </p>
          </div>
        ) : (
          filteredPlacements.map((opp) => {
            const isExpanded = expandedId === opp.id;
            const prepCompleted =
              opp.preparation_checklist?.filter((item) => item.completed).length || 0;
            const prepTotal = opp.preparation_checklist?.length || 0;
            const readinessPercent = prepTotal > 0 ? Math.round((prepCompleted / prepTotal) * 100) : 100;

            return (
              <div
                key={opp.id}
                className="overflow-hidden rounded-2xl border border-border bg-surface p-5 shadow-subtle transition-all hover:border-primary/40"
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div className="flex items-start space-x-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary font-bold text-sm">
                      {opp.company_name[0]}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-foreground">{opp.company_name}</h3>
                        <span className="text-xs text-secondary">• {opp.role_title}</span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-secondary">
                        {opp.salary_or_stipend && (
                          <span className="font-mono font-semibold text-emerald-600">
                            {opp.salary_or_stipend}
                          </span>
                        )}
                        {opp.date_applied && (
                          <span>Applied: {new Date(opp.date_applied).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stage Dropdown Selector & Delete */}
                  <div className="flex items-center space-x-2">
                    <select
                      value={opp.stage}
                      onChange={(e) => handleStageChange(opp.id, e.target.value as PlacementStage)}
                      className="rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-xs font-bold text-foreground focus:border-primary focus:outline-none"
                    >
                      {stages.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-surface-raised transition-colors"
                    >
                      {isExpanded ? "Collapse" : "Prep Details"}
                    </button>

                    <button
                      onClick={() => deletePlacement(opp.id)}
                      className="rounded-lg border border-border p-1.5 text-secondary hover:bg-danger/10 hover:text-danger transition-colors"
                      title="Delete opportunity"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Preparation Readiness Bar */}
                <div className="mt-4 border-t border-border pt-3">
                  <div className="flex justify-between text-xs font-semibold text-secondary mb-1">
                    <span>Interview Preparation Readiness</span>
                    <strong className="text-foreground">
                      {readinessPercent}% ({prepCompleted} of {prepTotal} tasks)
                    </strong>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-raised border border-border">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${readinessPercent}%` }}
                    />
                  </div>
                </div>

                {/* Expanded Checklist & Notes */}
                {isExpanded && (
                  <div className="mt-4 rounded-xl border border-border bg-surface-raised/50 p-4 space-y-4">
                    {/* Notes */}
                    {opp.notes && (
                      <div>
                        <span className="text-xs font-bold text-foreground">Opportunity Notes</span>
                        <p className="mt-1 text-xs text-secondary leading-relaxed">{opp.notes}</p>
                      </div>
                    )}

                    {/* Preparation Checklist */}
                    {opp.preparation_checklist && opp.preparation_checklist.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-foreground mb-2 block">
                          Company Preparation Checklist
                        </span>
                        <div className="space-y-1.5">
                          {opp.preparation_checklist.map((item, idx) => (
                            <label
                              key={idx}
                              className="flex items-center space-x-2 text-xs text-foreground cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={item.completed}
                                onChange={() => handleToggleChecklist(opp.id, idx)}
                                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                              />
                              <span className={item.completed ? "line-through text-secondary" : ""}>
                                {item.title}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* External Link */}
                    {opp.application_url && (
                      <div className="pt-2 border-t border-border">
                        <a
                          href={opp.application_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center space-x-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View Company Job Portal</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
