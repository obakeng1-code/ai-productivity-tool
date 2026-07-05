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
import { cn } from "@/lib/utils";
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

type Tone = "Formal" | "Casual" | "Persuasive" | "Direct" | "Empathetic";
const TONES: Tone[] = ["Formal", "Casual", "Persuasive", "Direct", "Empathetic"];

type Audience =
  | "Client"
  | "Manager"
  | "Team"
  | "Executive / Board"
  | "External Partner / Vendor"
  | "Human Resources"
  | "Direct Report";

const AUDIENCES: { value: Audience; label: string }[] = [
  { value: "Client", label: "Client" },
  { value: "Manager", label: "Manager" },
  { value: "Team", label: "Team" },
  { value: "Executive / Board", label: "Executive / Board" },
  { value: "External Partner / Vendor", label: "External Partner / Vendor" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Direct Report", label: "Direct Report" },
];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [audience, setAudience] = useState<Audience>("Client");
  const [tone, setTone] = useState<Tone>("Formal");
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
    <ToolPage
      title="Email Generator"
      description="Generate professional emails tuned to audience and tone."
      layout="stack"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Control Panel</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[220px_1fr]">
              <div className="space-y-1.5">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={(v) => setAudience(v as Audience)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {AUDIENCES.map((a) => (
                      <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            </div>
            <div className="space-y-2">
              <Label>Tone</Label>
              <div className="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTone(t)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      tone === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="key-points">Key points</Label>
              <Textarea
                id="key-points"
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="Bullet points or short notes the email should cover."
                className="min-h-[140px]"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Generating..." : "Generate Email"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <OutputPanel
        value={output}
        onChange={setOutput}
        loading={loading}
        title="Generated Email"
        emptyHint="Your drafted email will appear here."
        minHeight="min-h-[420px]"
      />
    </ToolPage>
  );
}