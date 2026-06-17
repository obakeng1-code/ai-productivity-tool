import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ResponsibleAIDisclaimer } from "@/components/responsible-ai-disclaimer";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workplace AI" },
      { name: "description", content: "Open-ended AI assistant for productivity questions." },
      { property: "og:title", content: "AI Chatbot — Workplace AI" },
      { property: "og:description", content: "Open-ended AI assistant for productivity questions." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (err) => console.error(err),
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    sendMessage({ text });
    setInput("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-3rem)] w-full max-w-4xl flex-col px-4 py-6">
      <header className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">AI Chatbot</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask anything — drafting, brainstorming, summarizing, or planning.
        </p>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto rounded-xl border bg-card p-4 shadow-sm"
      >
        {messages.length === 0 && (
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            Start the conversation below.
          </div>
        )}
        {messages.map((m) => {
          const text = m.parts
            .map((p) => (p.type === "text" ? p.text : ""))
            .join("");
          const isUser = m.role === "user";
          return (
            <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{text}</p>
                ) : (
                  <div className="prose prose-sm max-w-none prose-p:my-1 prose-headings:mt-2 prose-headings:mb-1">
                    <ReactMarkdown>{text || "..."}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Thinking...
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="mt-3 flex gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e as unknown as React.FormEvent);
            }
          }}
          placeholder="Send a message... (Shift+Enter for newline)"
          className="min-h-[56px] resize-none"
          disabled={busy}
        />
        <Button type="submit" disabled={busy || !input.trim()} size="lg">
          <Send className="h-4 w-4" />
        </Button>
      </form>

      <ResponsibleAIDisclaimer />
    </div>
  );
}