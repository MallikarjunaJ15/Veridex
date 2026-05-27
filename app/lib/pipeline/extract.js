import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export const extractClaim = async (articleText) => {
  try {
    const { output } = await generateText({
      model: google("gemini-2.5-flash"),
      output: Output.object({
        schema: z.object({
          claims: z
            .array(z.string())
            .describe(
              "Array of 1 to 3 core verifiable claims. If the input is a general question, conversational text, or an opinion with no testable facts, return an empty array [].",
            ),
        }),
      }),
      prompt: `You are an expert fact-checking journalist evaluating user submissions for a misinformation detection platform.
      
Analyze this text:
---
${articleText}
---

Task: Extract 1 to 3 distinct, objective, verifiable factual claims. 
CRITICAL RULE: If the input is a general question (e.g., "What is Gemini?"), a greeting, a command, or pure subjective opinion containing NO factual claims that can be cross-referenced with news or web evidence, you MUST return an empty array [].`,
    });

    return output.claims;
  } catch (error) {
    console.error("Extraction failed:", error);
    throw new Error("Failed to extract claims from the article.");
  }
};
