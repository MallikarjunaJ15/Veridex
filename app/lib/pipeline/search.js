import { tavily } from "@tavily/core";

const tav = tavily({ apiKey: process.env.TAVILY_API_KEY });
export const searchEvidence = async (claimsArray) => {
  try {
    const searchPromises = claimsArray.map((singleClaimString) => {
      return tav.search(singleClaimString);
    });
    const searchResults = await Promise.all(searchPromises);
    const evidence = searchResults.flatMap((result) =>
      result.results.map((r) => ({
        title: r.title,
        url: r.url,
        content: r.content,
      })),
    );

    return evidence;
  } catch (error) {
    console.error("Tavily Search Pipeline Failed:", error);
    throw new Error("Failed to fetch evidence from the web.");
  }
};
