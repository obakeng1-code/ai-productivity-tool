AI Workplace Productivity Assistant
A modern, multi-page web application engineered to streamline everyday corporate workflows, automate productivity tracking, and deliver specialized generative AI assistance. Built with React and TypeScript, this platform utilizes a clean, data-driven interface to divide landing presentation layers from interactive operational spaces.

🚀 Key Features
1. Unified Analytics Dashboard
Dynamic Visualization Grid: Replaced static tracking boxes with rich data graphics using modern charting engines (Recharts / Chart.js).

Live Activity Distribution: A clean donut/bar visualization that aggregates real-time metrics, tracking items like Emails Drafted, Meetings Summarized, Task Plans created, and Researches Completed.

Impact Tracking: An interactive area/line graph mapping cumulative Hours Saved across an adjustable weekly timeline.

Micro-metrics: Compact KPI summary cards fitted with integrated sparklines for instant trend momentum at a glance.

2. High-Context Email Generator
Optimized Split-Screen: Structured with an upper control grid for quick prompt entry and a full-width lower panel dedicated exclusively to deep-dive reading and iterative email editing.

Granular Audience Selectors: Fine-tune model output using explicit corporate hierarchy constraints:

Executive / Board (High-stakes executive formatting)

Manager & Team (Internal structural alignment)

Direct Report (Constructive delegation and feedback)

Client & External Partner / Vendor (B2B collaboration parameters)

Human Resources (Administrative and policy compliance tone)

Dedicated Tone Badges: Clickable utility badges for instant stylistic pivoting, including Formal, Casual, Persuasive, Direct, and Empathetic.

3. Split-Screen "Machine" Engine Tools
The layout utilizes an intuitive Input-to-Output split grid (45% Left / 55% Right) on desktop displays to emulate an information processing pipeline:

Meeting Notes Summarizer: Raw multi-speaker transcripts or fast shorthand are inputted on the left; clean executive decisions, explicit action items, deadlines, and responsibilities are populated directly on the right.

Task Planner: Drop overarching project contexts, goals, and dynamic task line-items on the left to instantly generate optimized tactical timelines and prioritized strategic plans on the right.

Research Assistant: Supply technical topics or documentation guidelines on the left to stream crisp, structured summaries and actionable advisory frameworks into the right desk panel.

Review Assurance: Each output card comes equipped with standard compliance workflows ("I have reviewed this AI output for accuracy and bias") combined with one-click clipboard extraction mechanics.

🛠️ Tech Stack
Frontend Framework: React 18+ with TypeScript

Styling & Icons: Tailwind CSS / Lucide React Icons

Routing Engine: React Router DOM (Splitting the / landing page from the /dashboard core operational portal)

Data Visualization: Recharts or Chart.js
📁 Project Architecture
  src/
├── components/
│   ├── dashboard/
│   │   ├── AnalyticsGrid.tsx      # Donut & Line charts for workspace analytics
│   │   └── MetricCard.tsx         # Individual performance indicator cards
│   ├── tools/
│   │   ├── EmailGenerator.tsx     # Top/Bottom control input & email display view
│   │   ├── MeetingSummarizer.tsx  # Side-by-side note processing view
│   │   ├── TaskPlanner.tsx        # Left/Right strategic scheduling layout
│   │   └── ResearchAssistant.tsx  # Interactive research document panel
│   └── ui/                        # Reusable buttons, select dropdowns, and badges
├── layouts/
│   └── DashboardLayout.tsx        # Persistent sidebar navigation framework
├── pages/
│   ├── LandingPage.tsx            # Cover hero section view ('/')
│   └── DashboardOverview.tsx      # Main platform analytics desk ('/dashboard')
├── App.tsx                        # React Router application entry point
└── main.tsx
├── App.tsx                        # React Router application entry point
└── main.tsx
