import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const generateVerdict = async (claimsArray, evidence) => {
  try {
    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({
        schema: z.object({
          verdict: z.enum(["fake", "misleading", "real"]),
          score: z.number().describe("0 to 100. 100 definitely fake."),
          explanation: z
            .string()
            .describe(
              "A concise 2-3 sentence explanation citing the evidence.",
            ),
        }),
      }),
      prompt: `Article claims to fact-check:
      ---
      ${claimsArray.join("\n")}
      ---

      Real evidence found from web search:
      ---
      ${JSON.stringify(evidence, null, 2)} 
      ---

      Based ONLY on the evidence provided above, determine if the claims are real, fake, or misleading.`,
    });

    return output;
  } catch (error) {
    console.error("Verdict generation failed:", error);
    throw new Error("Failed to generate verdict.");
  }
};
