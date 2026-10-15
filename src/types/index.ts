export type UserRole = 'owner' | 'admin' | 'member';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 
  | 'planned' 
  | 'in_progress' 
  | 'submitted' 
  | 'under_review' 
  | 'completed' 
  | 'needs_revision' 
  | 'overdue' 
  | 'cancelled';

export type SubmissionType = 
  | 'code' 
  | 'sql' 
  | 'written_answer' 
  | 'explanation' 
  | 'project_link' 
  | 'general_evidence';

export type SessionStatus = 'running' | 'paused' | 'stopped' | 'completed' | 'interrupted';

export type SessionEventType = 'started' | 'paused' | 'resumed' | 'stopped' | 'recovered';

export type MasteryLevel = 'not_started' | 'learning' | 'needs_revision' | 'understood' | 'interview_ready';

export type LibraryEntryType = 
  | 'link' 
  | 'youtube_resource' 
  | 'note' 
  | 'code_snippet' 
  | 'sql_query' 
  | 'important_date' 
  | 'application_record' 
  | 'interview_resource' 
  | 'placement_announcement' 
  | 'personal_reminder';

export type PlacementStage = 
  | 'interested' 
  | 'researching' 
  | 'applied' 
  | 'assessment_scheduled' 
  | 'assessment_completed' 
  | 'interview_scheduled' 
  | 'interview_completed' 
  | 'offer_received' 
  | 'rejected' 
  | 'withdrawn';

export type CalendarEventType = 
  | 'technical_interview' 
  | 'hr_interview' 
  | 'online_assessment' 
  | 'placement_test' 
  | 'application_deadline' 
  | 'form_submission' 
  | 'college_examination' 
  | 'project_deadline' 
  | 'revision_session' 
  | 'personal_reminder';

export interface Profile {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  timezone: string;
  created_at: string;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  created_at: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: UserRole;
  joined_at: string;
  profile?: Profile;
}

export interface UserPreferences {
  user_id: string;
  theme: 'light' | 'dark';
  reminder_interval_minutes: number;
  quiet_hours_start: string;
  quiet_hours_end: string;
  sound_enabled: boolean;
  vibration_enabled: boolean;
  daily_planning_reminder_time: string;
  eod_review_reminder_time: string;
}

export interface Subject {
  id: string;
  workspace_id: string;
  title: string;
  code: string;
  icon: string;
  color: string;
  description: string;
  is_archived: boolean;
  created_at: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  title: string;
  description?: string;
  importance_level: number;
  created_at: string;
  current_mastery?: MasteryLevel;
}

export interface TaskSubtask {
  id: string;
  task_id: string;
  title: string;
  is_completed: boolean;
  position: number;
}

export interface Task {
  id: string;
  workspace_id: string;
  created_by: string;
  assigned_to?: string;
  subject_id?: string;
  topic_id?: string;
  title: string;
  description?: string;
  learning_objectives?: string;
  expected_output?: string;
  submission_type: SubmissionType;
  evaluation_rubric?: {
    criteria?: { name: string; max_score: number; description: string }[];
  };
  priority: TaskPriority;
  status: TaskStatus;
  estimated_minutes: number;
  minimum_focus_seconds: number; // default 600
  due_at?: string;
  completed_at?: string;
  carried_forward_from_date?: string;
  carry_forward_count: number;
  reference_links?: { label: string; url: string }[];
  subtasks?: TaskSubtask[];
  subject?: Subject;
  topic?: Topic;
  creator?: Profile;
  assignee?: Profile;
  created_at: string;
  updated_at: string;
}

export interface TaskStatusHistory {
  id: string;
  task_id: string;
  changed_by: string;
  previous_status?: TaskStatus;
  new_status: TaskStatus;
  reason?: string;
  changed_at: string;
}

export interface FocusSession {
  id: string;
  workspace_id: string;
  user_id: string;
  task_id?: string;
  task?: Task;
  started_at: string;
  ended_at?: string;
  status: SessionStatus;
  accumulated_focus_seconds: number;
  last_resumed_at?: string;
  notes?: string;
}

export interface FocusSessionEvent {
  id: string;
  session_id: string;
  event_type: SessionEventType;
  event_timestamp: string;
  active_seconds_at_event: number;
}

export interface StopwatchSession {
  id: string;
  workspace_id: string;
  user_id: string;
  subject_id?: string;
  task_id?: string;
  title: string;
  duration_seconds: number;
  notes?: string;
  created_at: string;
}

export interface Submission {
  id: string;
  task_id: string;
  user_id: string;
  submission_type: SubmissionType;
  content: string;
  attempt_number: number;
  is_latest: boolean;
  created_at: string;
}

export interface AiEvaluation {
  id: string;
  submission_id: string;
  task_id: string;
  user_id: string;
  model_name: string;
  overall_score: number;
  criterion_scores: Record<string, number>;
  correct_aspects: string[];
  mistakes: string[];
  missing_concepts: string[];
  suggested_improvements: string;
  follow_up_questions: string[];
  recommended_action: string;
  rubric_version: string;
  user_feedback_useful?: boolean;
  created_at: string;
}

export interface RevisionSchedule {
  id: string;
  workspace_id: string;
  user_id: string;
  task_id?: string;
  topic_id?: string;
  source_evaluation_id?: string;
  title: string;
  revision_date: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  workspace_id: string;
  name: string;
  color: string;
}

export interface LibraryEntry {
  id: string;
  workspace_id: string;
  created_by: string;
  creator?: Profile;
  entry_type: LibraryEntryType;
  title: string;
  description?: string;
  url?: string;
  written_content?: string;
  subject_id?: string;
  subject?: Subject;
  event_at?: string;
  remind_at?: string;
  status?: string;
  confirmation_ref?: string;
  is_favourite: boolean;
  is_archived: boolean;
  is_shared: boolean;
  tags?: Tag[];
  created_at: string;
  updated_at: string;
}

export interface PlacementOpportunity {
  id: string;
  workspace_id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  job_description?: string;
  required_skills?: string[];
  application_url?: string;
  date_applied?: string;
  deadline_at?: string;
  assessment_at?: string;
  interview_at?: string;
  stage: PlacementStage;
  salary_or_stipend?: string;
  notes?: string;
  preparation_checklist?: { title: string; completed: boolean }[];
  library_entry_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  workspace_id: string;
  created_by: string;
  creator?: Profile;
  event_type: CalendarEventType;
  title: string;
  description?: string;
  start_at: string;
  end_at?: string;
  timezone: string;
  library_entry_id?: string;
  opportunity_id?: string;
  task_id?: string;
  reminder_minutes_before?: number;
  is_shared: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  workspace_id: string;
  title: string;
  message: string;
  action_url?: string;
  is_read: boolean;
  category: 'reminder' | 'task_assigned' | 'evaluation' | 'deadline';
  created_at: string;
}
