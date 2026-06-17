import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({
  taskList: z.string().min(1),
  priority: z.enum(["Urgent", "Important"]),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }) => {
    const { generateMarkdown } = await import("./shared.server");
    const system =
      "Generate a structured daily plan. Prioritize tasks based on the provided urgency/importance. You must include time optimization strategies.";
    const user = `Priority focus: ${data.priority}\n\nTasks:\n${data.taskList}`;
    return generateMarkdown(system, user);
  });