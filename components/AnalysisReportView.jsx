"use client";
import React, { useState } from "react";
import Link from "next/link";

const CLAIM_VC = {
  true: {
    label: "True",
    bg: "rgba(0, 230, 118, 0.1)",
    border: "rgba(0, 230, 118, 0.2)",
    color: "#00e676",
  },
  false: {
    label: "False",
    bg: "rgba(239, 68, 68, 0.1)",
    border: "rgba(239, 68, 68, 0.2)",
    color: "#ef4444",
  },
  misleading: {
    label: "Misleading",
    bg: "rgba(245, 158, 11, 0.1)",
    border: "rgba(245, 158, 11, 0.2)",
    color: "#f59e0b",
  },
  unverifiable: {
    label: "Unverified",
    bg: "rgba(161, 161, 170, 0.1)",
    border: "rgba(161, 161, 170, 0.2)",
    color: "#a1a1aa",
  },
};

const CONFIDENCE = {
  high: { label: "High Confidence", color: "#10b981" },
  medium: { label: "Medium Confidence", color: "#f59e0b" },
  low: { label: "Low Confidence", color: "#ef4444" },
};

const TIER_BADGE = {
  1: {
    label: "Primary",
    bg: "rgba(59, 130, 246, 0.1)",
    border: "rgba(59, 130, 246, 0.2)",
    color: "#3b82f6",
  },
  2: {
    label: "Secondary",
    bg: "rgba(168, 85, 247, 0.1)",
    border: "rgba(168, 85, 247, 0.2)",
    color: "#a855f7",
  },
  3: {
    label: "Tertiary",
    bg: "rgba(161, 161, 170, 0.1)",
    border: "rgba(161, 161, 170, 0.2)",
    color: "#a1a1aa",
  },
};

