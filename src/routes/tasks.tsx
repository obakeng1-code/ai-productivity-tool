import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ToolPage } from "@/components/tool-page";
import { OutputPanel } from "@/components/output-panel";
import { planTasks } from "@/lib/ai/tasks.functions";
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

function TasksPage() {
  const run = useServerFn(planTasks);
  const [taskList, setTaskList] = useState("");
  const [priority, setPriority] = useState<"Urgent" | "Important">("Urgent");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskList.trim()) {
      toast.error("Add at least one task.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { taskList, priority } });
      setOutput(result.markdown);
      incrementMetric("tasks");
      toast.success("Plan generated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPage title="Task Planner" description="Prioritized daily plan with time optimization.">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Priority focus</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Important">Important</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tasks">Task list</Label>
              <Textarea
                id="tasks"
                value={taskList}
                onChange={(e) => setTaskList(e.target.value)}
                placeholder="One task per line. Add notes on urgency/duration if you have them."
                className="min-h-[260px]"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Planning..." : "Plan My Day"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <OutputPanel value={output} onChange={setOutput} loading={loading} />
    </ToolPage>
  );
}