export const evaluateSourceTier = (url) => {
  try {
    const domain = new URL(url).hostname.toLowerCase();
    const tier1Domains = [
      "reuters.com",
      "apnews.com",
      "bbc.com",
      "bbc.co.uk",
      "who.int",
      "cdc.gov",
      "nih.gov",
      "mayoclinic.org",
    ];
    const tier3Domains = [
      "reddit.com",
      "x.com",
      "twitter.com",
      "medium.com",
      "blogspot.com",
      "wordpress.com",
      "facebook.com",
    ];
    if (
      domain.endsWith(".gov") ||
      domain.endsWith(".edu") ||
      domain.endsWith(".int")
    ) {
      return { tier: 1, sourceName: domain.replace("www.", "") };
    }
    if (tier1Domains.some((d) => domain.includes(d))) {
      return { tier: 1, sourceName: domain.replace("www.", "") };
    }
    if (tier3Domains.some((d) => domain.includes(d))) {
      return { tier: 3, sourceName: "Social Media / Blog" };
    }
    return { tier: 2, sourceName: domain.replace("www.", "") };
  } catch (error) {
    return { tier: 3, sourceName: "Unverified Web Source" };
  }
};
