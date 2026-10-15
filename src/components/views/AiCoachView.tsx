"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AiEvaluation, SubmissionType } from "@/types";
import {
  Bot,
  Sparkles,
  Send,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  RotateCcw,
  Code,
  Database,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Award,
} from "lucide-react";

export const AiCoachView: React.FC = () => {
  const { tasks, aiEvaluations, recordAiEvaluation, currentUser } = useApp();

  const [selectedTaskId, setSelectedTaskId] = useState<string>(tasks[0]?.id || "");
  const [submissionType, setSubmissionType] = useState<SubmissionType>("code");
  const [submissionContent, setSubmissionContent] = useState<string>(
`// Java Solution: Reverse an array in-place using two pointers
public class Solution {
    public static void reverseArray(int[] arr) {
        if (arr == null || arr.length <= 1) return;
        
        int left = 0;
        int right = arr.length - 1;
        
        while (left < right) {
            int temp = arr[left];
            arr[left] = arr[right];
            arr[right] = temp;
            left++;
            right--;
        }
    }
}
// Time Complexity: O(N) where N is array length
// Space Complexity: O(1) auxiliary space`
  );

  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentResult, setCurrentResult] = useState<AiEvaluation | null>(
    aiEvaluations[0] || null
  );
  const [evalError, setEvalError] = useState<string | null>(null);

  const activeTask = tasks.find((t) => t.id === selectedTaskId);

  const handleEvaluate = async () => {
    if (!submissionContent.trim()) return;

    setIsEvaluating(true);
    setEvalError(null);

    try {
      const res = await fetch("/api/ai/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskTitle: activeTask?.title || "Technical Concept Evaluation",
          learningObjectives: activeTask?.learning_objectives || "Mastery of code correctness, edge cases, and interview explanations.",
          submissionType,
          submissionContent,
          rubric: activeTask?.evaluation_rubric,
        }),
      });

      if (!res.ok) {
        throw new Error("Evaluation request failed");
      }

      const data = await res.json();

      const newEval: AiEvaluation = {
        id: `ai-eval-${Date.now()}`,
        submission_id: `sub-${Date.now()}`,
        task_id: selectedTaskId,
        user_id: currentUser.id,
        model_name: data.model_name || "gemini-2.5-flash",
        overall_score: data.overall_score || 85,
        criterion_scores: data.criterion_scores || {},
        correct_aspects: data.correct_aspects || [],
        mistakes: data.mistakes || [],
        missing_concepts: data.missing_concepts || [],
        suggested_improvements: data.suggested_improvements || "",
        follow_up_questions: data.follow_up_questions || [],
        recommended_action: data.recommended_action || "Understood. Practice follow-ups.",
        rubric_version: "v1.2",
        created_at: new Date().toISOString(),
      };

      setCurrentResult(newEval);
      recordAiEvaluation(newEval);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Error occurred during evaluation";
      setEvalError(msg);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Gemini AI Study Coach
            </h1>
            <span className="rounded-full bg-primary-subtle px-2.5 py-0.5 text-xs font-bold text-primary">
              Evaluator & Viva Simulator
            </span>
          </div>
          <p className="mt-1 text-xs text-secondary sm:text-sm">
            Rigorous technical assessment of code, SQL queries, OOP definitions, and mock interview viva answers.
          </p>
        </div>
      </div>

      {/* Main Grid: Input Form on Left, Detailed Feedback on Right */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Submission Editor */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-subtle">
            <h3 className="text-sm font-bold text-foreground">Submit Work for Evaluation</h3>
            <p className="text-xs text-secondary mb-4">
              Connect to a target or paste independent code/SQL/explanation.
            </p>

            <div className="space-y-3.5">
              {/* Target Selector */}
              <div>
                <label className="block text-xs font-semibold text-foreground">Associated Target</label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                >
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submission Type Buttons */}
              <div>
                <label className="block text-xs font-semibold text-foreground">Submission Type</label>
                <div className="mt-1 flex space-x-2">
                  {[
                    { id: "code", label: "Code (C++/Java/Python)", icon: Code },
                    { id: "sql", label: "SQL Query", icon: Database },
                    { id: "explanation", label: "Explanation / Viva", icon: FileText },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isSel = submissionType === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSubmissionType(item.id as SubmissionType)}
                        className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                          isSel
                            ? "border-primary bg-primary text-white shadow-xs"
                            : "border-border text-secondary hover:bg-surface-raised"
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Code / Text Editor */}
              <div>
                <label className="block text-xs font-semibold text-foreground">
                  Your Answer or Solution *
                </label>
                <textarea
                  rows={12}
                  value={submissionContent}
                  onChange={(e) => setSubmissionContent(e.target.value)}
                  placeholder="Paste your solution or interview answer here..."
                  className="mt-1 w-full rounded-xl border border-border bg-surface-raised p-3 font-mono text-xs text-foreground focus:border-primary focus:outline-none"
                />
              </div>

              {/* Action Button */}
              <button
                onClick={handleEvaluate}
                disabled={isEvaluating || !submissionContent.trim()}
                className="flex w-full items-center justify-center space-x-2 rounded-xl bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary-hover disabled:opacity-50 transition-colors"
              >
                {isEvaluating ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-spin text-amber-300" />
                    <span>Gemini is evaluating your submission...</span>
                  </>
                ) : (
                  <>
                    <Bot className="h-4 w-4" />
                    <span>Evaluate with AI Study Coach</span>
                  </>
                )}
              </button>

              {evalError && (
                <div className="flex items-center space-x-2 rounded-lg bg-danger/10 border border-danger/20 p-2 text-xs text-danger">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{evalError}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Detailed Structured Feedback */}
        <div className="space-y-4">
          {currentResult ? (
            <div className="rounded-2xl border border-border bg-surface p-6 shadow-floating space-y-5 animate-scale-in">
              {/* Score Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                    Evaluation Result ({currentResult.model_name})
                  </span>
                  <div className="mt-1 flex items-baseline space-x-2">
                    <span className="text-3xl font-black text-foreground">
                      {currentResult.overall_score}
                    </span>
                    <span className="text-sm font-semibold text-secondary">/ 100</span>
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold ${
                        currentResult.overall_score >= 85
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                      }`}
                    >
                      {currentResult.recommended_action}
                    </span>
                  </div>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-subtle text-primary">
                  <Award className="h-6 w-6" />
                </div>
              </div>

              {/* Criterion Breakdown */}
              {Object.keys(currentResult.criterion_scores).length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-secondary uppercase mb-2">
                    Rubric Criteria Breakdown
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(currentResult.criterion_scores).map(([crit, val]) => (
                      <div key={crit} className="rounded-xl border border-border bg-surface-raised p-2.5">
                        <span className="text-secondary block truncate">{crit}</span>
                        <strong className="text-sm font-bold text-foreground">{val}%</strong>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Correct Aspects */}
              {currentResult.correct_aspects.length > 0 && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20 p-3.5 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <CheckCircle className="h-4 w-4" />
                    <span>What You Did Right</span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-foreground/90 space-y-1">
                    {currentResult.correct_aspects.map((asp, idx) => (
                      <li key={idx}>{asp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Mistakes & Edge Cases */}
              {currentResult.mistakes.length > 0 && (
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-950/20 p-3.5 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-rose-700 dark:text-rose-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Identified Bugs / Flaws</span>
                  </div>
                  <ul className="list-disc pl-4 text-xs text-foreground/90 space-y-1">
                    {currentResult.mistakes.map((mis, idx) => (
                      <li key={idx}>{mis}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggested Improvements */}
              {currentResult.suggested_improvements && (
                <div>
                  <h4 className="text-xs font-bold text-secondary uppercase mb-1">
                    Suggested Improvements
                  </h4>
                  <p className="text-xs text-foreground leading-relaxed rounded-xl bg-surface-raised border border-border p-3">
                    {currentResult.suggested_improvements}
                  </p>
                </div>
              )}

              {/* Follow-up Interview Viva Questions */}
              {currentResult.follow_up_questions.length > 0 && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 dark:border-indigo-900 dark:bg-indigo-950/20 p-3.5 space-y-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
                    <HelpCircle className="h-4 w-4" />
                    <span>Interviewer Cross-Questions (Viva Practice)</span>
                  </div>
                  <ol className="list-decimal pl-4 text-xs text-foreground/90 space-y-1">
                    {currentResult.follow_up_questions.map((q, idx) => (
                      <li key={idx} className="font-medium">
                        "{q}"
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-surface p-12 text-center">
              <Bot className="mx-auto h-10 w-10 text-secondary/40" />
              <h3 className="mt-3 text-sm font-bold text-foreground">No Evaluation Generated Yet</h3>
              <p className="mt-1 text-xs text-secondary">
                Submit your solution on the left to receive comprehensive scoring and follow-up viva questions.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
