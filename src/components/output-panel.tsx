import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HumanValidationCopy } from "./human-validation-copy";

export function OutputPanel({
  value,
  onChange,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
}) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Output</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={loading ? "Generating..." : "Your AI-generated content will appear here. You can edit before copying."}
          className="min-h-[360px] font-mono text-sm"
          disabled={loading}
        />
        <HumanValidationCopy text={value} />
      </CardContent>
    </Card>
  );
}