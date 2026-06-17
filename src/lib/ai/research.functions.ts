import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateMarkdown } from "./shared";

const Schema = z.object({ topic: z.string().min(1) });

export const runResearch = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }) => {
    const system =
      "Summarize the provided topic. Provide key insights and actionable recommendations. Simplify complex information for quick understanding.";
    return generateMarkdown(system, data.topic);
  });