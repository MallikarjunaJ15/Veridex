import { generateText, Output } from "ai";
import {google} from "@ai-sdk/google"
import { z } from "zod";

export const extractClaim = async (articleText) => {
  try {
    const { output } = await generateText({
      model: google("gemini-1.5-flash"),
      output: Output.object({
        schema: z.object({
          claims: z
            .array(z.string())
            .describe(
              "Array of 1 to 3 core verifiable claims from the article",
            ),
        }),
      }),
      prompt: `You are an expert fact-checking journalist. 
Extract the 1 to 3 most important verifiable factual claims from this article.

Article:
---
${articleText}
---`,
    });

    return output.claims;
  } catch (error) {
    console.error("Extraction failed:", error);
    throw new Error("Failed to extract claims from the article.");
  }
};
