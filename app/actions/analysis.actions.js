"use server";
import { cookies } from "next/headers";
import analysisModel from "../models/analysis.model";
import { jwtVerify } from "jose";
import connectDb from "../lib/db";
import { extractClaim } from "../lib/pipeline/extract";
import { searchEvidence } from "../lib/pipeline/search";
import { generateVerdict } from "../lib/pipeline/verdict";

export const getUserFromToken = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload.userId;
};
export const createAnalysis = async ({ article }) => {
  try {
    await connectDb();
    const userId = await getUserFromToken();

    if (!userId) return { error: "Unauthorized" };

    // Step 1: Extract (Returns Array of Strings)
    const claimsArray = await extractClaim(article);
    // Step 2: Search (Returns Array of Objects)
    const evidenceResults = await searchEvidence(claimsArray);
    // Step 3: Analyze (Returns { verdict, score, explanation })
    const analyse = await generateVerdict(claimsArray, evidenceResults);

    const verifiedUrls = evidenceResults.map((item) => item.url);
    const analysis = await analysisModel.create({
      userId,
      article,
      claim: claimsArray.join(" | "),
      verdict: analyse.verdict,
      score: analyse.score,
      explanation: analyse.explanation,
      resources: verifiedUrls,
    });
    return {
      success: true,
      analysis: JSON.parse(JSON.stringify(analysis.toObject())),
    };
  } catch (error) {
    return { error: "Internal Server Error" };
  }
};
