"use client";
import { useState } from "react";
import { createAnalysis } from "../actions/analysis.actions";
import { InputView } from "@/components/InputView";
import { AnalyzingView } from "@/components/AnalyzingView";

const OVERALL_VC = {
  VERIFIED: {
    color: "#00e676",
    bg: "rgba(0,230,118,0.08)",
    border: "rgba(0,230,118,0.2)",
    label: "Verified",
    headline: "This claim checks out",
    dot: "#00e676",
  },
  FALSE: {
    color: "#ff4444",
    bg: "rgba(255,68,68,0.08)",
    border: "rgba(255,68,68,0.2)",
    label: "False",
    headline: "This claim is false",
    dot: "#ff4444",
  },
  MISLEADING: {
    color: "#ff8c00",
    bg: "rgba(255,140,0,0.08)",
    border: "rgba(255,140,0,0.2)",
    label: "Misleading",
    headline: "This claim is misleading",
    dot: "#ff8c00",
  },
  UNVERIFIABLE: {
    color: "#888888",
    bg: "rgba(136,136,136,0.08)",
    border: "rgba(136,136,136,0.2)",
    label: "Unverifiable",
    headline: "This claim could not be verified",
    dot: "#888888",
  },
};

const CLAIM_VC = {
  TRUE: {
    color: "#00e676",
    bg: "rgba(0,230,118,0.08)",
    border: "rgba(0,230,118,0.18)",
    label: "True",
  },
  FALSE: {
    color: "#ff4444",
    bg: "rgba(255,68,68,0.08)",
    border: "rgba(255,68,68,0.18)",
    label: "False",
  },
  MISLEADING: {
    color: "#ff8c00",
    bg: "rgba(255,140,0,0.08)",
    border: "rgba(255,140,0,0.18)",
    label: "Misleading",
  },
  UNVERIFIABLE: {
    color: "#888888",
    bg: "rgba(136,136,136,0.08)",
    border: "rgba(136,136,136,0.18)",
    label: "Unverifiable",
  },
};

const CONFIDENCE = {
  HIGH: { color: "#00e676", label: "High confidence" },
  MEDIUM: { color: "#ff8c00", label: "Moderate confidence" },
  LOW: { color: "#888888", label: "Low confidence" },
};

