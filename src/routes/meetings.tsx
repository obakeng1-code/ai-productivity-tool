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
import { summarizeMeeting } from "@/lib/ai/meetings.functions";
import { incrementMetric } from "@/lib/analytics";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      { name: "description", content: "Turn raw meeting notes into decisions, action items, and deadlines." },
      { property: "og:title", content: "Meeting Notes Summarizer — Workplace AI" },
      { property: "og:description", content: "Turn raw meeting notes into decisions, action items, and deadlines." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const run = useServerFn(summarizeMeeting);
  const [rawNotes, setRawNotes] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawNotes.trim()) {
      toast.error("Paste your raw meeting notes first.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { rawNotes } });
      setOutput(result.markdown);
      incrementMetric("meetings");
      toast.success("Summary ready");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPage
      title="Meeting Notes Summarizer"
      description="Extract decisions, action items, deadlines, and responsibilities."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Raw notes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="notes">Paste meeting notes</Label>
              <Textarea
                id="notes"
                value={rawNotes}
                onChange={(e) => setRawNotes(e.target.value)}
                placeholder="Paste your raw meeting transcript or scribbled notes here..."
                className="min-h-[320px]"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Summarizing..." : "Summarize Meeting"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <OutputPanel value={output} onChange={setOutput} loading={loading} />
    </ToolPage>
  );
}