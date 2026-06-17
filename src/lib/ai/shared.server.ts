import { generateText } from "ai";
import {
  CHAT_MODEL,
  FORMATTING_RULES,
  createLovableAiGatewayProvider,
} from "@/lib/ai-gateway.server";

export async function generateMarkdown(systemPrompt: string, userPrompt: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  const { text } = await generateText({
    model: gateway(CHAT_MODEL),
    system: `${systemPrompt}\n\n${FORMATTING_RULES}`,
    prompt: userPrompt,
  });
  return { markdown: text };
}