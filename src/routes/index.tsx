import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workplace AI — Do your best work, faster" },
      {
        name: "description",
        content:
          "AI-powered workplace suite for drafting emails, summarizing meetings, planning tasks, and running research.",
      },
      { property: "og:title", content: "Workplace AI — Do your best work, faster" },
      {
        property: "og:description",
        content: "AI-powered workplace suite for emails, meetings, tasks, and research.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="grid min-h-screen w-full place-items-center bg-gradient-to-br from-primary/10 via-background to-accent/30 px-4 py-12">
      <section className="relative w-full max-w-3xl overflow-hidden rounded-2xl border bg-card/90 p-8 text-center shadow-sm md:p-14 backdrop-blur">
        <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> AI-powered workplace suite
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-6xl">
          Do your best work, <span className="text-primary">faster</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
          Draft emails, summarize meetings, plan your day, and run research with one focused AI
          assistant — designed for real teams.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/dashboard">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/chat">
              <MessageSquare className="mr-2 h-4 w-4" /> Open AI Chatbot
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
