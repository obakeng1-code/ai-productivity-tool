import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function HumanValidationCopy({ text }: { text: string }) {
  const [validated, setValidated] = useState(false);
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="mt-3 flex flex-col gap-3 rounded-lg border bg-muted/40 p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <Checkbox
          id="human-validation"
          checked={validated}
          onCheckedChange={(v) => setValidated(v === true)}
        />
        <Label htmlFor="human-validation" className="text-sm leading-snug">
          I have reviewed this AI output for accuracy and bias.
        </Label>
      </div>
      <Button
        type="button"
        size="sm"
        disabled={!validated || !text}
        onClick={onCopy}
        className="sm:shrink-0"
      >
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
        Copy to Clipboard
      </Button>
    </div>
  );
}