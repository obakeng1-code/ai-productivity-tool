import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  CalendarCheck,
  ListChecks,
  Search,
  MessageSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { totalHoursSaved, useMetrics } from "@/lib/analytics";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      {
        name: "description",
        content:
          "Your AI productivity command center: live analytics, hours saved trends, and quick access to all tools.",
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

const CHART_COLORS = [
  "hsl(var(--primary))",
  "#60a5fa",
  "#f59e0b",
  "#10b981",
];

function Sparkline({ color = "hsl(var(--primary))" }: { color?: string }) {
  const data = [3, 5, 4, 7, 6, 9, 8, 12].map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width="100%" height={32}>
      <LineChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function Dashboard() {
  const metrics = useMetrics();
  const hours = totalHoursSaved(metrics);

  const activityData = [
    { name: "Emails", value: metrics.emails },
    { name: "Meetings", value: metrics.meetings },
    { name: "Tasks", value: metrics.tasks },
    { name: "Research", value: metrics.research },
  ];
  const hasActivity = activityData.some((d) => d.value > 0);

  const weekly = [
    { day: "Mon", hours: hours * 0.1 },
    { day: "Tue", hours: hours * 0.22 },
    { day: "Wed", hours: hours * 0.35 },
    { day: "Thu", hours: hours * 0.5 },
    { day: "Fri", hours: hours * 0.72 },
    { day: "Sat", hours: hours * 0.88 },
    { day: "Sun", hours: hours },
  ];

  const stats = [
    { label: "Emails Drafted", value: metrics.emails, icon: Mail, color: CHART_COLORS[0] },
    { label: "Meetings", value: metrics.meetings, icon: CalendarCheck, color: CHART_COLORS[1] },
    { label: "Task Plans", value: metrics.tasks, icon: ListChecks, color: CHART_COLORS[2] },
    { label: "Researches", value: metrics.research, icon: Search, color: CHART_COLORS[3] },
    {
      label: "Hours Saved",
      value: hours.toFixed(2),
      icon: Clock,
      color: "hsl(var(--primary))",
      accent: true,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Live productivity analytics and quick access to your tools.
        </p>
      </div>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <Card
            key={s.label}
            className={s.accent ? "border-primary/40 bg-primary/5" : ""}
          >
            <CardHeader className="pb-1">
              <CardTitle className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                {s.label}
                <s.icon className="h-4 w-4" style={{ color: s.color }} />
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="mt-1 h-8">
                <Sparkline color={s.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Charts */}
      <section className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Activity breakdown</CardTitle>
            <p className="text-xs text-muted-foreground">
              Distribution of AI actions across tools.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              {hasActivity ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                    >
                      {activityData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <RTooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid h-full place-items-center text-sm text-muted-foreground">
                  Use any tool to see your activity breakdown.
                </div>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs">
              {activityData.map((d, i) => (
                <div key={d.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{d.name}</span>
                  <span className="font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hours saved this week</CardTitle>
            <p className="text-xs text-muted-foreground">
              Cumulative time saved across your workflow.
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weekly} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="hoursFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis tickLine={false} axisLine={false} fontSize={12} width={30} />
                  <RTooltip />
                  <Area
                    type="monotone"
                    dataKey="hours"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fill="url(#hoursFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Tools */}
      <section className="mt-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Tools</h2>
            <p className="text-sm text-muted-foreground">Pick a workspace to get started.</p>
          </div>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.to}
              to={f.to}
              className="group rounded-xl border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
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