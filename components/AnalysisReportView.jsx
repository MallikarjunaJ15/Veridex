import Link from "next/link";

export default function AnalysisReportView({ data }) {
  const record = Array.isArray(data) ? data[0] : data;

  const articleText = record?.article || "No text provided";
  const claimText = record?.claim || "";
  const aiExplanation = record?.explanation || "No details available.";
  const verdict = record?.verdict || "unverifiable";

  // Retaining your premium visual asset parameters adapted for clean hierarchy
  let badgeText = "Verified True";
  let accentColor = "text-[#c8ff00]";
  let badgeStyle = "bg-[#c8ff00]/10 text-[#c8ff00] border-[#c8ff00]/20";
  let radialGradientClass = "from-[#c8ff00]/5";
  let headline = "This claim is accurate.";
  let textBorder = "border-[#c8ff00]/20";

  if (verdict === "unverifiable") {
    badgeText = "Unverified";
    accentColor = "text-purple-400";
    badgeStyle = "bg-purple-500/10 text-purple-400 border-purple-500/20";
    radialGradientClass = "from-purple-500/5";
    headline = "Not enough evidence to verify.";
    textBorder = "border-purple-500/20";
  } else if (verdict === "fake") {
    badgeText = "False Information";
    accentColor = "text-red-400";
    badgeStyle = "bg-red-500/10 text-red-400 border-red-500/20";
    radialGradientClass = "from-red-500/5";
    headline = "This claim is false or inaccurate.";
    textBorder = "border-red-500/20";
  } else if (verdict === "misleading") {
    badgeText = "Misleading";
    accentColor = "text-amber-400";
    badgeStyle = "bg-amber-500/10 text-amber-400 border-amber-500/20";
    radialGradientClass = "from-amber-500/5";
    headline = "This lacks critical context.";
    textBorder = "border-amber-500/20";
  }

  const rawResources = record?.resources || [];
  const sources = rawResources.map((urlStr) => {
    try {
      const domain = new URL(urlStr).hostname.replace("www.", "");
      return { name: domain, url: urlStr };
    } catch {
      return { name: "View Source", url: urlStr };
    }
  });

  return (
    <div
      className={`min-h-screen bg-[#070709] text-neutral-200 antialiased px-4 py-12 flex justify-center bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] ${radialGradientClass} to-transparent to-40%`}
    >
      <div className="w-full max-w-3xl flex flex-col gap-8">
        {/* Back Link */}
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-white transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>

        {/* Main Status Card */}
        <div className="bg-gradient-to-br from-[#0e0f12] to-[#0a0b0d] border border-white/[0.05] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col gap-3">
            <div>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyle}`}
              >
                {badgeText}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {headline}
            </h1>
          </div>

          {/* User's Original Input */}
          <div
            className={`bg-white/[0.01] border-l-2 ${textBorder} p-4 rounded-r-xl`}
          >
            <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1 font-mono">
              Checked Content
            </span>
            <p className="text-neutral-400 text-sm md:text-base italic leading-relaxed">
              "{articleText}"
            </p>
          </div>

          {/* Core assessment write-up for consumer comprehension */}
          <div className="space-y-3 pt-2">
            <h2 className="text-base font-bold uppercase tracking-wider font-mono text-neutral-300">
              Our Assessment
            </h2>
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed font-normal">
              {aiExplanation}
            </p>
          </div>

          {/* Implicitly showing isolated clean claim string if database populated it differently */}
          {claimText && claimText !== articleText && (
            <div className="text-xs text-neutral-500 pt-4 border-t border-white/[0.05]">
              <span className="font-mono uppercase text-neutral-600 font-bold mr-1">
                Isolated Statement:
              </span>{" "}
              {claimText}
            </div>
          )}
        </div>

        {/* Sources Grid */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-500 font-mono">
            Supporting Sources & References
          </h3>

          {sources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sources.map((src, idx) => (
                <a
                  href={src.url}
                  key={idx}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center justify-between p-4 bg-[#0e0f12] border border-white/[0.04] rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#111317] ${
                    verdict === "unverifiable"
                      ? "hover:border-purple-500/30"
                      : verdict === "fake"
                        ? "hover:border-red-500/30"
                        : verdict === "misleading"
                          ? "hover:border-amber-500/30"
                          : "hover:border-[#c8ff00]/30"
                  }`}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <span className="text-sm font-bold text-neutral-200 truncate group-hover:text-white transition-colors">
                      {src.name}
                    </span>
                    <span className="text-[11px] text-neutral-600 font-mono truncate max-w-[220px] group-hover:text-neutral-500 transition-colors">
                      {src.url}
                    </span>
                  </div>
                  <span
                    className={`text-sm shrink-0 transition-colors ${accentColor}`}
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="bg-[#0e0f12] border border-dashed border-white/[0.05] rounded-xl py-8 px-4 text-center text-xs text-neutral-500">
              No direct citation sources were tracked for this verification
              record.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
