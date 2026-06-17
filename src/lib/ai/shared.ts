import { generateText, Output } from "ai";
import { z } from "zod";
import {
  CHAT_MODEL,
  FORMATTING_RULES,
  createLovableAiGatewayProvider,
} from "@/lib/ai-gateway.server";

export async function generateMarkdown(systemPrompt: string, userPrompt: string) {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  const gateway = createLovableAiGatewayProvider(key);
  const { experimental_output } = await generateText({
    model: gateway(CHAT_MODEL),
    system: `${systemPrompt}\n\n${FORMATTING_RULES}`,
    prompt: userPrompt,
    experimental_output: Output.object({
      schema: z.object({ markdown: z.string() }),
    }),
  });
  return experimental_output as { markdown: string };
}