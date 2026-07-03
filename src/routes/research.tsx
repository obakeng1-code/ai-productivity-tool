import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ToolPage } from "@/components/tool-page";
import { OutputPanel } from "@/components/output-panel";
import { runResearch } from "@/lib/ai/research.functions";
import { incrementMetric } from "@/lib/analytics";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research Assistant — Workplace AI" },
      { name: "description", content: "Summaries, insights, and actionable recommendations on any topic." },
      { property: "og:title", content: "Research Assistant — Workplace AI" },
      { property: "og:description", content: "Summaries, insights, and actionable recommendations on any topic." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const run = useServerFn(runResearch);
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Enter a topic or paste raw text.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { topic } });
      setOutput(result.markdown);
      incrementMetric("research");
      toast.success("Research ready");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPage title="Research Assistant" description="Quickly distill topics into insights and recommendations.">
      <Card className="bg-muted/30 border-border/80">
        <CardHeader>
          <CardTitle className="text-base">Input Engine — Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="topic">What should we research?</Label>
              <Textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="A topic, question, or paste source material to summarize."
                className="min-h-[420px] bg-background"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Researching..." : "Run Research"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <OutputPanel
        value={output}
        onChange={setOutput}
        loading={loading}
        title="Live Output Desk"
        emptyHint="Key insights and recommendations will appear here."
      />
    </ToolPage>
  );
}