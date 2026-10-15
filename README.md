# FocusForge — Study & Placement Command Center

FocusForge is a shared study, technical interview, and placement preparation platform built for **Jayant** and **Rekha**.

Unlike generic to-do apps, FocusForge functions as a full personal operating system for computer science concepts, daily DSA & SQL target sprints, verifiable focus tracking (strict 10-minute rule), company placement pipelines, structured knowledge vaulting, and AI-powered evaluation.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS with custom design tokens, responsive layout, dark/light themes
- **Icons & Visuals**: Lucide React, Recharts (Productivity analytics & weekly focus trends)
- **Persistence**: Supabase PostgreSQL 15+ with Row Level Security (RLS) & Offline Local Storage Vault fallback
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`) via secure server-side API route (`/api/ai/evaluate`)
- **Focus Verification Engine**: Accurate timestamp-based timer calculating unpaused seconds and enforcing the minimum 600-second rule

---

## 🚀 Key Modules & Architecture

### 1. Dashboard & Dual Accountability
- Individual Target View vs Shared Jayant & Rekha Matrix
- Real-time verified study hours, completion ratios, active study streaks, and AI coach averages
- Weekly Planned vs Actual Study Time bar charts powered by Recharts

### 2. Daily Target Planner
- Categorized by Subject: DSA, OOP, DBMS/SQL, Computer Networks, Operating Systems, Aptitude, HR Prep
- Workflow states: `Planned`, `In Progress`, `Submitted`, `Under Review`, `Completed`, `Needs Revision`, `Overdue`, `Cancelled`
- Subtask verification checklists & carry-forward history preserving original deadlines
- Direct focus timer integration

### 3. Persistent Focus Room & Floating Mini-Timer
- **Minimum 10-Minute Rule**: A task must accumulate at least 600 seconds of valid, unpaused focus time before it can be marked complete.
- **Accurate Timing**: Calculated using wall-clock timestamps and recorded events rather than naive browser intervals.
- **Global Floating Widget**: Stays accessible across all tabs and routes in the application.
- **Practice Stopwatch**: Independent mode for mock viva, speed coding, and aptitude drills.
- **Focus Ambient Audio**: Built-in Web Audio API binaural grounding hum (zero external audio files required).

### 4. Library Bag — Knowledge & Reference Vault
- Searchable and filterable vault for:
  - YouTube tutorial embeds
  - Curated documentation links
  - Markdown notes and code snippets
  - Application confirmation numbers (e.g. `GOOG-INT-2026-98124`)
  - Exam dates and placement announcements

### 5. Calendar & Deadline Manager
- Unified agenda covering Online Assessments (OA), Technical Interviews, Exams, and Project Deadlines.
- Linked directly to placement records.

### 6. Placement Tracker
- Opportunity pipeline: `Interested` ➔ `Applied` ➔ `Assessment Scheduled` ➔ `Interview Scheduled` ➔ `Offer Received` / `Rejected`
- Company details, stipend/salary, role requirements, and preparation checklists with readiness scores.

### 7. Gemini AI Study Coach
- Rigorous server-side technical evaluation of Code (Java, C++, Python), SQL queries, OOP explanations, and interview viva answers.
- Structured feedback:
  - Overall score (0-100)
  - Criterion-level scores
  - What you did right
  - Identified bugs / flaws
  - Missing concepts / optimizations
  - Realistic follow-up interviewer questions (viva simulation)

### 8. Shared Workspace Hub
- Dual account perspectives for Jayant and Rekha.
- Mutual target delegation and accountability tracking.

---

## 📦 Database Schema & Migrations

The relational schema is located at:
[`supabase/migrations/20261015000001_focusforge_initial_schema.sql`](supabase/migrations/20261015000001_focusforge_initial_schema.sql)

### Tables included:
- `profiles` & `user_preferences`
- `workspaces` & `workspace_members`
- `subjects`, `topics`, `topic_mastery_history`
- `tasks`, `task_subtasks`, `task_status_history`, `task_templates`
- `focus_sessions`, `focus_session_events`, `stopwatch_sessions`, `daily_activity_summaries`
- `submissions`, `ai_evaluations`, `revision_schedules`
- `library_entries`, `tags`, `library_entry_tags`
- `placement_opportunities`, `application_events`, `calendar_events`
- `notifications`, `notification_subscriptions`

---

## ⚙️ Setup and Configuration Instructions

### 1. Local Development
```bash
# Clone the repository
git clone https://github.com/your-username/study-tracker.git
cd study-tracker

# Install dependencies
npm install

# Run the Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-google-gemini-api-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Note**: FocusForge automatically activates an offline Local Storage Vault mode with rich seed data if Supabase credentials are not provided, allowing zero-friction testing of all UI, timers, search, and AI evaluation heuristics!

### 3. Run Database Migrations in Supabase
1. Log into your [Supabase Dashboard](https://supabase.com).
2. Create a new project called `focusforge`.
3. Go to the **SQL Editor** tab.
4. Copy the entire contents of [`supabase/migrations/20261015000001_focusforge_initial_schema.sql`](supabase/migrations/20261015000001_focusforge_initial_schema.sql) and click **Run**.
5. Optionally run [`supabase/seed.sql`](supabase/seed.sql) to seed default study subjects.

### 4. Deploying to Vercel
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: FocusForge study command center initial release"
   git push origin main
   ```
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Import your GitHub repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
5. Click **Deploy**.

---

## 🔒 Security & Privacy
- **Row Level Security (RLS)**: Enforced across all tables. Workspace members can access shared tasks and placements; private user records remain strictly isolated.
- **Server-Side AI Proxy**: Gemini API keys are never bundled into the client build. All evaluation runs inside Next.js server route `/api/ai/evaluate`.
- **Zero Clock Drift**: Session timers record ISO timestamps on start/pause/resume to preserve accuracy across sleep, tab closure, and browser restarts.

---

## 📋 Features Implemented vs External Steps Required

### ✅ Implemented Features
- [x] Complete Next.js 15 App Router application with Tailwind CSS design tokens
- [x] Dual-user perspective switching between Jayant and Rekha
- [x] Daily Target Planner with subtask checklist and carry-forward history
- [x] Persistent Focus Timer with strict 10-minute minimum verification
- [x] Global Floating Mini-Timer across all pages
- [x] Practice Stopwatch with reset and lap functionality
- [x] Library Bag knowledge and reference vault (YouTube, links, notes, application reference IDs)
- [x] Unified Calendar & Deadline Manager
- [x] Placement Tracker with stage progression and readiness score
- [x] Gemini AI Study Coach with rubric scoring and viva follow-up simulation
- [x] Productivity Analytics with Recharts (subject distribution & Jayant vs Rekha comparison)
- [x] Shared Workspace delegation and mutual accountability
- [x] Comprehensive PostgreSQL migration file with RLS policies, enums, triggers, and indexes
- [x] Light / Dark mode toggling with smooth transitions

### 📝 Action Required by You
1. Create a Supabase project at [supabase.com](https://supabase.com) and paste the SQL migration from `supabase/migrations/20261015000001_focusforge_initial_schema.sql` into the SQL Editor.
2. Obtain a free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/) and paste it into `.env.local` as `GEMINI_API_KEY`.
3. Connect your GitHub repository to Vercel for one-click production deployment.