export default function AnalysisReportView({ data }) {
  const [open, setOpen] = useState({});

  const record = Array.isArray(data) ? data[0] : data;

  const articleText = record?.article || "No text provided.";
  const summaryText = record?.summary || "No summary available.";
  const verdict = record?.overallVerdict?.toLowerCase() || "unverifiable";
  const claims = record?.claims || [];
  const totalSources = record?.totalSourcesProcessed || 0;

  const dateChecked = record?.createdAt
    ? new Date(record.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Unknown date";

  const themeConfig = {
    true: {
      badgeText: "Verified True",
      badgeStyle: "bg-[#00e676]/10 text-[#00e676] border-[#00e676]/20",
      headline: "This content is accurate.",
    },
    false: {
      badgeText: "False Information",
      badgeStyle: "bg-red-500/10 text-red-500 border-red-500/20",
      headline: "This content is false or heavily inaccurate.",
    },
    misleading: {
      badgeText: "Misleading Context",
      badgeStyle: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      headline: "This content lacks critical context.",
    },
    unverifiable: {
      badgeText: "Unverified",
      badgeStyle: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      headline: "Not enough evidence to verify.",
    },
  };

  const activeTheme = themeConfig[verdict] || themeConfig.unverifiable;

  return (
    <div className="min-h-screen bg-[#070709] text-[#f0ede8] antialiased p-4 md:p-8 lg:p-12">
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1c1c1c] pb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors w-fit"
          >
            ← Back to Dashboard
          </Link>
          <div className="text-xs text-zinc-400 font-mono flex items-center gap-3">
            <span>{dateChecked}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>{totalSources} Sources Processed</span>
          </div>
        </div>

        {/* Section 1: The Bottom Line (Verdict & Summary) */}
        <div className="bg-[#121212] border border-[#1c1c1c] rounded-2xl p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${activeTheme.badgeStyle}`}
            >
              {activeTheme.badgeText}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            {activeTheme.headline}
          </h1>

          <div className="pt-6 border-t border-[#1c1c1c]">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold mb-3">
              What we found
            </h2>
            <p className="text-zinc-300 text-base leading-relaxed">
              {summaryText}
            </p>
          </div>
        </div>

        {/* Section 2: What the user actually searched */}
        <div className="space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold pl-1">
            Original Claim
          </h2>
          <div className="bg-[#0d0d0d] border border-[#1e1e1e] rounded-2xl p-6">
            <p className="text-zinc-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
              {articleText}
            </p>
          </div>
        </div>

        {/* Section 3: The Detailed Claims Breakdown (Injected UI) */}
        {claims?.length > 0 && (
          <div className="card bg-[#0c0c0c] border border-[#1a1a1a] rounded-[20px] overflow-hidden mb-3.5">
            <div className="px-5 md:px-7 pt-6 flex items-center gap-3 border-b border-[#222] pb-5">
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
                <div className="fm text-[13px] text-zinc-400 mt-1">
                  Each claim verified independently against live sources
                </div>
              </div>
            </div>

            {claims.map((claim, ci) => {
              const claimText = claim.claimText || claim.claim || claim.text;
              const explanationText = claim.explanation || claim.analysis;
              const evidenceList = claim.evidence || claim.sources || [];

              const vKey = claim.verdict?.toLowerCase() || "unverifiable";
              const cKey = claim.confidence?.toLowerCase() || "low";

              const cvc = CLAIM_VC[vKey] || CLAIM_VC.unverifiable;
              const conf = CONFIDENCE[cKey] || CONFIDENCE.low;
              const isOpen = !!open[ci];

              return (
                <div
                  key={ci}
                  className="border-b border-[#222] last:border-none"
                >
                  <div className="px-5 md:px-7 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3.5">
                      <div className="flex items-start gap-3 flex-1">
                        <span className="fm text-[13px] text-[#c8ff00] bg-[#c8ff00]/10 border border-[#c8ff00]/20 px-2.5 py-[3px] rounded-md shrink-0 mt-0.5 tracking-wide font-semibold">
                          #{String(ci + 1).padStart(2, "0")}
                        </span>
                        <p className="text-[16px] md:text-[17px] text-[#f3f4f6] leading-relaxed font-medium">
                          {claimText}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
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
                      {evidenceList.length > 0 && (
                        <span className="fm text-[13px] text-zinc-400">
                          · {evidenceList.length} source
                          {evidenceList.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <p className="text-base text-zinc-400 leading-relaxed">
                      {explanationText}
                    </p>

                    {evidenceList.length > 0 && (
                      <button
                        className="acc-btn mt-[18px] flex items-center gap-2 bg-[#161616] hover:bg-[#222] border border-[#2a2a2a] rounded-lg px-4 py-2 cursor-pointer text-zinc-400 hover:text-white text-sm font-semibold transition-all duration-200"
                        onClick={() => setOpen((p) => ({ ...p, [ci]: !p[ci] }))}
                      >
                        <svg
                          width="14"
                          height="14"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          className={`transition-transform duration-200 ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                        {isOpen ? "Hide" : "Show"} sources (
                        {evidenceList.length})
                      </button>
                    )}
                  </div>

                  {isOpen && evidenceList.length > 0 && (
                    <div className="px-5 md:px-7 pb-6 flex flex-col gap-3">
                      {evidenceList.map((ev, ei) => {
                        const isString = typeof ev === "string";
                        const url = isString ? ev : ev.url;
                        const title = isString
                          ? url
                          : ev.title || ev.sourceName || url;
                        const content = isString ? null : ev.content;
                        const tier = isString ? 3 : ev.tier || 3;

                        const tb = TIER_BADGE[tier] || TIER_BADGE[3];

                        return (
                          <a
                            key={ei}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group src-row flex flex-col sm:flex-row sm:items-start gap-3.5 p-4 bg-[#121212] border border-[#222] hover:border-[#444] rounded-xl no-underline cursor-pointer transition-colors duration-200"
                          >
                            <div className="shrink-0 sm:pt-0.5">
                              <span
                                className="fm text-[11px] font-bold px-2 py-[3px] rounded-md tracking-wide uppercase whitespace-nowrap inline-block"
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
                              <div className="text-[15px] font-semibold text-zinc-300 mb-1 truncate">
                                {title}
                              </div>
                              <div className="fm text-[13px] text-zinc-400 truncate">
                                {url}
                              </div>
                              {content && (
                                <p className="text-sm text-zinc-400 mt-2 leading-[1.6] line-clamp-2">
                                  {content}
                                </p>
                              )}
                            </div>
                            <span className="hidden sm:block text-zinc-500 group-hover:text-zinc-300 transition-colors text-base shrink-0 pt-0.5">
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
      </div>
    </div>
  );
}
