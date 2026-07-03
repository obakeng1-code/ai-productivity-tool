import type { ReactNode } from "react";
import { ResponsibleAIDisclaimer } from "./responsible-ai-disclaimer";

export function ToolPage({
  title,
  description,
  children,
  layout = "split",
}: {
  title: string;
  description: string;
  children: ReactNode;
  layout?: "split" | "stack";
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </header>
      <div
        className={
          layout === "split"
            ? "grid gap-6 md:grid-cols-[45fr_55fr] items-start"
            : "flex flex-col gap-6"
        }
      >
        {children}
      </div>
      <ResponsibleAIDisclaimer />
    </div>
  );
}