const TIER_BADGE = {
  1: {
    label: "Tier 1 Source",
    color: "#00e676",
    bg: "rgba(0,230,118,0.08)",
    border: "rgba(0,230,118,0.2)",
  },
  2: {
    label: "Tier 2 Source",
    color: "#c8ff00",
    bg: "rgba(200,255,0,0.06)",
    border: "rgba(200,255,0,0.15)",
  },
  3: {
    label: "Blog / Social",
    color: "#888888",
    bg: "rgba(136,136,136,0.06)",
    border: "rgba(136,136,136,0.15)",
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export default function AnalyzePage() {
  const [view, setView] = useState("input");
  const [article, setArticle] = useState("");
  const [stepIdx, setStepIdx] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState({});

  const STEPS = [
    {
      id: 1,
      doing: "Identifying important claims...",
      done: "Claims identified",
    },
    { id: 2, doing: "Searching trusted sources...", done: "Sources gathered" },
    {
      id: 3,
      doing: "Comparing evidence per claim...",
      done: "Evidence compared",
    },
    { id: 4, doing: "Generating verdict...", done: "Analysis complete" },
  ];

  const startAnalysis = async () => {
    if (!article || article.trim().length < 10) return;
    setView("analyzing");
    setStepIdx(0);
    setResult(null);
    setError("");
    setOpen({});

    const apiPromise = createAnalysis({ article: article.trim() });

    setStepIdx(1);
    await sleep(2800);
    setStepIdx(2);
    await sleep(2800);
    setStepIdx(3);
    await sleep(2400);
    setStepIdx(4);

    const data = await apiPromise;

    if (data?.error || !data?.analysis) {
      setError(data?.error || "Analysis failed. Please try again.");
      setView("input");
      return;
    }

    setResult(data.analysis);
    setView("result");
  };

  const reset = () => {
    setView("input");
    setArticle("");
    setStepIdx(0);
    setResult(null);
    setError("");
    setOpen({});
  };

  const vc = result
    ? OVERALL_VC[result.overallVerdict] || OVERALL_VC.UNVERIFIABLE
    : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .fs { font-family:'Syne',sans-serif; }
        .fm { font-family:'DM Mono',monospace; }
        * { box-sizing:border-box; }
        @keyframes pdot  { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
        @keyframes fadeUp{ from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimm { 0%,100%{opacity:.5} 50%{opacity:1} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes stepIn{ from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:translateX(0)} }
        .card { animation:fadeUp .45s cubic-bezier(.16,1,.3,1) both; }
        .card:nth-child(2){animation-delay:.07s;opacity:0}
        .card:nth-child(3){animation-delay:.13s;opacity:0}
        .card:nth-child(4){animation-delay:.19s;opacity:0}
        .shimm  { animation:shimm 1.8s ease-in-out infinite; }
        .step-in{ animation:stepIn .35s cubic-bezier(.16,1,.3,1) both; }
        .src-row:hover{ background:rgba(255,255,255,.03)!important; border-color:#242424!important; }
        .src-row{ transition:all .15s; }
        .acc-btn:hover{ background:#141414!important; }
        .acc-btn{ transition:background .15s; }
        textarea::placeholder{ color:#282828; }
      `}</style>

      <div className="fs bg-[#080808] min-h-screen text-[#f0ede8] overflow-x-hidden">
        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-10 py-4 border-b border-white/4 backdrop-blur-xl bg-[#080808]/80">
          <a href="/" className="no-underline text-[#f0ede8]">
            <span className="text-base md:text-[18px] font-extrabold tracking-tight">
              Veri<span className="text-[#c8ff00]">dex</span>
            </span>
          </a>
          <div className="flex items-center gap-3 md:gap-4 ">
            <div className="hidden sm:block font-mono text-[11px] md:text-[12px] text-zinc-400 border border-[#1e1e1e] px-3 py-1.5 rounded-full tracking-widest uppercase">
              RAG · AI · Real-time
            </div>
            <a href="/dashboard">
              <button className="bg-[#c8ff00] text-[#080808] font-bold text-xs md:text-sm px-4 py-2 md:px-5 md:py-2.5 rounded-lg tracking-wide cursor-pointer border-none hover:brightness-110 transition-all">
                Dashboard →
              </button>
            </a>
          </div>
        </nav>

        {/* ══════════ INPUT ══════════ */}
        {view === "input" && (
          <InputView
            article={article}
            setArticle={setArticle}
            startAnalysis={startAnalysis}
          />
        )}

        {/* ══════════ ANALYZING ══════════ */}
        {view === "analyzing" && <AnalyzingView stepIdx={stepIdx} />}

        {/* ══════════ RESULT ══════════ */}
        {view === "result" && result && vc && (
          <div className="max-w-190 mx-auto px-6 pt-12 pb-20 font-sans">
            <div
              className="card bg-[#0c0c0c] rounded-[20px] overflow-hidden mb-3.5"
              style={{ border: `1px solid ${vc.border}` }}
            >
              <div
                className="h-1"
                style={{
                  background: `linear-gradient(90deg,${vc.color},${vc.color}50,transparent)`,
                }}
              />
              <div className="p-8 pb-7">
                <div className="flex items-center justify-between mb-5 flex-wrap gap-2.5">
                  <div
                    className="inline-flex items-center gap-[9px] rounded-full px-4 py-[7px]"
                    style={{
                      background: vc.bg,
                      border: `1px solid ${vc.border}`,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block"
                      style={{
                        background: vc.color,
                        boxShadow: `0 0 8px ${vc.color}`,
                      }}
                    />
                    <span
                      className="fm text-[13px] font-bold tracking-[1.5px] uppercase"
                      style={{ color: vc.color }}
                    >
                      {vc.label}
                    </span>
                  </div>
                  <span className="fm text-[13px] text-[#888]">
                    {result.claims?.length || 0} claim
                    {result.claims?.length !== 1 ? "s" : ""} checked ·{" "}
                    {result.totalSourcesProcessed || 0} sources
                  </span>
                </div>

                <h1 className="text-[clamp(24px,4vw,36px)] font-extrabold tracking-tight leading-tight text-white mb-4">
                  {vc.headline}
                </h1>

                <p className="text-lg text-[#e0e0e0] leading-relaxed mb-6">
                  {result.summary}
                </p>

                <div
                  className="bg-[#161616] border border-[#2a2a2a] rounded-r-[10px] rounded-l-sm px-5 py-4"
                  style={{ borderLeft: `4px solid ${vc.color}60` }}
                >
                  <div className="fm text-xs text-[#888] tracking-[1.5px] uppercase mb-2 font-semibold">
                    Analyzed
                  </div>
                  <p className="text-[15px] text-[#a3a3a3] leading-relaxed italic">
                    &ldquo;{article.slice(0, 200)}
                    {article.length > 200 ? "..." : ""}&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {result.claims?.length > 0 && (
              <div className="card bg-[#0c0c0c] border border-[#1a1a1a] rounded-[20px] overflow-hidden mb-3.5">
                <div className="px-7 pt-6 flex items-center gap-3 border-b border-[#222] pb-5">
                  <div className="w-9 h-9 rounded-[10px] bg-[#c8ff00]/5 border border-[#c8ff00]/10 flex items-center justify-center shrink-0">
                    <svg
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#c8ff00"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 11l3 3L22 4" />
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                    </svg>
                  </div>
                  <div>
                    <div className="fm text-xs text-[#c8ff00] tracking-widest uppercase font-semibold">
                      Claim Breakdown
                    </div>
                    <div className="fm text-[13px] text-[#888] mt-1">
                      Each claim verified independently against live sources
                    </div>
                  </div>
                </div>

                {result.claims.map((claim, ci) => {
                  const cvc = CLAIM_VC[claim.verdict] || CLAIM_VC.UNVERIFIABLE;
                  const conf = CONFIDENCE[claim.confidence] || CONFIDENCE.LOW;
                  const isOpen = !!open[ci];

                  return (
                    <div
                      key={ci}
                      className="border-b border-[#222] last:border-none"
                    >
                      <div className="px-7 py-6">
                        <div className="flex items-start justify-between gap-4 mb-3.5">
                          <div className="flex items-start gap-3 flex-1">
                            <span className="fm text-[13px] text-[#c8ff00] bg-[#c8ff00]/10 border border-[#c8ff00]/20 px-2.5 py-[3px] rounded-md shrink-0 mt-0.5 tracking-wide font-semibold">
                              #{String(ci + 1).padStart(2, "0")}
                            </span>
                            <p className="text-[17px] text-[#f3f4f6] leading-relaxed font-medium">
                              {claim.claimText}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div
                              className="px-3.5 py-1 rounded-full flex items-center gap-1.5"
                              style={{
                                background: cvc.bg,
                                border: `1px solid ${cvc.border}`,
                              }}
                            >
                              <span
                                className="w-2 h-2 rounded-full inline-block"
                                style={{ background: cvc.color }}
                              />
                              <span
                                className="fm text-xs font-bold tracking-wide uppercase"
                                style={{ color: cvc.color }}
                              >
                                {cvc.label}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 mb-3">
                          <span
                            className="fm text-[13px] font-semibold"
                            style={{ color: conf.color }}
                          >
                            {conf.label}
                          </span>
                          {claim.evidence?.length > 0 && (
                            <span className="fm text-[13px] text-[#888]">
                              · {claim.evidence.length} source
                              {claim.evidence.length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>

                        <p className="text-base text-[#cccccc] leading-relaxed">
                          {claim.explanation}
                        </p>

                        {claim.evidence?.length > 0 && (
                          <button
                            className="acc-btn mt-[18px] flex items-center gap-2 bg-[#161616] hover:bg-[#222] border border-[#2a2a2a] rounded-lg px-4 py-2 cursor-pointer text-[#aaa] hover:text-white text-sm font-semibold transition-all duration-200"
                            onClick={() =>
                              setOpen((p) => ({ ...p, [ci]: !p[ci] }))
                            }
                          >
                            <svg
                              width="14"
                              height="14"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              viewBox="0 0 24 24"
                              className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                            {isOpen ? "Hide" : "Show"} sources (
                            {claim.evidence.length})
                          </button>
                        )}
                      </div>

                      {isOpen && claim.evidence?.length > 0 && (
                        <div className="px-7 pb-6 flex flex-col gap-3">
                          {claim.evidence.map((ev, ei) => {
                            const tb = TIER_BADGE[ev.tier] || TIER_BADGE[3];
                            return (
                              <a
                                key={ei}
                                href={ev.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group src-row flex items-start gap-3.5 p-4 bg-[#121212] border border-[#222] hover:border-[#444] rounded-xl no-underline cursor-pointer transition-colors duration-200"
                              >
                                <div className="shrink-0 pt-0.5">
                                  <span
                                    className="fm text-[11px] font-bold px-2 py-[3px] rounded-md tracking-wide uppercase whitespace-nowrap"
                                    style={{
                                      color: tb.color,
                                      background: tb.bg,
                                      border: `1px solid ${tb.border}`,
                                    }}
                                  >
                                    {tb.label}
                                  </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-[15px] font-semibold text-[#e5e5e5] mb-1 truncate">
                                    {ev.title || ev.sourceName}
                                  </div>
                                  <div className="fm text-[13px] text-[#737373] truncate">
                                    {ev.url}
                                  </div>
                                  {ev.content && (
                                    <p className="text-sm text-[#a3a3a3] mt-2 leading-[1.6] line-clamp-2">
                                      {ev.content}
                                    </p>
                                  )}
                                </div>
                                <span className="text-[#666] group-hover:text-[#aaa] transition-colors text-base shrink-0 pt-0.5">
                                  ↗
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div className="card flex items-center gap-4 flex-wrap">
              <button
                onClick={reset}
                className="bg-[#c8ff00] hover:opacity-90 text-[#080808] rounded-[10px] px-7 py-3.5 text-[15px] font-bold cursor-pointer transition-opacity duration-200"
              >
                Analyze another claim
              </button>
              <a
                href="/dashboard"
                className="text-[15px] text-[#aaa] hover:text-white font-semibold transition-colors duration-200 no-underline"
              >
                View history →
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
