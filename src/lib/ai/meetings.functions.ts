import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Schema = z.object({ rawNotes: z.string().min(1) });

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Schema.parse(input))
  .handler(async ({ data }) => {
    const { generateMarkdown } = await import("./shared.server");
    const system =
      "Convert these notes into a concise summary. You MUST extract: Key Discussion Points, Decisions Made, Action Items, and clearly highlight Deadlines and Responsibilities.";
    return generateMarkdown(system, data.rawNotes);
  });