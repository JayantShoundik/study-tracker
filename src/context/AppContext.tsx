"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import {
  Profile,
  Workspace,
  Subject,
  Topic,
  Task,
  TaskStatus,
  SubmissionType,
  LibraryEntry,
  PlacementOpportunity,
  CalendarEvent,
  FocusSession,
  AiEvaluation,
  Notification,
  UserPreferences,
  MasteryLevel,
} from "@/types";
import {
  JAYANT_USER,
  REKHA_USER,
  DEFAULT_WORKSPACE,
  INITIAL_SUBJECTS,
  INITIAL_TOPICS,
  INITIAL_TASKS,
  INITIAL_LIBRARY_ENTRIES,
  INITIAL_PLACEMENTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_FOCUS_SESSIONS,
  INITIAL_AI_EVALUATION,
} from "@/lib/mockData";

interface AppContextType {
  currentUser: Profile;
  switchUser: (user: Profile) => void;
  workspace: Workspace;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Partial<Task>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  carryForwardTask: (id: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  
  // Subjects & Topics
  subjects: Subject[];
  topics: Topic[];
  addSubject: (subject: Partial<Subject>) => void;
  addTopic: (topic: Partial<Topic>) => void;
  updateTopicMastery: (topicId: string, level: MasteryLevel) => void;

  // Focus Timer & Stopwatch
  activeSession: FocusSession | null;
  activeSeconds: number;
  isTimerRunning: boolean;
  startFocusSession: (taskId: string) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  stopFocusSession: () => void;
  completeTaskWithVerification: (taskId: string) => { success: boolean; message: string };
  completedSessions: FocusSession[];

  // Library Bag
  libraryEntries: LibraryEntry[];
  addLibraryEntry: (entry: Partial<LibraryEntry>) => void;
  updateLibraryEntry: (id: string, updates: Partial<LibraryEntry>) => void;
  deleteLibraryEntry: (id: string) => void;
  toggleFavouriteEntry: (id: string) => void;

  // Placements
  placements: PlacementOpportunity[];
  addPlacement: (placement: Partial<PlacementOpportunity>) => void;
  updatePlacement: (id: string, updates: Partial<PlacementOpportunity>) => void;
  deletePlacement: (id: string) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // AI Evaluations
  aiEvaluations: AiEvaluation[];
  recordAiEvaluation: (evalData: AiEvaluation) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (title: string, message: string, category?: Notification["category"], actionUrl?: string) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Preferences & Theme
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;

  // UI state
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isFloatingTimerOpen: boolean;
  setIsFloatingTimerOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_PREFIX = "focusforge_v1_";

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user state (Jayant by default, toggleable to Rekha)
  const [currentUser, setCurrentUser] = useState<Profile>(JAYANT_USER);
  const [workspace] = useState<Workspace>(DEFAULT_WORKSPACE);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [isFloatingTimerOpen, setIsFloatingTimerOpen] = useState<boolean>(true);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);

  // Entities
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [subjects, setSubjects] = useState<Subject[]>(INITIAL_SUBJECTS);
  const [topics, setTopics] = useState<Topic[]>(INITIAL_TOPICS);
  const [libraryEntries, setLibraryEntries] = useState<LibraryEntry[]>(INITIAL_LIBRARY_ENTRIES);
  const [placements, setPlacements] = useState<PlacementOpportunity[]>(INITIAL_PLACEMENTS);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [completedSessions, setCompletedSessions] = useState<FocusSession[]>(INITIAL_FOCUS_SESSIONS);
  const [aiEvaluations, setAiEvaluations] = useState<AiEvaluation[]>([INITIAL_AI_EVALUATION]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif-01",
      user_id: JAYANT_USER.id,
      workspace_id: DEFAULT_WORKSPACE.id,
      title: "Task Assigned by Rekha",
      message: "Rekha assigned you: 'Reverse an array and string in-place'",
      category: "task_assigned",
      is_read: false,
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "notif-02",
      user_id: JAYANT_USER.id,
      workspace_id: DEFAULT_WORKSPACE.id,
      title: "Upcoming Assessment",
      message: "Microsoft Codility assessment scheduled in 3 days.",
      category: "deadline",
      is_read: false,
      created_at: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const [preferences, setPreferences] = useState<UserPreferences>({
    user_id: JAYANT_USER.id,
    theme: "light",
    reminder_interval_minutes: 60,
    quiet_hours_start: "23:00",
    quiet_hours_end: "07:00",
    sound_enabled: true,
    vibration_enabled: true,
    daily_planning_reminder_time: "08:30",
    eod_review_reminder_time: "21:30",
  });

  // Persistent Timer state
  const [activeSession, setActiveSession] = useState<FocusSession | null>(null);
  const [activeSeconds, setActiveSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}tasks`);
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedEntries = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}library`);
      if (savedEntries) setLibraryEntries(JSON.parse(savedEntries));

