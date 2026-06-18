import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TaskItem = z.object({
  taskName: z.string().min(1),
  deadline: z.string().min(1),
  priority: z.enum(["Urgent", "High", "Medium", "Low"]),
});

const Schema = z.object({
  overallGoal: z.string().default(""),
  tasks: z.array(TaskItem).min(1),
});

export const PlanSchema = z.object({
  executionStrategy: z.string(),
  prioritizedTasks: z.array(
    z.object({
      taskName: z.string(),
      suggestedActionDate: z.string(),
      urgencyRationale: z.string(),
      timeConstraintTip: z.string(),
    }),
  ),
});

export type Plan = z.infer<typeof PlanSchema>;

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }): Promise<Plan> => {
    const { generateObject } = await import("ai");
    const { createLovableAiGatewayProvider, CHAT_MODEL } = await import(
      "@/lib/ai-gateway.server"
    );
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");
    const gateway = createLovableAiGatewayProvider(key);

    const system = `You are an expert project manager. Analyze the provided tasks, their specific deadlines, and their priority levels (Urgent, High, Medium, Low). Prioritize the execution logically. You must also provide strategic instructions on how to achieve the overall goal, meet these exact deadlines, and overcome likely constraints.

Return ONLY a JSON object matching the provided schema. Do not include markdown, code fences, or commentary. Keep each string field concise (max 2 sentences, no nested bullets).`;

    const userPrompt = [
      `Overall Goal / Project Description:\n${data.overallGoal || "(not provided)"}`,
      "",
      "Tasks:",
      ...data.tasks.map(
        (t, i) =>
          `${i + 1}. ${t.taskName} — deadline: ${t.deadline}, priority: ${t.priority}`,
      ),
    ].join("\n");

    const { object } = await generateObject({
      model: gateway(CHAT_MODEL),
      schema: PlanSchema,
      system,
      prompt: userPrompt,
    });
    return object;
  });