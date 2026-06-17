import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2, Plus, Trash2, Calendar, Sparkles, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ToolPage } from "@/components/tool-page";
import { HumanValidationCopy } from "@/components/human-validation-copy";
import { planTasks, type Plan } from "@/lib/ai/tasks.functions";
import { incrementMetric } from "@/lib/analytics";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner — Workplace AI" },
      { name: "description", content: "Build a prioritized daily plan with time-optimization tips." },
      { property: "og:title", content: "Task Planner — Workplace AI" },
      { property: "og:description", content: "Build a prioritized daily plan with time-optimization tips." },
    ],
  }),
  component: TasksPage,
});

type Priority = "Urgent" | "High" | "Medium" | "Low";
type TaskRow = { id: string; taskName: string; deadline: string; priority: Priority };

const newRow = (): TaskRow => ({
  id: Math.random().toString(36).slice(2),
  taskName: "",
  deadline: "",
  priority: "Medium",
});

function TasksPage() {
  const run = useServerFn(planTasks);
  const [overallGoal, setOverallGoal] = useState("");
  const [tasks, setTasks] = useState<TaskRow[]>([newRow()]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const updateTask = (id: string, patch: Partial<TaskRow>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  const removeTask = (id: string) =>
    setTasks((prev) => (prev.length === 1 ? prev : prev.filter((t) => t.id !== id)));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = tasks.filter((t) => t.taskName.trim() && t.deadline);
    if (valid.length === 0) {
      toast.error("Add at least one task with a name and deadline.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({
        data: {
          overallGoal,
          tasks: valid.map(({ taskName, deadline, priority }) => ({
            taskName,
            deadline,
            priority,
          })),
        },
      });
      setPlan(result);
      incrementMetric("tasks");
      toast.success("Plan generated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = plan
    ? [
        "# Execution Strategy",
        plan.executionStrategy,
        "",
        "# Prioritized Timeline",
        ...plan.prioritizedTasks.map(
          (t, i) =>
            `${i + 1}. ${t.taskName}\n   Action date: ${t.suggestedActionDate}\n   Why: ${t.urgencyRationale}\n   Tip: ${t.timeConstraintTip}`,
        ),
      ].join("\n")
    : "";

  return (
    <ToolPage title="Task Planner" description="Prioritized daily plan with time optimization.">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="goal">Overall Goal / Project Description</Label>
              <Textarea
                id="goal"
                value={overallGoal}
                onChange={(e) => setOverallGoal(e.target.value)}
                placeholder="What are you trying to achieve overall? Give the AI context."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-3">
              <Label>Tasks</Label>
              {tasks.map((t, idx) => (
                <div
                  key={t.id}
                  className="rounded-lg border bg-muted/30 p-3 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      Task {idx + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTask(t.id)}
                      disabled={tasks.length === 1}
                      className="h-7 px-2 text-muted-foreground"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
                    <Input
                      placeholder="Task name"
                      value={t.taskName}
                      onChange={(e) => updateTask(t.id, { taskName: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={t.deadline}
                      onChange={(e) => updateTask(t.id, { deadline: e.target.value })}
                      className="sm:w-[160px]"
                    />
                    <Select
                      value={t.priority}
                      onValueChange={(v) => updateTask(t.id, { priority: v as Priority })}
                    >
                      <SelectTrigger className="sm:w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setTasks((p) => [...p, newRow()])}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Task
              </Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Planning..." : "Generate Strategic Plan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {!plan && !loading && (
          <Card className="h-full">
            <CardContent className="flex h-full min-h-[360px] items-center justify-center text-center text-sm text-muted-foreground">
              Your strategic plan and prioritized timeline will appear here.
            </CardContent>
          </Card>
        )}

        {loading && (
          <Card className="h-full">
            <CardContent className="flex h-full min-h-[360px] items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing tasks...
            </CardContent>
          </Card>
        )}

        {plan && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <Card className="border-primary/40 bg-primary/5">
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <Sparkles className="h-4 w-4 text-primary" />
                <CardTitle className="text-base">The Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {plan.executionStrategy}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">The Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="relative space-y-4 border-l-2 border-border pl-5">
                  {plan.prioritizedTasks.map((t, i) => (
                    <li key={i} className="relative">
                      <span className="absolute -left-[1.65rem] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                        {i + 1}
                      </span>
                      <div className="rounded-lg border bg-card p-3 space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-semibold text-sm">{t.taskName}</h3>
                          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            <Calendar className="h-3 w-3" />
                            {t.suggestedActionDate}
                          </span>
                        </div>
                        <p className="flex gap-2 text-xs text-muted-foreground">
                          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{t.urgencyRationale}</span>
                        </p>
                        <p className="flex gap-2 text-xs text-muted-foreground">
                          <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          <span>{t.timeConstraintTip}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <HumanValidationCopy text={copyText} />
          </div>
        )}
      </div>
    </ToolPage>
  );
}