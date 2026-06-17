import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  audience: z.enum(["Client", "Manager", "Team"]),
  subject: z.string().min(1),
  keyPoints: z.string().min(1),
  tone: z.enum(["Formal", "Informal", "Persuasive"]),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }) => {
    const { generateMarkdown } = await import("./shared.server");
    const system = `Generate a context-based professional email adapting to the audience: ${data.audience}. Tone: ${data.tone}. Ensure proper business language and a strong closing.`;
    const user = `Subject: ${data.subject}\n\nKey points:\n${data.keyPoints}`;
    return generateMarkdown(system, user);
  });