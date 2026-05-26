import React from "react";
import Link from "next/link";
import { getAnalysisById } from "../../../actions/analysis.actions";

const getVerdictStyles = (verdict = "") => {
  const v = verdict.toLowerCase();
  if (v.includes("true") || v.includes("verified")) {
    return {
      text: "text-emerald-400",
      border: "border-emerald-400/30",
      bg: "bg-emerald-400/5",
      glow: "shadow-[0_0_30px_rgba(52,211,153,0.1)]",
      icon: (
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
  }
  if (v.includes("false") || v.includes("fake")) {
    return {
      text: "text-rose-500",
      border: "border-rose-500/30",
      bg: "bg-rose-500/5",
      glow: "shadow-[0_0_30px_rgba(244,63,94,0.1)]",
      icon: (
        <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
  }
  return {
    text: "text-[#c8ff00]",
    border: "border-[#c8ff00]/30",
    bg: "bg-[#c8ff00]/5",
    glow: "shadow-[0_0_30px_rgba(200,255,0,0.1)]",
    icon: (
      <svg className="w-8 h-8 text-[#c8ff00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    )
  };
};

export default async function AnalysisDetailPage({ params }) {
  const { id } = await params;
  const response = await getAnalysisById(id);
  const analysis = response?.analysis;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-[#f0ede8]">
        <div className="w-16 h-16 rounded-full bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-[#888]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight">Report Not Found</h2>
        <p className="text-[#888] mt-2 text-sm max-w-sm text-center mb-8">The requested analysis report has been moved, deleted, or never existed.</p>
        <Link href="/dashboard" className="bg-white text-black font-bold text-sm px-6 py-3 rounded-lg tracking-wide hover:brightness-90 transition-all">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const vStyles = getVerdictStyles(analysis.verdict);
  const scoreNumber = parseFloat(analysis.score) || 0;

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f0ede8] font-sans selection:bg-[#c8ff00] selection:text-black overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#c8ff00]/5 blur-[120px] pointer-events-none rounded-full"></div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 lg:px-12 lg:py-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#888] hover:text-white transition-colors mb-6 group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span> Return to Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Intelligence Report
            </h1>
            <div className="flex items-center gap-4 mt-4 text-sm font-mono text-[#666]">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                ID: {id.slice(-8).toUpperCase()}
              </span>
              <span>•</span>
              <span>{analysis.createdAt ? new Date(analysis.createdAt).toLocaleString() : "Archived"}</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className={`relative overflow-hidden p-8 md:p-10 rounded-3xl border ${vStyles.border} ${vStyles.bg} backdrop-blur-xl ${vStyles.glow} transition-all`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-3 flex items-center gap-2">
                    {vStyles.icon} AI Final Verdict
                  </h3>
                  <p className={`text-4xl md:text-5xl font-black uppercase tracking-tight ${vStyles.text}`}>
                    {analysis.verdict || "Unverified"}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/[0.04]">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#888] mb-1 text-right">Confidence</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-mono font-bold text-white">
                        {scoreNumber <= 1 ? Math.round(scoreNumber * 100) : Math.round(scoreNumber)}
                      </span>
                      <span className="text-[#888] font-mono text-sm">%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl border border-white/[0.06] bg-[#0c0c0e] hover:border-white/[0.12] transition-colors relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-12 bg-[#c8ff00] rounded-r-full opacity-0 group-hover:opacity-100 transition-all"></div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                Core Claim Analyzed
              </h3>
              <p className="text-xl md:text-2xl text-white font-medium leading-snug">
                "{analysis.claim}"
              </p>
            </div>

            <div className="p-8 rounded-3xl border border-white/[0.06] bg-[#0c0c0e]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-6 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                Engine Reasoning
              </h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-base md:text-lg text-[#b4b0a8] leading-relaxed whitespace-pre-wrap">
                  {analysis.explanation || "No explanation provided by the engine."}
                </p>
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="p-6 md:p-8 rounded-3xl border border-white/[0.06] bg-[#0c0c0e]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-4">Original Input</h3>
              <div className="relative">
                <div className="absolute -left-2 top-0 text-4xl text-white/10 font-serif">"</div>
                <p className="text-sm text-[#888] leading-relaxed italic line-clamp-[8] hover:line-clamp-none transition-all cursor-ns-resize">
                  {analysis.article}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-8 rounded-3xl border border-white/[0.06] bg-[#0c0c0e]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#888] mb-6 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                Verified Sources
              </h3>
              
              {analysis.resources && analysis.resources.length > 0 ? (
                <ul className="space-y-3">
                  {analysis.resources.map((url, i) => {
                    let domain = url;
                    try { domain = new URL(url).hostname.replace('www.', ''); } catch(e){}
                    return (
                      <li key={i}>
                        <a 
                          href={url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.03] hover:border-[#c8ff00]/40 hover:bg-[#c8ff00]/5 transition-all group"
                        >
                          <span className="text-sm font-medium text-[#ccc] group-hover:text-white truncate pr-4">
                            {domain}
                          </span>
                          <svg className="w-4 h-4 text-[#666] group-hover:text-[#c8ff00] flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-[#666] italic">No external sources cited for this analysis.</p>
              )}
            </div>

          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between text-xs text-[#555] font-mono">
          <span>Veridex Secure Engine v2.4.0</span>
          <span className="mt-2 md:mt-0 uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] animate-pulse"></span>
            System Online
          </span>
        </footer>

      </div>
    </div>
  );
}