import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";
import { tavily } from "@tavily/core";
import { z } from "zod";
import { evaluateSourceTier } from "./tierEngine";

export const verifyIndividualClaim = async (claimText) => {
  const tav = tavily({ apiKey: process.env.TAVILY_API_KEY });

  const searchResponse = await tav.search(claimText, { maxResults: 5 });

  if (!searchResponse?.results || searchResponse.results.length === 0) {
    return {
      claimText,
      verdict: "UNVERIFIABLE",
      confidence: "LOW",
      explanation:
        "No public record or reliable tracking data found via live engine indexes.",
      evidence: [],
    };
  }

  const processedEvidence = searchResponse.results.map((r) => {
    const { tier, sourceName } = evaluateSourceTier(r.url);
    return {
      title: r.title,
      url: r.url,
      content: r.content,
      tier,
      sourceName,
    };
  });

  const highQualitySources = processedEvidence.filter((e) => e.tier < 3);
  if (highQualitySources.length === 0) {
    return {
      claimText,
      verdict: "UNVERIFIABLE",
      confidence: "LOW",
      explanation:
        "This statement is only discussed across unverified forums or low-authority blogs, making an objective confirmation impossible.",
      evidence: processedEvidence,
    };
  }

  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    output: Output.object({
      schema: z.object({
        verdict: z.enum(["TRUE", "FALSE", "MISLEADING"]),
        confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
        explanation: z
          .string()
          .describe("A concise breakdown citing specific sources."),
      }),
    }),
    prompt: `Evaluate the validity of the following Target Claim against our curated live web research data.

Target Claim: "${claimText}"

Retrieved Live Context:
${JSON.stringify(processedEvidence, null, 2)}

Strict Rules:
- Tier 1 sources (Government, Elite News Agencies) heavily override Tier 2 and Tier 3 sources.
- If Tier 1 sources contradict Tier 3 sources, classify the claim based purely on the Tier 1 consensus.
- If the context presents highly ambiguous data across reputable platforms, assign a verdict of MISLEADING with MEDIUM or LOW confidence.`,
  });

  return {
    claimText,
    ...output,
    evidence: processedEvidence,
  };
};
