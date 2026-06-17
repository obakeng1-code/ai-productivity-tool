import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { generateEmail } from "@/lib/ai/email.functions";
import { incrementMetric } from "@/lib/analytics";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Workplace AI" },
      { name: "description", content: "Draft tone-perfect emails for any business audience." },
      { property: "og:title", content: "Email Generator — Workplace AI" },
      { property: "og:description", content: "Draft tone-perfect emails for any business audience." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [audience, setAudience] = useState<"Client" | "Manager" | "Team">("Client");
  const [tone, setTone] = useState<"Formal" | "Informal" | "Persuasive">("Formal");
  const [subject, setSubject] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !keyPoints.trim()) {
      toast.error("Subject and key points are required.");
      return;
    }
    setLoading(true);
    try {
      const result = await run({ data: { audience, subject, keyPoints, tone } });
      setOutput(result.markdown);
      incrementMetric("emails");
      toast.success("Email drafted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPage title="Email Generator" description="Generate professional emails tuned to audience and tone.">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as typeof audience)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Team">Team</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Informal">Informal</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Q3 launch update"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="key-points">Key points</Label>
              <Textarea
                id="key-points"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Bullet points or short notes the email should cover."
                className="min-h-[180px]"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <OutputPanel value={output} onChange={setOutput} loading={loading} />
    </ToolPage>
  );
}