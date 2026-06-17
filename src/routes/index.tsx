import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  CalendarCheck,
  ListChecks,
  Search,
  MessageSquare,
  Sparkles,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { totalHoursSaved, useMetrics } from "@/lib/analytics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — Productivity Dashboard" },
      {
        name: "description",
        content:
          "Track your AI-powered productivity gains and access tools for email, meetings, tasks, research, and chat.",
      },
      { property: "og:title", content: "Workplace AI — Productivity Dashboard" },
      {
        property: "og:description",
        content: "Your AI-powered command center for workplace productivity.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email" as const,
    title: "Email Generator",
    desc: "Draft tone-perfect emails for clients, managers, and teams.",
    icon: Mail,
  },
  {
    to: "/meetings" as const,
    title: "Meeting Notes",
    desc: "Turn raw notes into decisions, action items, and deadlines.",
    icon: CalendarCheck,
  },
  {
    to: "/tasks" as const,
    title: "Task Planner",
    desc: "Build a prioritized daily plan with time-optimization tips.",
    icon: ListChecks,
  },
  {
    to: "/research" as const,
    title: "Research Assistant",
    desc: "Get crisp summaries, insights, and actionable recommendations.",
    icon: Search,
  },
  {
    to: "/chat" as const,
    title: "AI Chatbot",
    desc: "Open-ended assistant for anything productivity related.",
    icon: MessageSquare,
  },
];

function Dashboard() {
  const metrics = useMetrics();
  const hours = totalHoursSaved(metrics);

  const stats = [
    { label: "Emails Drafted", value: metrics.emails, icon: Mail },
    { label: "Meetings Summarized", value: metrics.meetings, icon: CalendarCheck },
    { label: "Task Plans", value: metrics.tasks, icon: ListChecks },
    { label: "Researches", value: metrics.research, icon: Search },
    { label: "Hours Saved", value: hours.toFixed(2), icon: Clock, accent: true },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-accent/40 p-8 md:p-12 shadow-sm">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-powered workplace suite
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
          Do your best work, <span className="text-primary">faster</span>.
        </h1>
        <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
          Draft emails, summarize meetings, plan your day, and run research with one focused AI
          assistant — designed for real teams.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <a
              href="#features"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/chat">Open AI Chatbot</Link>
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="mt-10">
        <h2 className="text-lg font-semibold tracking-tight">Live productivity analytics</h2>
        <p className="text-sm text-muted-foreground">Updates as you use the tools.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {stats.map((s) => (
            <Card key={s.label} className={s.accent ? "border-primary/40 bg-primary/5" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                  {s.label}
                  <s.icon className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{s.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mt-12 scroll-mt-16">
        <h2 className="text-lg font-semibold tracking-tight">Tools</h2>
        <p className="text-sm text-muted-foreground">Pick a workspace to get started.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold">{f.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{f.desc}</p>
              <div className="mt-4 inline-flex items-center text-sm font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight className="ml-1 h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
