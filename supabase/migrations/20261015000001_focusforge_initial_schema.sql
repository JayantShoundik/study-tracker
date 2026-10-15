-- FocusForge: Study & Placement Command Center
-- Database Schema & Row Level Security Policies
-- Version: 1.0.0
-- Target: Supabase PostgreSQL (Postgres 15+)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ENUMS & DOMAINS
-- ============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE task_status AS ENUM (
        'planned',
        'in_progress',
        'submitted',
        'under_review',
        'completed',
        'needs_revision',
        'overdue',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE submission_type AS ENUM (
        'code',
        'sql',
        'written_answer',
        'explanation',
        'project_link',
        'general_evidence'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_status AS ENUM (
        'running',
        'paused',
        'stopped',
        'completed',
        'interrupted'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE session_event_type AS ENUM (
        'started',
        'paused',
        'resumed',
        'stopped',
        'recovered'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mastery_level AS ENUM (
        'not_started',
        'learning',
        'needs_revision',
        'understood',
        'interview_ready'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE library_entry_type AS ENUM (
        'link',
        'youtube_resource',
        'note',
        'code_snippet',
        'sql_query',
        'important_date',
        'application_record',
        'interview_resource',
        'placement_announcement',
        'personal_reminder'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE placement_stage AS ENUM (
        'interested',
        'researching',
        'applied',
        'assessment_scheduled',
        'assessment_completed',
        'interview_scheduled',
        'interview_completed',
        'offer_received',
        'rejected',
        'withdrawn'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE calendar_event_type AS ENUM (
        'technical_interview',
        'hr_interview',
        'online_assessment',
        'placement_test',
        'application_deadline',
        'form_submission',
        'college_examination',
        'project_deadline',
        'revision_session',
        'personal_reminder'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. USERS, WORKSPACES & MEMBERSHIP
-- ============================================================================

-- Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Asia/Kolkata' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Workspaces (Shared Study Hub for Jayant & Rekha)
CREATE TABLE IF NOT EXISTS public.workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Workspace Members (Jayant & Rekha membership)
CREATE TABLE IF NOT EXISTS public.workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role user_role DEFAULT 'member' NOT NULL,
    joined_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (workspace_id, user_id)
);

-- User Preferences (Timer, Notifications, Theme)
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'light' NOT NULL,
    reminder_interval_minutes INT DEFAULT 60 NOT NULL,
    quiet_hours_start TIME DEFAULT '23:00:00',
    quiet_hours_end TIME DEFAULT '07:00:00',
    sound_enabled BOOLEAN DEFAULT true NOT NULL,
    vibration_enabled BOOLEAN DEFAULT true NOT NULL,
    daily_planning_reminder_time TIME DEFAULT '08:30:00',
    eod_review_reminder_time TIME DEFAULT '21:30:00',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 3. TARGETS & LEARNING (SUBJECTS, TOPICS, TASKS)
-- ============================================================================

-- Subjects (DSA, OOP, DBMS, OS, CN, Web Dev, Aptitude, etc.)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    icon TEXT DEFAULT 'book-open',
    color TEXT DEFAULT '#4F46E5',
    description TEXT,
    is_archived BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Topics under Subjects
CREATE TABLE IF NOT EXISTS public.topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    importance_level INT DEFAULT 3 CHECK (importance_level BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Topic Mastery History (preserves mastery level progression)
CREATE TABLE IF NOT EXISTS public.topic_mastery_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    mastery_level mastery_level DEFAULT 'not_started' NOT NULL,
    notes TEXT,
    evaluated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Tasks (Daily Target Planner)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    learning_objectives TEXT,
    expected_output TEXT,
    submission_type submission_type DEFAULT 'explanation' NOT NULL,
    evaluation_rubric JSONB,
    priority task_priority DEFAULT 'medium' NOT NULL,
    status task_status DEFAULT 'planned' NOT NULL,
    estimated_minutes INT DEFAULT 45 NOT NULL,
    minimum_focus_seconds INT DEFAULT 600 NOT NULL, -- 10-minute minimum rule
    due_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    carried_forward_from_date DATE,
    carry_forward_count INT DEFAULT 0 NOT NULL,
    reference_links JSONB DEFAULT '[]'::jsonb,
    is_archived BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Task Subtasks / Checklist
CREATE TABLE IF NOT EXISTS public.task_subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    position INT DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Task Status Transition History (Historical Tracking)
CREATE TABLE IF NOT EXISTS public.task_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    previous_status task_status,
    new_status task_status NOT NULL,
    reason TEXT,
    changed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Task Templates (Reusable study templates)
CREATE TABLE IF NOT EXISTS public.task_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subject_code TEXT,
    description TEXT,
    submission_type submission_type DEFAULT 'explanation',
    default_subtasks JSONB DEFAULT '[]'::jsonb,
    estimated_minutes INT DEFAULT 45,
    minimum_focus_seconds INT DEFAULT 600,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 4. FOCUS & ACTIVITY TRACKING (TIMER, SESSIONS, EVENTS)
-- ============================================================================

-- Focus Sessions
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    ended_at TIMESTAMPTZ,
    status session_status DEFAULT 'running' NOT NULL,
    accumulated_focus_seconds INT DEFAULT 0 NOT NULL,
    last_resumed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Focus Session Events (Detailed start/pause/resume/stop timestamps for zero clock drift)
CREATE TABLE IF NOT EXISTS public.focus_session_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES public.focus_sessions(id) ON DELETE CASCADE,
    event_type session_event_type NOT NULL,
    event_timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    active_seconds_at_event INT DEFAULT 0 NOT NULL
);

-- Stopwatch Sessions (for mock interviews, speed coding, aptitude drills)
CREATE TABLE IF NOT EXISTS public.stopwatch_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    duration_seconds INT NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Daily Activity Summaries (Aggregated study & focus time per user per day)
CREATE TABLE IF NOT EXISTS public.daily_activity_summaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    total_focus_seconds INT DEFAULT 0 NOT NULL,
    tasks_planned INT DEFAULT 0 NOT NULL,
    tasks_completed INT DEFAULT 0 NOT NULL,
    tasks_carried_forward INT DEFAULT 0 NOT NULL,
    average_ai_score NUMERIC(5,2),
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE (workspace_id, user_id, activity_date)
);

-- ============================================================================
-- 5. AI EVALUATION & SUBMISSIONS
-- ============================================================================

-- Submissions for study tasks
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    submission_type submission_type NOT NULL,
    content TEXT NOT NULL, -- The user's code, SQL query, or explanation
    attempt_number INT DEFAULT 1 NOT NULL,
    is_latest BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- AI Evaluations (Gemini feedback history)
CREATE TABLE IF NOT EXISTS public.ai_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    model_name TEXT DEFAULT 'gemini-2.5-flash' NOT NULL,
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100) NOT NULL,
    criterion_scores JSONB DEFAULT '{}'::jsonb,
    correct_aspects JSONB DEFAULT '[]'::jsonb,
    mistakes JSONB DEFAULT '[]'::jsonb,
    missing_concepts JSONB DEFAULT '[]'::jsonb,
    suggested_improvements TEXT,
    follow_up_questions JSONB DEFAULT '[]'::jsonb,
    recommended_action TEXT,
    rubric_version TEXT DEFAULT 'v1',
    user_feedback_useful BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Revision Schedules (Spaced repetition reminders generated from mistakes)
CREATE TABLE IF NOT EXISTS public.revision_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    topic_id UUID REFERENCES public.topics(id) ON DELETE SET NULL,
    source_evaluation_id UUID REFERENCES public.ai_evaluations(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    revision_date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT false NOT NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 6. LIBRARY BAG & KNOWLEDGE VAULT
-- ============================================================================

-- Tags
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#4F46E5',
    UNIQUE (workspace_id, name)
);

-- Library Entries (Flexible Knowledge & Reference Vault)
CREATE TABLE IF NOT EXISTS public.library_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    entry_type library_entry_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    url TEXT,
    written_content TEXT,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    event_at TIMESTAMPTZ,
    remind_at TIMESTAMPTZ,
    status TEXT, -- e.g., 'Applied', 'Under Review', 'Scheduled'
    confirmation_ref TEXT,
    is_favourite BOOLEAN DEFAULT false NOT NULL,
    is_archived BOOLEAN DEFAULT false NOT NULL,
    is_shared BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Library Entry Tags (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.library_entry_tags (
    entry_id UUID NOT NULL REFERENCES public.library_entries(id) ON DELETE CASCADE,
    tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (entry_id, tag_id)
);

-- ============================================================================
-- 7. PLACEMENT TRACKER & CALENDAR
-- ============================================================================

-- Placement Opportunities (Job & Internship pipeline)
CREATE TABLE IF NOT EXISTS public.placement_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    job_description TEXT,
    required_skills JSONB DEFAULT '[]'::jsonb,
    application_url TEXT,
    date_applied DATE,
    deadline_at TIMESTAMPTZ,
    assessment_at TIMESTAMPTZ,
    interview_at TIMESTAMPTZ,
    stage placement_stage DEFAULT 'interested' NOT NULL,
    salary_or_stipend TEXT,
    notes TEXT,
    preparation_checklist JSONB DEFAULT '[]'::jsonb,
    library_entry_id UUID REFERENCES public.library_entries(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Application Events History
CREATE TABLE IF NOT EXISTS public.application_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    opportunity_id UUID NOT NULL REFERENCES public.placement_opportunities(id) ON DELETE CASCADE,
    previous_stage placement_stage,
    new_stage placement_stage NOT NULL,
    notes TEXT,
    occurred_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Calendar Events (Unified Schedule: Interviews, Deadlines, OAs, Exams)
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    event_type calendar_event_type NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    start_at TIMESTAMPTZ NOT NULL,
    end_at TIMESTAMPTZ,
    timezone TEXT DEFAULT 'Asia/Kolkata' NOT NULL,
    library_entry_id UUID REFERENCES public.library_entries(id) ON DELETE SET NULL,
    opportunity_id UUID REFERENCES public.placement_opportunities(id) ON DELETE SET NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    reminder_minutes_before INT DEFAULT 60,
    is_shared BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 8. NOTIFICATIONS & ACCOUNTABILITY
-- ============================================================================

-- Notification Subscriptions (Web Push)
CREATE TABLE IF NOT EXISTS public.notification_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Notifications (In-app and delivered)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false NOT NULL,
    category TEXT DEFAULT 'reminder', -- 'reminder', 'task_assigned', 'evaluation', 'deadline'
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================================================
-- 9. PERFORMANCE INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_tasks_workspace_due ON public.tasks (workspace_id, due_at);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_status ON public.tasks (assigned_to, status);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user_status ON public.focus_sessions (user_id, status);
CREATE INDEX IF NOT EXISTS idx_focus_events_session ON public.focus_session_events (session_id, event_timestamp);
CREATE INDEX IF NOT EXISTS idx_library_entries_search ON public.library_entries (workspace_id, entry_type);
CREATE INDEX IF NOT EXISTS idx_calendar_events_start ON public.calendar_events (workspace_id, start_at);
CREATE INDEX IF NOT EXISTS idx_placements_user_stage ON public.placement_opportunities (user_id, stage);
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON public.notifications (user_id, is_read);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_mastery_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_session_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stopwatch_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revision_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.library_entry_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper security function: Check workspace membership
CREATE OR REPLACE FUNCTION public.is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_id = ws_id AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Anyone authenticated can read member profiles in their shared workspace
CREATE POLICY "Users can read profiles" ON public.profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (id = auth.uid());

-- Workspaces: Members can view their workspaces
CREATE POLICY "Members can view workspace" ON public.workspaces
    FOR SELECT TO authenticated USING (public.is_workspace_member(id));

-- Workspace Members
CREATE POLICY "Members can view workspace members" ON public.workspace_members
    FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));

-- Tasks: Workspace members can view and manage tasks
CREATE POLICY "Workspace members view tasks" ON public.tasks
    FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members insert tasks" ON public.tasks
    FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members update tasks" ON public.tasks
    FOR UPDATE TO authenticated USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Workspace members delete tasks" ON public.tasks
    FOR DELETE TO authenticated USING (public.is_workspace_member(workspace_id));

-- Focus Sessions: User can manage their own focus sessions; workspace members can view
CREATE POLICY "Users view own or shared focus sessions" ON public.focus_sessions
    FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Users insert own focus sessions" ON public.focus_sessions
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users update own focus sessions" ON public.focus_sessions
    FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- Focus Session Events
CREATE POLICY "Users manage session events" ON public.focus_session_events
    FOR ALL TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.focus_sessions
            WHERE id = focus_session_events.session_id AND user_id = auth.uid()
        )
    );

-- Library Entries: Shared entries visible to workspace members; private visible only to creator
CREATE POLICY "Workspace members view shared or own library entries" ON public.library_entries
    FOR SELECT TO authenticated USING (
        public.is_workspace_member(workspace_id) AND (is_shared = true OR created_by = auth.uid())
    );

CREATE POLICY "Members insert library entries" ON public.library_entries
    FOR INSERT TO authenticated WITH CHECK (public.is_workspace_member(workspace_id));

CREATE POLICY "Users update own library entries" ON public.library_entries
    FOR UPDATE TO authenticated USING (created_by = auth.uid());

CREATE POLICY "Users delete own library entries" ON public.library_entries
    FOR DELETE TO authenticated USING (created_by = auth.uid());

-- Placement Opportunities: Workspace members can view each other's placement progress
CREATE POLICY "Workspace members view placement opportunities" ON public.placement_opportunities
    FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Users manage own placement opportunities" ON public.placement_opportunities
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- Calendar Events: Shared events visible to workspace members
CREATE POLICY "Workspace members view calendar events" ON public.calendar_events
    FOR SELECT TO authenticated USING (public.is_workspace_member(workspace_id));

CREATE POLICY "Members manage calendar events" ON public.calendar_events
    FOR ALL TO authenticated USING (public.is_workspace_member(workspace_id));

-- Submissions and AI evaluations
CREATE POLICY "Workspace members view submissions" ON public.submissions
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.tasks WHERE tasks.id = submissions.task_id AND public.is_workspace_member(tasks.workspace_id)
        )
    );

CREATE POLICY "Users create submissions" ON public.submissions
    FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Workspace members view ai evaluations" ON public.ai_evaluations
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM public.tasks WHERE tasks.id = ai_evaluations.task_id AND public.is_workspace_member(tasks.workspace_id)
        )
    );

-- Notifications: Strictly private to user
CREATE POLICY "Users view own notifications" ON public.notifications
    FOR ALL TO authenticated USING (user_id = auth.uid());
