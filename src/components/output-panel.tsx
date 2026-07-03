import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { HumanValidationCopy } from "./human-validation-copy";

export function OutputPanel({
  value,
  onChange,
  loading,
  title = "Output",
  emptyHint = "Your AI-generated content will appear here. You can edit before copying.",
  minHeight = "min-h-[420px]",
}: {
  value: string;
  onChange: (v: string) => void;
  loading: boolean;
  title?: string;
  emptyHint?: string;
  minHeight?: string;
}) {
  const isEmpty = !value && !loading;
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="relative flex-1">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={loading ? "Generating..." : emptyHint}
            className={`${minHeight} h-full w-full resize-y text-base leading-relaxed`}
            disabled={loading}
          />
          {isEmpty && (
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <div className="rounded-full border border-dashed p-4">
                <Sparkles className="h-6 w-6 opacity-60" />
              </div>
              <p className="max-w-xs text-center text-xs">{emptyHint}</p>
            </div>
          )}
          {loading && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </div>
          )}
        </div>
        <HumanValidationCopy text={value} />
      </CardContent>
    </Card>
  );
}