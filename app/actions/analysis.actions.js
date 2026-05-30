"use server";
import analysisModel from "../models/analysis.model";
import connectDb from "../lib/db";
import { extractClaim } from "../lib/pipeline/extract";
import { generateUserFromToken } from "./auth.actions";
import { verifyIndividualClaim } from "../lib/pipeline/verify";

export const createAnalysis = async ({ article }) => {
  try {
    await connectDb();

    const userId = await generateUserFromToken();
    if (!userId) return { error: "Unauthorized" };
    // Step 1: Extract (Returns Array of Strings)
    const claimsArray = await extractClaim(article);
    console.log("claims", claimsArray);
    if (!claimsArray || claimsArray.length == 0) {
      const analysis = await analysisModel.create({
        userId,
        article,
        overallVerdict: "UNVERIFIABLE",
        summary:
          "No verifiable assertions discovered within the submitted payload text structure.",
        claims: [],
        totalSourcesProcessed: 0,
      });
      return {
        success: true,
        analysis: JSON.parse(JSON.stringify(analysis.toObject())),
      };
    }
    // Step 2 & 3: Map each claim to its own isolated search and verification routine in parallel
    const verifiedClaimsPayload = await Promise.all(
      claimsArray.map((claim) => verifyIndividualClaim(claim)),
    );

    // Step 4: Programmatic  Verdict Mapping (Deterministic, Not Hallucinated)
    const verdicts = verifiedClaimsPayload.map((c) => c.verdict);
    let finalVerdict = "VERIFIED";
    let summaryText =
      "All processed claims within this text have been verified against high-authority reference databases.";

    const hasFalse = verdicts.includes("FALSE");
    const hasMisleading = verdicts.includes("MISLEADING");
    const hasTrue = verdicts.includes("TRUE");
    const hasUnverifiable = verdicts.includes("UNVERIFIABLE");

    if (hasFalse && !hasTrue && !hasMisleading) {
      finalVerdict = "FALSE";
      summaryText =
        "The main claims present inside this document are completely debunked by documented facts.";
    } else if (
      hasMisleading ||
      (hasTrue && hasFalse) ||
      (hasFalse && hasUnverifiable)
    ) {
      finalVerdict = "MISLEADING";
      summaryText =
        "This content blends validated facts with unsubstantiated or false narratives. Out-of-context tracking observed.";
    } else if (hasUnverifiable && !hasFalse && !hasMisleading) {
      finalVerdict = "UNVERIFIABLE";
      summaryText =
        "Insufficient credible evidence remains available online to establish an objective factual baseline.";
    }

    const totalSourcesCount = verifiedClaimsPayload.reduce(
      (acc, c) => acc + c.evidence.length,
      0,
    );

    // Step 5: Persist Production-Grade Analysis Record
    const savedAnalysisDoc = await analysisModel.create({
      userId,
      article: article,
      overallVerdict: finalVerdict,
      summary: summaryText,
      claims: verifiedClaimsPayload,
      totalSourcesProcessed: totalSourcesCount,
    });
    return {
      success: true,
      analysis: JSON.parse(JSON.stringify(savedAnalysisDoc.toObject())),
    };
  } catch (error) {
    return { error: error.message || "Internal Server Error" };
  }
};

export const getUserHistory = async () => {
  try {
    const userId = await generateUserFromToken();
    if (!userId) return { message: "User not found" };
    const analysis = await analysisModel
      .find({ userId: userId })
      .sort({ createdAt: -1 })
      .lean();
    return {
      analysis: JSON.parse(JSON.stringify(analysis)),
    };
  } catch (error) {
    console.log("internal server error", error);
    return { error };
  }
};

export const getAnalysisById = async (id) => {
  try {
    await connectDb();
    const analysis = await analysisModel.findById(id).lean();
    if (!analysis) return { analysis: null };
    return { analysis: JSON.parse(JSON.stringify(analysis)) };
  } catch (error) {
    return { analysis: null };
  }
};
