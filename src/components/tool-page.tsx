import type { ReactNode } from "react";
import { ResponsibleAIDisclaimer } from "./responsible-ai-disclaimer";

export function ToolPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">{children}</div>
      <ResponsibleAIDisclaimer />
    </div>
  );
}