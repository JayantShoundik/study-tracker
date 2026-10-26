import {
  Profile,
  Workspace,
  Subject,
  Topic,
  Task,
  LibraryEntry,
  PlacementOpportunity,
  CalendarEvent,
  FocusSession,
  AiEvaluation,
} from "@/types";

export const JAYANT_USER: Profile = {
  id: "user-jayant-01",
  display_name: "Jayant",
  email: "jayant@focusforge.dev",
  avatar_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
  timezone: "Asia/Kolkata",
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const REKHA_USER: Profile = {
  id: "user-rekha-02",
  display_name: "Rekha",
  email: "rekha@focusforge.dev",
  avatar_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
  timezone: "Asia/Kolkata",
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const DEFAULT_WORKSPACE: Workspace = {
  id: "ws-forge-01",
  name: "Jayant & Rekha FocusForge",
  description: "Shared study & placement command center for SDE preparation.",
  created_by: JAYANT_USER.id,
  created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: "sub-dsa",
    workspace_id: DEFAULT_WORKSPACE.id,
    title: "Data Structures & Algorithms",
    code: "DSA",
    icon: "code",
    color: "#4F46E5",
    description: "Arrays, Strings, Linked Lists, Trees, Graphs, DP",
    is_archived: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-oop",
    workspace_id: DEFAULT_WORKSPACE.id,
    title: "OOP & Fundamentals",
    code: "OOP",
    icon: "layers",
    color: "#0284C7",
    description: "Abstraction, Encapsulation, Polymorphism, Inheritance",
    is_archived: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-dbms",
    workspace_id: DEFAULT_WORKSPACE.id,
    title: "DBMS & SQL",
    code: "DBMS",
    icon: "database",
    color: "#059669",
    description: "Joins, Indexing, Transactions, Normalization, Query Tuning",
    is_archived: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-cn",
    workspace_id: DEFAULT_WORKSPACE.id,
    title: "Computer Networks",
    code: "CN",
    icon: "network",
    color: "#D97706",
    description: "OSI Model, TCP/IP, DNS, HTTP/3, Socket Programming",
    is_archived: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-os",
    workspace_id: DEFAULT_WORKSPACE.id,
    title: "Operating Systems",
    code: "OS",
    icon: "cpu",
    color: "#7C3AED",
    description: "Processes, Threads, Deadlocks, Paging, Virtual Memory",
    is_archived: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-apt",
    workspace_id: DEFAULT_WORKSPACE.id,
    title: "Aptitude & Reasoning",
    code: "APT",
    icon: "calculator",
    color: "#E11D48",
    description: "Quantitative Aptitude, Logical Reasoning, Verbal Ability",
    is_archived: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "sub-hr",
    workspace_id: DEFAULT_WORKSPACE.id,
    title: "Technical & HR Interviews",
    code: "HR",
    icon: "user-check",
    color: "#0D9488",
    description: "Behavioral questions, STAR method, System Design discussion",
    is_archived: false,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_TOPICS: Topic[] = [
  {
    id: "top-arrays",
    subject_id: "sub-dsa",
    title: "Arrays & Strings",
    description: "Two pointers, sliding window, prefix sums",
    importance_level: 5,
    created_at: new Date().toISOString(),
    current_mastery: "understood",
  },
  {
    id: "top-trees",
    subject_id: "sub-dsa",
    title: "Binary Trees & BST",
    description: "Traversals, LCA, Height, Balancing",
    importance_level: 5,
    created_at: new Date().toISOString(),
    current_mastery: "learning",
  },
  {
    id: "top-abstraction",
    subject_id: "sub-oop",
    title: "Abstraction & Interfaces",
    description: "Abstract classes vs Interfaces, concrete implementations",
    importance_level: 4,
    created_at: new Date().toISOString(),
    current_mastery: "interview_ready",
  },
  {
    id: "top-joins",
    subject_id: "sub-dbms",
    title: "SQL Joins & Aggregations",
    description: "INNER, LEFT, RIGHT, FULL OUTER joins and GROUP BY/HAVING",
    importance_level: 5,
    created_at: new Date().toISOString(),
    current_mastery: "understood",
  },
  {
    id: "top-deadlocks",
    subject_id: "sub-os",
    title: "Deadlocks & Semaphores",
    description: "Banker's Algorithm, Mutex vs Semaphore, Coffman conditions",
    importance_level: 4,
    created_at: new Date().toISOString(),
    current_mastery: "needs_revision",
  },
];

// Clean slate: starting fresh for tomorrow!
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_LIBRARY_ENTRIES: LibraryEntry[] = [];
export const INITIAL_PLACEMENTS: PlacementOpportunity[] = [];
export const INITIAL_CALENDAR_EVENTS: CalendarEvent[] = [];
export const INITIAL_FOCUS_SESSIONS: FocusSession[] = [];

export const INITIAL_AI_EVALUATION: AiEvaluation = {
  id: "ai-eval-fresh",
  submission_id: "sub-fresh-01",
  task_id: "fresh",
  user_id: JAYANT_USER.id,
  model_name: "gemini-2.5-flash",
  overall_score: 100,
  criterion_scores: {
    "Fresh Start Readiness": 100,
  },
  correct_aspects: [
    "Clean slate activated. Ready to conquer tomorrow's targets!",
  ],
  mistakes: [],
  missing_concepts: [],
  suggested_improvements: "Plan tomorrow's goals tonight for high morning momentum.",
  follow_up_questions: [],
  recommended_action: "Ready for Day 1 fresh start.",
  rubric_version: "v2.0",
  user_feedback_useful: true,
  created_at: new Date().toISOString(),
};
