export function InputView({ article, setArticle, startAnalysis }) {
  const isReady = article?.trim().length >= 10;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16 animate-fade-in font-syne">
      <div className="text-center mb-10 w-full max-w-2xl mx-auto">
        <div className="font-mono text-sm tracking-[3px] uppercase mb-4 flex items-center justify-center gap-3 text-[#c8ff00]">
          <span className="w-8 h-px bg-[#c8ff00] opacity-40 inline-block" />
          Fact Verification
          <span className="w-8 h-px bg-[#c8ff00] opacity-40 inline-block" />
        </div>
        <h1 className="font-extrabold tracking-[-2px] mb-3 leading-tight text-[clamp(28px,5vw,44px)] text-[#f0ede8]">
          What do you want to verify?
        </h1>
        <p className="text-base sm:text-[16px] text-[#777] leading-[1.7] max-w-lg mx-auto font-sans">
          Paste a news article, headline, or WhatsApp message. Veridex searches
          trusted sources and verifies every claim individually.
        </p>
      </div>

      <div className="w-full max-w-[740px]">
        <div className="rounded-2xl p-5 bg-[#0f0f0f] border border-[#222] transition-colors duration-300 focus-within:border-zinc-700">
          <div className="font-mono text-sm tracking-[2px] uppercase mb-4 flex items-center gap-2 text-zinc-400">
            <span className="w-[6px] h-[6px] rounded-full bg-[#c8ff00] inline-block animate-pulse" />
            Article or claim to verify
          </div>
          <textarea
            value={article}
            onChange={(e) => setArticle(e.target.value)}
            placeholder="Paste your source text here..."
            rows={8}
            className="w-full bg-transparent border-none outline-none text-[#f0ede8] text-[15px] leading-[1.75] resize-none font-sans placeholder:text-[#282828]"
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mt-4 pt-4 border-t border-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] text-[#444]">
                {article?.length} characters
              </span>
              {article?.length > 0 && !isReady && (
                <span className="font-mono text-[11px] text-orange-400">
                  ⚠ Too short
                </span>
              )}
              {isReady && (
                <span className="font-mono text-[11px] text-[#c8ff00]">
                  ✓ Ready to analyze
                </span>
              )}
            </div>
            <button
              onClick={startAnalysis}
              disabled={!isReady}
              className="font-syne font-bold text-[14px] bg-[#c8ff00] text-[#080808] border-none px-7 py-3.5 rounded-xl cursor-pointer hover:brightness-110 transition-all w-full sm:w-auto text-center disabled:opacity-20 disabled:hover:brightness-100 disabled:cursor-not-allowed"
            >
              Analyze Claim →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 mt-8 rounded-2xl overflow-hidden border border-[#222] bg-[#090909] relative shadow-2xl">
        
          <div className="absolute inset-0 bg-linear-to-b from-white/2 to-transparent pointer-events-none" />

          {[
            {
              label: "Per-claim verification",
              desc: "Granular truth parsing",
              icon: (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#c8ff00"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              ),
              glow: "rgba(200, 255, 0, 0.4)",
            },
            {
              label: "Live web sources",
              desc: "Real-time data fetching",
              icon: (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#00e5ff"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
              glow: "rgba(0, 229, 255, 0.4)",
            },
            {
              label: "Tier-ranked evidence",
              desc: "Weighted source credibility",
              icon: (
                <svg
                  width="20"
                  height="20"
                  fill="none"
                  stroke="#ff3366"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                  />
                </svg>
              ),
              glow: "rgba(255, 51, 102, 0.4)",
            },
          ].map(({ label, desc, icon, glow }, i) => (
            <div
              key={i}
              className={`group relative py-8 px-6 flex flex-col items-center text-center gap-4 transition-colors duration-300 hover:bg-white/2 ${
                i < 2 ? "border-b sm:border-b-0 sm:border-r border-[#222]" : ""
              }`}
            >
              <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#141414] border border-[#2a2a2a] group-hover:scale-110 group-hover:border-[#444] transition-all duration-300 z-10">
                {icon}
                <div
                  className="absolute inset-0 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                  style={{ background: glow }}
                />
              </div>

              <div className="z-10">
                <div className="fm text-[12px] text-[#e0e0e0] font-bold uppercase tracking-widest mb-1.5 transition-colors group-hover:text-white">
                  {label}
                </div>
                <div className="text-[13px] text-[#666] font-medium leading-tight">
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
