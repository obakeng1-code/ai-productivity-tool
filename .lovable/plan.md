# AI Workplace Productivity Assistant — Build Plan

A TanStack Start SaaS with 4 one-shot AI tools (Email, Meeting Notes, Tasks, Research), a streaming Chatbot, and a Dashboard with live localStorage-backed analytics. Powered by Lovable AI Gateway (Gemini-3-flash-preview).

## 1. Setup & Dependencies

- Ensure `LOVABLE_API_KEY` exists (provision via gateway if missing).
- Install: `ai`, `@ai-sdk/openai-compatible`, `@ai-sdk/react`, `zod`, `react-markdown`.
- Verify shadcn primitives present (card, button, input, textarea, select, checkbox, label, sonner). Install any missing via shadcn CLI patterns already in project.

## 2. Design System (`src/styles.css`)

- Tailwind v4 `@theme` tokens: primary `#2563EB`, background `#F8FAFC`, plus semantic foreground/muted/border/card tokens in OKLCH.
- Soft shadows + rounded card defaults. Light mode only (clean SaaS).
- Distinctive type pair (e.g. Space Grotesk display + Inter body) loaded via `<link>` in `__root.tsx` head.

## 3. Layout & Navigation

- `src/components/app-sidebar.tsx`: collapsible shadcn sidebar with icons (Home, Mail, Calendar, ListChecks, Search, MessageSquare), active-link styling via `useRouterState`.
- `src/components/responsible-ai-disclaimer.tsx`: muted footer note shown on every tool page.
- `src/components/human-validation-copy.tsx`: checkbox + Copy-to-Clipboard button; Copy disabled until checked. Reused across all 4 tool pages.
- `src/routes/__root.tsx`: wrap `<Outlet />` in `SidebarProvider` + sidebar + header with `SidebarTrigger`. Load fonts via `<link>`.

## 4. Analytics Utility

- `src/lib/analytics.ts`: localStorage helpers — `incrementMetric(tool)`, `getMetrics()`, `useMetrics()` hook that syncs via `storage` event + custom event so dashboard updates live.
- Keys: `emails`, `meetings`, `tasks`, `research`. Time saved computed: 0.25/0.5/0.1/1.0 hrs.

## 5. AI Backend

Shared helper `src/lib/ai-gateway.server.ts` per Lovable gateway pattern (createOpenAICompatible, run-id capture).

System-prompt suffix constant (token-saving rules) appended to every tool.

**One-shot server functions** (`src/lib/ai/*.functions.ts`) — each uses `createServerFn({ method: 'POST' })` + Zod `inputValidator` + `generateText` with `Output.object`:

- `email.functions.ts` → inputs: audience, subject, keyPoints, tone → returns `{ markdown }`.
- `meetings.functions.ts` → inputs: rawNotes → returns `{ markdown }`.
- `tasks.functions.ts` → inputs: taskList, priority → returns `{ markdown }`.
- `research.functions.ts` → inputs: topic → returns `{ markdown }`.

**Streaming chat** `src/routes/api/chat.ts` → `createFileRoute('/api/chat')` with `server.handlers.POST` using `streamText` + `toUIMessageStreamResponse` + `withLovableAiGatewayRunIdHeader`.

## 6. Routes

All routes use exact TanStack boilerplate `createFileRoute('/path')({ component })`.

- `src/routes/index.tsx` — Dashboard:
  - Hero with title, tagline, primary "Get Started" (smooth scrolls to `#features`), ghost "Open AI Chatbot" (Link to `/chat`).
  - Stats grid `grid-cols-2 md:grid-cols-3 lg:grid-cols-5` — 5 shadcn Cards bound to `useMetrics()`.
  - Feature grid `#features` — 5 Link-wrapped cards (`/email`, `/meetings`, `/tasks`, `/research`, `/chat`) with `hover:-translate-y-1 hover:shadow-md transition`. No "Launch" buttons.

- `src/routes/email.tsx`, `meetings.tsx`, `tasks.tsx`, `research.tsx` — shared 2-column layout (`grid md:grid-cols-2 gap-6`, stacks on mobile):
  - Left: form with shadcn Inputs/Select/Textarea. `onSubmit` calls `e.preventDefault()`, sets `isLoading`, invokes server fn via `useServerFn`. Form state lives in `useState` and is NEVER reset/unmounted during loading (loading shown as button spinner, not form replacement).
  - Right: editable `<Textarea>` bound to output state, plus `<HumanValidationCopy />`.
  - On success: increment matching analytics counter, toast success.
  - Bottom: `<ResponsibleAIDisclaimer />`.

- `src/routes/chat.tsx` — `useChat` with `DefaultChatTransport({ api: '/api/chat' })`. Render `message.parts` via `react-markdown`. Composer with disabled state during `submitted|streaming`. Disclaimer at bottom. (No copy/validation block on chat — applies to tool outputs.)

## 7. Responsible-AI Enforcement

- Disclaimer component required on `/email`, `/meetings`, `/tasks`, `/research`, `/chat`.
- HumanValidation copy block required on the 4 one-shot tool pages above each Copy button.

## 8. Verification

- Build passes; visit each route in preview, run one generation per tool, confirm analytics increment on dashboard, confirm Copy disabled until checkbox ticked, confirm chat streams.

## Technical notes

- Server fns read `process.env.LOVABLE_API_KEY` inside `.handler()` only.
- `Output.object` keeps schemas tiny (single `markdown: z.string()`) to avoid Gemini state-limit issues.
- `useChat` id stable (single conversation, no persistence requested).
- All metric writes guarded by `typeof window !== 'undefined'`; dashboard reads via `useEffect` to avoid hydration mismatch.