      const savedPlacements = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}placements`);
      if (savedPlacements) setPlacements(JSON.parse(savedPlacements));

      const savedEvents = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}calendar`);
      if (savedEvents) setCalendarEvents(JSON.parse(savedEvents));

      const savedSession = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}active_session`);
      if (savedSession) {
        const session: FocusSession = JSON.parse(savedSession);
        setActiveSession(session);

        if (session.status === "running" && session.last_resumed_at) {
          const now = Date.now();
          const resumedAt = new Date(session.last_resumed_at).getTime();
          const additionalElapsed = Math.max(0, Math.floor((now - resumedAt) / 1000));
          const totalAccumulated = session.accumulated_focus_seconds + additionalElapsed;
          setActiveSeconds(totalAccumulated);
          setIsTimerRunning(true);
        } else {
          setActiveSeconds(session.accumulated_focus_seconds);
          setIsTimerRunning(false);
        }
      }

      const savedTheme = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}theme`);
      if (savedTheme === "dark" || savedTheme === "light") {
        setTheme(savedTheme);
        document.documentElement.classList.toggle("dark", savedTheme === "dark");
      }
    } catch (e) {
      console.warn("Could not load initial localStorage state", e);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}tasks`, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}library`, JSON.stringify(libraryEntries));
    } catch {}
  }, [libraryEntries]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}placements`, JSON.stringify(placements));
    } catch {}
  }, [placements]);

  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}calendar`, JSON.stringify(calendarEvents));
    } catch {}
  }, [calendarEvents]);

  // Persistent Timer Interval Engine
  useEffect(() => {
    if (isTimerRunning && activeSession) {
      timerIntervalRef.current = setInterval(() => {
        setActiveSeconds((prev) => {
          const next = prev + 1;
          return next;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isTimerRunning, activeSession]);

  // Synchronize activeSession periodically to localStorage
  useEffect(() => {
    if (activeSession) {
      const updatedSession: FocusSession = {
        ...activeSession,
        accumulated_focus_seconds: activeSeconds,
        status: isTimerRunning ? "running" : "paused",
      };
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}active_session`, JSON.stringify(updatedSession));
    } else {
      localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}active_session`);
    }
  }, [activeSession, activeSeconds, isTimerRunning]);

  // Hourly Accountability & Reminder System
  useEffect(() => {
    const hourlyTimer = setInterval(() => {
      // Check for pending / unfinished targets
      const pendingUserTasks = tasks.filter(
        (t) => t.assigned_to === currentUser.id && (t.status === "planned" || t.status === "in_progress")
      );

      if (pendingUserTasks.length > 0) {
        const topTask = pendingUserTasks[0];
        addNotification(
          "Hourly Focus Check-in",
          activeSession
            ? `Focus session in progress on "${activeSession.task?.title}". Keep up the strong momentum!`
            : `You have ${pendingUserTasks.length} pending target(s). Ready to tackle "${topTask.title}"?`,
          "reminder",
          "/targets"
        );

        // Sound cue if enabled
        if (preferences.sound_enabled && typeof window !== "undefined") {
          try {
            const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.frequency.value = 587.33; // D5
            gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.4);
          } catch {}
        }
      }
    }, 60 * 60 * 1000); // 1 hour interval

    return () => clearInterval(hourlyTimer);
  }, [tasks, activeSession, currentUser, preferences]);

  // User switcher
  const switchUser = (user: Profile) => {
    setCurrentUser(user);
    addNotification("Profile Switched", `Now viewing as ${user.display_name}.`, "reminder");
  };

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}theme`, next);
      return next;
    });
  };

  // Task actions
  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      workspace_id: workspace.id,
      created_by: currentUser.id,
      assigned_to: taskData.assigned_to || currentUser.id,
      subject_id: taskData.subject_id,
      topic_id: taskData.topic_id,
      title: taskData.title || "Untitled Target",
      description: taskData.description || "",
      learning_objectives: taskData.learning_objectives || "",
      expected_output: taskData.expected_output || "",
      submission_type: taskData.submission_type || "explanation",
      priority: taskData.priority || "medium",
      status: "planned",
      estimated_minutes: taskData.estimated_minutes || 45,
      minimum_focus_seconds: taskData.minimum_focus_seconds || 600, // 10 min default
      due_at: taskData.due_at || new Date(Date.now() + 86400000).toISOString(),
      carry_forward_count: 0,
      subtasks: taskData.subtasks || [],
      reference_links: taskData.reference_links || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);

    // If assigned to other user, send notification
    if (newTask.assigned_to && newTask.assigned_to !== currentUser.id) {
      addNotification(
        "New Task Delegated",
        `Task "${newTask.title}" has been assigned to ${
          newTask.assigned_to === REKHA_USER.id ? "Rekha" : "Jayant"
        }.`,
        "task_assigned"
      );
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const carryForwardTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(20, 0, 0, 0);
          return {
            ...t,
            due_at: tomorrow.toISOString(),
            carried_forward_from_date: new Date().toISOString().split("T")[0],
            carry_forward_count: t.carry_forward_count + 1,
            status: "planned",
            updated_at: new Date().toISOString(),
          };
        }
        return t;
      })
    );
    addNotification("Target Carried Forward", "Task moved to tomorrow with deadline history preserved.", "reminder");
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          const updatedSubtasks = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, is_completed: !st.is_completed } : st
          );
          return { ...t, subtasks: updatedSubtasks, updated_at: new Date().toISOString() };
        }
        return t;
      })
    );
  };

  // Subjects & Topics
  const addSubject = (subjectData: Partial<Subject>) => {
    const newSubject: Subject = {
      id: `sub-${Date.now()}`,
      workspace_id: workspace.id,
      title: subjectData.title || "New Subject",
      code: subjectData.code || "SUB",
      icon: subjectData.icon || "book-open",
      color: subjectData.color || "#4F46E5",
      description: subjectData.description || "",
      is_archived: false,
      created_at: new Date().toISOString(),
    };
    setSubjects((prev) => [...prev, newSubject]);
  };

  const addTopic = (topicData: Partial<Topic>) => {
    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      subject_id: topicData.subject_id || (subjects[0]?.id || "sub-dsa"),
      title: topicData.title || "New Topic",
      description: topicData.description || "",
      importance_level: topicData.importance_level || 3,
      created_at: new Date().toISOString(),
      current_mastery: "not_started",
    };
    setTopics((prev) => [...prev, newTopic]);
  };

  const updateTopicMastery = (topicId: string, level: MasteryLevel) => {
    setTopics((prev) =>
      prev.map((top) => (top.id === topicId ? { ...top, current_mastery: level } : top))
    );
  };

  // Timer actions
  const startFocusSession = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    // If an existing session was running on another task, save it first
    if (activeSession && activeSession.task_id !== taskId) {
      stopFocusSession();
    }

    const newSession: FocusSession = {
      id: `sess-${Date.now()}`,
      workspace_id: workspace.id,
      user_id: currentUser.id,
      task_id: taskId,
      task: task,
      started_at: new Date().toISOString(),
      last_resumed_at: new Date().toISOString(),
      status: "running",
      accumulated_focus_seconds: 0,
    };

    setActiveSession(newSession);
    setActiveSeconds(0);
    setIsTimerRunning(true);
    setIsFloatingTimerOpen(true);

    // Update task status to in_progress
    updateTask(taskId, { status: "in_progress" });
  };

  const pauseFocusSession = () => {
    if (!activeSession) return;
    setIsTimerRunning(false);
    setActiveSession((prev) => (prev ? { ...prev, status: "paused" } : null));
  };

  const resumeFocusSession = () => {
    if (!activeSession) return;
    setIsTimerRunning(true);
    setActiveSession((prev) =>
      prev ? { ...prev, status: "running", last_resumed_at: new Date().toISOString() } : null
    );
  };

  const stopFocusSession = () => {
    if (!activeSession) return;

    const finishedSession: FocusSession = {
      ...activeSession,
      status: "stopped",
      ended_at: new Date().toISOString(),
      accumulated_focus_seconds: activeSeconds,
    };

    setCompletedSessions((prev) => [finishedSession, ...prev]);
    setActiveSession(null);
    setIsTimerRunning(false);
    setActiveSeconds(0);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY_PREFIX}active_session`);
  };

  // 10-Minute Minimum Rule Verification
  const completeTaskWithVerification = (taskId: string): { success: boolean; message: string } => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return { success: false, message: "Task not found." };

    const minRequired = task.minimum_focus_seconds || 600; // 10 minutes (600s)

    // Calculate total verified focus time for this task across sessions + active session
    let totalFocusedTime = 0;
    completedSessions
      .filter((s) => s.task_id === taskId && s.user_id === currentUser.id)
      .forEach((s) => {
        totalFocusedTime += s.accumulated_focus_seconds;
      });

    if (activeSession && activeSession.task_id === taskId) {
      totalFocusedTime += activeSeconds;
    }

    if (totalFocusedTime < minRequired) {
      const remainingSeconds = minRequired - totalFocusedTime;
      const remainingMins = Math.ceil(remainingSeconds / 60);
      return {
        success: false,
        message: `Minimum 10-minute focus rule not satisfied. This task has ${Math.floor(
          totalFocusedTime / 60
        )}m verified focus time. You need ${remainingMins} more minute(s) before completing!`,
      };
    }

    // Passed minimum duration rule!
    updateTask(taskId, {
      status: "completed",
      completed_at: new Date().toISOString(),
    });

    if (activeSession && activeSession.task_id === taskId) {
      stopFocusSession();
    }

    addNotification("Target Completed!", `"${task.title}" has been verified and marked completed.`, "reminder");
    return { success: true, message: "Target marked completed!" };
  };

  // Library actions
  const addLibraryEntry = (entryData: Partial<LibraryEntry>) => {
    const newEntry: LibraryEntry = {
      id: `lib-${Date.now()}`,
      workspace_id: workspace.id,
      created_by: currentUser.id,
      creator: currentUser,
      entry_type: entryData.entry_type || "link",
      title: entryData.title || "Untitled Entry",
      description: entryData.description || "",
      url: entryData.url || "",
      written_content: entryData.written_content || "",
      subject_id: entryData.subject_id,
      event_at: entryData.event_at,
      remind_at: entryData.remind_at,
      status: entryData.status,
      confirmation_ref: entryData.confirmation_ref,
      is_favourite: entryData.is_favourite || false,
      is_archived: false,
      is_shared: entryData.is_shared !== undefined ? entryData.is_shared : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setLibraryEntries((prev) => [newEntry, ...prev]);
  };

  const updateLibraryEntry = (id: string, updates: Partial<LibraryEntry>) => {
    setLibraryEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e))
    );
  };

  const deleteLibraryEntry = (id: string) => {
    setLibraryEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const toggleFavouriteEntry = (id: string) => {
    setLibraryEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, is_favourite: !e.is_favourite } : e))
    );
  };

  // Placements
  const addPlacement = (placementData: Partial<PlacementOpportunity>) => {
    const newPlacement: PlacementOpportunity = {
      id: `place-${Date.now()}`,
      workspace_id: workspace.id,
      user_id: currentUser.id,
      company_name: placementData.company_name || "Company",
      role_title: placementData.role_title || "Software Engineer",
      job_description: placementData.job_description || "",
      required_skills: placementData.required_skills || [],
      application_url: placementData.application_url || "",
      date_applied: placementData.date_applied || new Date().toISOString().split("T")[0],
      deadline_at: placementData.deadline_at,
      assessment_at: placementData.assessment_at,
      interview_at: placementData.interview_at,
      stage: placementData.stage || "interested",
      salary_or_stipend: placementData.salary_or_stipend || "",
      notes: placementData.notes || "",
      preparation_checklist: placementData.preparation_checklist || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setPlacements((prev) => [newPlacement, ...prev]);
  };

  const updatePlacement = (id: string, updates: Partial<PlacementOpportunity>) => {
    setPlacements((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
    );
  };

  const deletePlacement = (id: string) => {
    setPlacements((prev) => prev.filter((p) => p.id !== id));
  };

  // Calendar
  const addCalendarEvent = (eventData: Partial<CalendarEvent>) => {
    const newEvent: CalendarEvent = {
      id: `cal-${Date.now()}`,
      workspace_id: workspace.id,
      created_by: currentUser.id,
      event_type: eventData.event_type || "technical_interview",
      title: eventData.title || "Untitled Event",
      description: eventData.description || "",
      start_at: eventData.start_at || new Date().toISOString(),
      end_at: eventData.end_at,
      timezone: "Asia/Kolkata",
      reminder_minutes_before: eventData.reminder_minutes_before || 60,
      is_shared: true,
      created_at: new Date().toISOString(),
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
  };

  const deleteCalendarEvent = (id: string) => {
    setCalendarEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  // AI Evaluations
  const recordAiEvaluation = (evalData: AiEvaluation) => {
    setAiEvaluations((prev) => [evalData, ...prev]);
  };

  // Notifications
  const addNotification = (
    title: string,
    message: string,
    category: Notification["category"] = "reminder",
    actionUrl?: string
  ) => {
    const newNotif: Notification = {
      id: `notif-${Date.now()}`,
      user_id: currentUser.id,
      workspace_id: workspace.id,
      title,
      message,
      action_url: actionUrl,
      is_read: false,
      category,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Preferences
  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        workspace,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        carryForwardTask,
        toggleSubtask,
        subjects,
        topics,
        addSubject,
        addTopic,
        updateTopicMastery,
        activeSession,
        activeSeconds,
        isTimerRunning,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        stopFocusSession,
        completeTaskWithVerification,
        completedSessions,
        libraryEntries,
        addLibraryEntry,
        updateLibraryEntry,
        deleteLibraryEntry,
        toggleFavouriteEntry,
        placements,
        addPlacement,
        updatePlacement,
        deletePlacement,
        calendarEvents,
        addCalendarEvent,
        deleteCalendarEvent,
        aiEvaluations,
        recordAiEvaluation,
        notifications,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
        preferences,
        updatePreferences,
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        isFloatingTimerOpen,
        setIsFloatingTimerOpen,
        isQuickAddOpen,
        setIsQuickAddOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
