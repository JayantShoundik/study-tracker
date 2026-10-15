-- FocusForge: Development Seed Data
-- Provides demo workspace, default subjects (DSA, OOP, SQL, CN, OS, Aptitude),
-- sample targets for Jayant and Rekha, and seed library entries.

-- Note: In production Supabase, UUIDs will be generated via Supabase Auth.
-- These seed records provide standard default subjects and initial workspace data.

-- Default Subjects
INSERT INTO public.subjects (id, workspace_id, title, code, icon, color, description)
VALUES 
    ('11111111-1111-1111-1111-111111111101', '00000000-0000-0000-0000-000000000001', 'Data Structures & Algorithms', 'DSA', 'code-2', '#4F46E5', 'Arrays, Strings, Linked Lists, Trees, Graphs, DP'),
    ('11111111-1111-1111-1111-111111111102', '00000000-0000-0000-0000-000000000001', 'OOP & Java/C++', 'OOP', 'layers', '#0284C7', 'Abstraction, Encapsulation, Polymorphism, Inheritance'),
    ('11111111-1111-1111-1111-111111111103', '00000000-0000-0000-0000-000000000001', 'DBMS & SQL', 'DBMS', 'database', '#059669', 'Joins, Indexing, Normalization, ACID Properties'),
    ('11111111-1111-1111-1111-111111111104', '00000000-0000-0000-0000-000000000001', 'Computer Networks', 'CN', 'network', '#D97706', 'OSI Layers, TCP/IP, DNS, HTTP/HTTPS, Routing'),
    ('11111111-1111-1111-1111-111111111105', '00000000-0000-0000-0000-000000000001', 'Operating Systems', 'OS', 'cpu', '#7C3AED', 'Process, Threads, Deadlocks, Paging, Scheduling'),
    ('11111111-1111-1111-1111-111111111106', '00000000-0000-0000-0000-000000000001', 'Aptitude & Reasoning', 'APT', 'calculator', '#E11D48', 'Quantitative Aptitude, Logical Reasoning, Verbal Ability'),
    ('11111111-1111-1111-1111-111111111107', '00000000-0000-0000-0000-000000000001', 'Web & System Design', 'WEB', 'globe', '#2563EB', 'Frontend, Backend, REST APIs, System Architecture'),
    ('11111111-1111-1111-1111-111111111108', '00000000-0000-0000-0000-000000000001', 'HR & Interview Prep', 'HR', 'user-check', '#0D9488', 'Behavioral, STAR Method, Company Research')
ON CONFLICT (id) DO NOTHING;
