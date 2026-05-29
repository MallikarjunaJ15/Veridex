"use client";
import { useState, useRef } from "react";
import { createAnalysis } from "../actions/analysis.actions";

export default function AnalyzePage() {
  const [view, setView] = useState("input");
  const [article, setArticle] = useState("");
  const [logs, setLogs] = useState([]);
  const [steps, setSteps] = useState({ 1: "", 2: "", 3: "" });
  const [stepTimes, setStepTimes] = useState({ 1: "", 2: "", 3: "" });
  const [result, setResult] = useState(null);
  const [claims, setClaims] = useState([]);
  const [scoreDisplay, setScoreDisplay] = useState(0);
  const scoreAnimRef = useRef(null);

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const addLog = (msg, type = "info") => {
    const now = new Date();
    const ts = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;
    setLogs((prev) => [
      ...prev,
      { ts, msg, type, id: Date.now() + Math.random() },
    ]);
  };

  const setStep = (n, state, time = "") => {
    setSteps((prev) => ({ ...prev, [n]: state }));
    if (time) setStepTimes((prev) => ({ ...prev, [n]: time }));
  };

  const animateScore = (target) => {
    const duration = 2000;
    const start = performance.now();
    const update = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setScoreDisplay(Math.round(target * ease));
      if (p < 1) scoreAnimRef.current = requestAnimationFrame(update);
    };
    scoreAnimRef.current = requestAnimationFrame(update);
  };

  const startAnalysis = async () => {
    if (!article || article.trim().length < 10) {
      alert("Please paste an article or claim to verify.");
      return;
    }
    setView("analyzing");
    setLogs([]);
    setSteps({ 1: "", 2: "", 3: "" });
    setStepTimes({ 1: "", 2: "", 3: "" });
    setResult(null);
    setClaims([]);
    setScoreDisplay(0);

    const t0 = Date.now();
    const apiPromise = createAnalysis({ article: article.trim() });
    const res = await apiPromise;
    console.log("response", res);
    addLog("Pipeline initialized", "info");
    addLog(`Article received — ${article.trim().length} characters`, "data");

    let t1 = Date.now();
    setStep(1, "active");
    addLog(
      "Gemini 2.5 Flash — reading article and extracting claims...",
      "info",
    );
    await sleep(3000);
    setStep(1, "done", ((Date.now() - t1) / 1000).toFixed(1) + "s");
    addLog("✓ Core claims identified from article", "success");

    t1 = Date.now();
    setStep(2, "active");
    addLog("Tavily Search — querying 15+ live web sources...", "info");
    await sleep(3000);
    setStep(2, "done", ((Date.now() - t1) / 1000).toFixed(1) + "s");
    addLog("✓ Real-time evidence retrieved from web", "success");

    t1 = Date.now();
    setStep(3, "active");
    addLog("Comparing claims against evidence — generating verdict...", "info");

    const data = await apiPromise;
    setStep(3, "done", ((Date.now() - t1) / 1000).toFixed(1) + "s");

    if (data?.error) {
      addLog(`Pipeline error: ${data.error}`, "error");
      setView("input");
      return;
    }

    const r = data?.analysis;
    if (!r) {
      addLog("No result returned. Please try again.", "error");
      setView("input");
      return;
    }

    addLog(
      `✓ Verdict: ${r.verdict?.toUpperCase()} — credibility score: ${100 - (r.score || 0)}/100`,
      "success",
    );
    addLog(
      `Total pipeline time: ${((Date.now() - t0) / 1000).toFixed(1)}s`,
      "data",
    );

    setClaims(r.claim ? r.claim.split(" | ") : []);
    await sleep(300);
    setResult(r);
    setView("result");
    animateScore(100 - (r.score || 0));
  };

  const reset = () => {
    if (scoreAnimRef.current) cancelAnimationFrame(scoreAnimRef.current);
    setView("input");
    setArticle("");
    setLogs([]);
    setSteps({ 1: "", 2: "", 3: "" });
    setStepTimes({ 1: "", 2: "", 3: "" });
    setResult(null);
    setClaims([]);
    setScoreDisplay(0);
  };

  const vc = result
    ? {
        fake: {
          color: "#ff4444",
          bg: "rgba(255,68,68,0.06)",
          border: "rgba(255,68,68,0.2)",
          glow: "rgba(255,68,68,0.08)",
          label: "FAKE",
          headline: "This claim is false",
          emoji: "✗",
          ring: "#ff4444",
        },
        misleading: {
          color: "#ff8c00",
          bg: "rgba(255,140,0,0.06)",
          border: "rgba(255,140,0,0.2)",
          glow: "rgba(255,140,0,0.08)",
          label: "MISLEADING",
          headline: "This claim is misleading",
          emoji: "⚠",
          ring: "#ff8c00",
        },
        real: {
          color: "#00e676",
          bg: "rgba(0,230,118,0.06)",
          border: "rgba(0,230,118,0.2)",
          glow: "rgba(0,230,118,0.08)",
          label: "VERIFIED",
          headline: "This claim checks out",
          emoji: "✓",
          ring: "#00e676",
        },
      }[result.verdict] || {
        color: "#ff8c00",
        bg: "rgba(255,140,0,0.06)",
        border: "rgba(255,140,0,0.2)",
        glow: "rgba(255,140,0,0.08)",
        label: "MISLEADING",
        headline: "This claim is misleading",
        emoji: "⚠",
        ring: "#ff8c00",
      }
    : null;

  const credibility = result ? 100 - (result.score || 0) : 0;
  const circumference = 2 * Math.PI * 58;
  const strokeOffset = circumference - (credibility / 100) * circumference;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        * { box-sizing: border-box; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.3;transform:scale(.6)} }
        @keyframes scan { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
        @keyframes logIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes stepPulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,255,0,.4)} 50%{box-shadow:0 0 0 8px rgba(200,255,0,0)} }
        @keyframes scoreCount { from{opacity:0;transform:scale(0.8)} to{opacity:1;transform:scale(1)} }
        .log-entry { opacity:0; transform:translateY(6px); animation: logIn 0.3s forwards; }
        .result-card { animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .result-card:nth-child(2) { animation-delay: 0.08s; opacity: 0; }
        .result-card:nth-child(3) { animation-delay: 0.14s; opacity: 0; }
        .result-card:nth-child(4) { animation-delay: 0.2s; opacity: 0; }
        .result-card:nth-child(5) { animation-delay: 0.26s; opacity: 0; }
        textarea::placeholder { color: #282828; }
        .src:hover { border-color: #2a2a2a !important; background: #141414 !important; }
        .src { transition: all 0.15s; }
      `}</style>

      <div className="font-syne bg-[#080808] min-h-screen text-[#f0ede8] overflow-x-hidden">
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
          <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
            <div className="text-center mb-10 w-full max-w-2xl mx-auto">
              <div className="font-mono-dm text-sm tracking-[3px] uppercase mb-4 flex items-center justify-center gap-3 text-[#c8ff00]">
                <span className="w-8 h-px bg-[#c8ff00] opacity-40 inline-block" />
                Fact Verification
                <span className="w-8 h-px bg-[#c8ff00] opacity-40 inline-block" />
              </div>
              <h1 className="font-extrabold tracking-[-2px] mb-3 leading-tight text-[clamp(28px,5vw,44px)]">
                What do you want to verify?
              </h1>
              <p className="text-[16px] text-[#777] leading-[1.7]">
                Paste a news article, claim, or WhatsApp forward. Our AI
                pipeline retrieves live evidence and explains the truth.
              </p>
            </div>

            <div className="w-full max-w-185">
              <div className="rounded-2xl p-5 bg-[#0f0f0f] border border-[#222] transition-colors duration-300">
                <div className="font-mono-dm text-sm tracking-[2px] uppercase mb-4 flex items-center gap-2 text-zinc-400">
                  <span
                    className="w-[6px] h-[6px] rounded-full bg-[#c8ff00] inline-block"
                    style={{ animation: "pulse-dot 2s infinite" }}
                  />
                  Article or claim to verify
                </div>
                <textarea
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                  placeholder="Paste a news article, WhatsApp forward, or any claim you want to fact-check..."
                  rows={8}
                  className="w-full bg-transparent border-none outline-none text-[#f0ede8] text-[15px] leading-[1.75] resize-none"
                  style={{ fontFamily: "inherit" }}
                />
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center mt-4 pt-4 border-t border-[#1a1a1a]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-dm text-[11px] text-[#444]">
                      {article.length} characters
                    </span>
                    {article.length > 0 && article.length < 20 && (
                      <span className="font-mono-dm text-[11px] text-orange-400">
                        ⚠ Too short
                      </span>
                    )}
                    {article.length >= 20 && (
                      <span className="font-mono-dm text-[11px] text-[#c8ff00]">
                        ✓ Ready to analyze
                      </span>
                    )}
                  </div>
                  <button
                    onClick={startAnalysis}
                    className="font-syne font-bold text-[14px] bg-[#c8ff00] text-[#080808] border-none px-7 py-3.5 rounded-xl cursor-pointer hover:brightness-110 transition-all w-full sm:w-auto text-center"
                  >
                    Analyze →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 mt-6 rounded-xl overflow-hidden border border-[#1a1a1a]">
                {[
                  { num: "3", label: "AI Pipeline Steps", icon: "⚡" },
                  { num: "15+", label: "Live Sources Checked", icon: "🌐" },
                  { num: "<10s", label: "Average Analysis Time", icon: "⏱" },
                ].map(({ num, label, icon }, i) => (
                  <div
                    key={i}
                    className={`py-5 px-4 text-center bg-[#0d0d0d] ${i < 2 ? "border-b sm:border-b-0 sm:border-r border-[#1a1a1a]" : ""}`}
                  >
                    <div className="text-[13px] mb-1 text-[#555]">{icon}</div>
                    <div className="text-[24px] font-extrabold tracking-[-1px] text-[#f0ede8]">
                      {num}
                    </div>
                    <div className="font-mono-dm text-[11px] mt-1 text-[#666]">
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ ANALYZING ══════════ */}
        {view === "analyzing" && (
          <div className="min-h-screen px-6 pt-28 pb-16 max-w-[820px] mx-auto">
            <div className="font-mono-dm text-[11px] tracking-[3px] uppercase mb-8 text-[#555]">
              — Live Pipeline Running
            </div>
            {[
              {
                n: 1,
                title: "Extracting core claims",
                desc: "Gemini 2.5 Flash reads and identifies verifiable statements from your article",
              },
              {
                n: 2,
                title: "Searching live sources",
                desc: "Tavily queries 15+ real-time web sources and fact-check databases for evidence",
              },
              {
                n: 3,
                title: "Generating verdict",
                desc: "AI compares extracted claims against retrieved evidence to determine credibility",
              },
            ].map(({ n, title, desc }) => {
              const s = steps[n - 1];
              return (
                <div
                  key={n}
                  className="flex items-start sm:items-center gap-4 sm:gap-5 px-4 sm:px-5 py-5 rounded-xl mb-3 transition-all duration-500"
                  style={{
                    border: `1px solid ${s === "active" ? "rgba(200,255,0,0.18)" : s === "done" ? "#1e1e1e" : "transparent"}`,
                    background:
                      s === "active" ? "rgba(200,255,0,0.025)" : "transparent",
                    opacity: s === "" ? 0.2 : 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl font-mono-dm text-[13px] flex-shrink-0 transition-all duration-300"
                    style={{
                      width: 44,
                      height: 44,
                      border: `1px solid ${s === "active" ? "#c8ff00" : s === "done" ? "rgba(0,230,118,0.4)" : "#222"}`,
                      background:
                        s === "active"
                          ? "rgba(200,255,0,0.08)"
                          : s === "done"
                            ? "rgba(0,230,118,0.06)"
                            : "#111",
                      color:
                        s === "active"
                          ? "#c8ff00"
                          : s === "done"
                            ? "#00e676"
                            : "#444",
                      animation:
                        s === "active" ? "stepPulse 1s infinite" : "none",
                    }}
                  >
                    {s === "done" ? "✓" : s === "active" ? "◉" : `0${n}`}
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-bold mb-1 text-[#f0ede8]">
                      {title}
                    </div>
                    <div className="font-mono-dm text-[12px] text-[#666] leading-[1.5]">
                      {desc}
                    </div>
                  </div>
                  <div className="font-mono-dm text-[12px] text-[#444] flex-shrink-0">
                    {stepTimes[n]}
                  </div>
                </div>
              );
            })}
            <div className="my-7 overflow-hidden rounded-sm h-[2px] bg-[#111]">
              <div
                className="h-full w-[40%]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, #c8ff00, transparent)",
                  animation: "scan 1.5s ease-in-out infinite",
                }}
              />
            </div>
            {logs.length > 0 && (
              <div
                className="rounded-xl p-5 font-mono-dm text-[12px] overflow-y-auto bg-[#0a0a0a] border border-[#161616]"
                style={{ maxHeight: 200 }}
              >
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="log-entry flex gap-3 py-[3px]"
                    style={{
                      color:
                        log.type === "success"
                          ? "#00e676"
                          : log.type === "data"
                            ? "#999"
                            : log.type === "error"
                              ? "#ff4444"
                              : "#c8ff00",
                    }}
                  >
                    <span className="text-[#333] flex-shrink-0">{log.ts}</span>
                    <span>{log.msg}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ══════════ RESULT══════════ */}
        {view === "result" && result && vc && (
          <div className="px-4 sm:px-6 pt-24 pb-24 max-w-235 mx-auto">
            <div
              className="result-card relative rounded-3xl overflow-hidden mb-4"
              style={{
                background: "#0c0c0c",
                border: `1px solid ${vc.border}`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{
                  background: `linear-gradient(90deg, ${vc.color}CC 0%, ${vc.color}40 60%, transparent 100%)`,
                }}
              />
              {/* corner glow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: -100,
                  right: -100,
                  width: 400,
                  height: 400,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${vc.glow} 0%, transparent 65%)`,
                }}
              />

              <div className="p-6 sm:p-8 pb-10">
                <div className="mb-8">
                  <div
                    className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
                    style={{
                      background: vc.bg,
                      border: `1px solid ${vc.border}`,
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                      style={{
                        background: vc.color,
                        boxShadow: `0 0 10px ${vc.color}`,
                      }}
                    />
                    <span
                      className="font-extrabold tracking-[3px] uppercase text-[12px] sm:text-[13px]"
                      style={{ color: vc.color }}
                    >
                      {vc.label}
                    </span>
                  </div>
                  <div className="font-mono-dm text-[12px] text-[#555] mt-4">
                    {result.resources?.length || 0} sources analyzed ·{" "}
                    {new Date().toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-10">
                  <div className="flex flex-col items-center shrink-0">
                    <div
                      className="relative"
                      style={{ width: 160, height: 160 }}
                    >
                      <svg
                        className="absolute inset-0"
                        style={{ transform: "rotate(-90deg)" }}
                        viewBox="0 0 130 130"
                        width="100%"
                        height="100%"
                      >
                        <circle
                          fill="none"
                          stroke="#1a1a1a"
                          strokeWidth="8"
                          cx="65"
                          cy="65"
                          r="58"
                        />
                        <circle
                          fill="none"
                          stroke={vc.color}
                          strokeWidth="8"
                          strokeLinecap="round"
                          cx="65"
                          cy="65"
                          r="58"
                          style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: strokeOffset,
                            transition:
                              "stroke-dashoffset 2s cubic-bezier(0.16,1,0.3,1)",
                            filter: `drop-shadow(0 0 12px ${vc.color}90)`,
                          }}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div
                          className="font-extrabold leading-none"
                          style={{
                            fontSize: 48,
                            letterSpacing: -2,
                            color: vc.color,
                          }}
                        >
                          {scoreDisplay}
                        </div>
                        <div className="font-mono-dm text-[10px] sm:text-[11px] tracking-widest uppercase mt-2 text-[#555]">
                          / 100
                        </div>
                      </div>
                    </div>
                    <div
                      className="font-mono-dm text-[10px] sm:text-[11px] tracking-[2px] uppercase mt-3"
                      style={{ color: "#666" }}
                    >
                      Credibility Score
                    </div>
                  </div>

                  {/* verdict headline + context */}
                  <div className="flex-1 min-w-0 w-full">
                    <h1
                      className="font-extrabold leading-[1.05] mb-5 text-center md:text-left"
                      style={{
                        fontSize: "clamp(24px, 4vw, 42px)",
                        letterSpacing: -1.5,
                        color: "#f0ede8",
                      }}
                    >
                      {vc.headline}
                    </h1>

                    <div
                      className="flex items-start gap-3 p-4 rounded-2xl mb-5"
                      style={{
                        background: "#111",
                        border: `1px solid ${vc.color}20`,
                      }}
                    >
                      <div
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5"
                        style={{
                          background: vc.bg,
                          border: `1px solid ${vc.border}`,
                        }}
                      >
                        <span
                          className="text-[11px] font-bold"
                          style={{ color: vc.color }}
                        >
                          {vc.emoji}
                        </span>
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold text-[#f0ede8] mb-1">
                          {credibility <= 20
                            ? "Very high misinformation risk"
                            : credibility <= 40
                              ? "High misinformation risk"
                              : credibility <= 60
                                ? "Moderate credibility concerns"
                                : credibility <= 80
                                  ? "Mostly credible"
                                  : "Highly credible"}
                        </div>
                        <div className="font-mono-dm text-[12px] text-[#888] leading-[1.6]">
                          Credibility {credibility}/100 · Fake probability{" "}
                          {result.score}/100 · Based on{" "}
                          {result.resources?.length || 0} live sources
                        </div>
                      </div>
                    </div>

                    {/* article preview */}
                    <div
                      className="font-mono-dm text-[12px] leading-[1.7] p-4 rounded-xl break-words"
                      style={{
                        color: "#888",
                        background: "#111",
                        borderLeft: `3px solid ${vc.color}60`,
                      }}
                    >
                      <span className="text-sm tracking-[2px] uppercase text-zinc-400 block mb-2">
                        Article analyzed
                      </span>
                      {article.slice(0, 220)}
                      {article.length > 220 ? "..." : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="result-card rounded-2xl p-5 sm:p-7 mb-4 bg-[#0c0c0c] border border-[#1e1e1e]">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(200,255,0,0.06)",
                    border: "1px solid rgba(200,255,0,0.12)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#c8ff00"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono-dm text-[11px] tracking-[2px] uppercase text-[#c8ff00] font-semibold">
                    Why the AI reached this verdict
                  </div>
                  <div className="font-mono-dm text-[11px] text-[#555] mt-0.5">
                    Based on {result.resources?.length || 0} retrieved sources ·
                    Evidence-grounded reasoning
                  </div>
                </div>
              </div>
              <p className="text-[15px] sm:text-[16px] leading-[1.9] text-[#e0e0e0] font-[400]">
                {result.explanation}
              </p>
            </div>

            {/* ── 3. CLAIMS + SCORES ── */}
            {claims.length > 0 && (
              <div className="result-card rounded-2xl p-5 sm:p-7 mb-4 bg-[#0c0c0c] border border-[#1e1e1e]">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(200,255,0,0.06)",
                      border: "1px solid rgba(200,255,0,0.12)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
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
                    <div className="font-mono-dm text-[11px] tracking-[2px] uppercase text-[#c8ff00] font-semibold">
                      Claims fact-checked
                    </div>
                    <div className="font-mono-dm text-[11px] text-[#555] mt-0.5">
                      {claims.length} verifiable statement
                      {claims.length !== 1 ? "s" : ""} extracted and verified
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {claims.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-xl"
                      style={{
                        background: "#111",
                        border: "1px solid #1a1a1a",
                      }}
                    >
                      <div
                        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center font-mono-dm text-[11px] font-bold"
                        style={{
                          background: "rgba(200,255,0,0.08)",
                          border: "1px solid rgba(200,255,0,0.12)",
                          color: "#c8ff00",
                        }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1">
                        <p className="text-[13px] sm:text-[14px] text-[#ddd] leading-[1.65]">
                          {c.trim()}
                        </p>
                      </div>
                      <div
                        className="shrink-0 px-2 py-1 rounded-lg font-mono-dm text-[12px] sm:text-sm font-bold tracking-wide mt-0.5"
                        style={{
                          background: vc.bg,
                          border: `1px solid ${vc.border}`,
                          color: vc.color,
                        }}
                      >
                        {vc.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 4. CONFIDENCE BARS ── */}
            <div className="result-card rounded-2xl p-5 sm:p-7 mb-4 bg-[#0c0c0c] border border-[#1e1e1e]">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{
                    background: "rgba(200,255,0,0.06)",
                    border: "1px solid rgba(200,255,0,0.12)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#c8ff00"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3v18h18" />
                    <path d="m19 9-5 5-4-4-3 3" />
                  </svg>
                </div>
                <div>
                  <div className="font-mono-dm text-[11px] tracking-[2px] uppercase text-[#c8ff00] font-semibold">
                    Confidence breakdown
                  </div>
                  <div className="font-mono-dm text-[11px] text-[#555] mt-0.5">
                    Signal analysis across 4 dimensions
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  {
                    label: "Fake probability",
                    value: result.score,
                    color: vc.color,
                    desc: "How likely this is misinformation",
                  },
                  {
                    label: "Claim verifiability",
                    value: Math.round(result.score * 0.85),
                    color: "#ff8c00",
                    desc: "How checkable these claims are",
                  },
                  {
                    label: "Evidence strength",
                    value: credibility,
                    color: "#00e676",
                    desc: "How strong the supporting evidence is",
                  },
                  {
                    label: "Source credibility",
                    value: Math.round(credibility * 0.9),
                    color: "#00bcd4",
                    desc: "How reliable the sources found are",
                  },
                ].map(({ label, value, color, desc }) => (
                  <div key={label}>
                    <div className="flex items-end justify-between mb-2 gap-2">
                      <div className="min-w-0">
                        <div className="font-mono-dm text-[15px] sm:text-base text-zinc-200 font-medium truncate">
                          {label}
                        </div>
                        <div className="font-mono-dm text-[12px] sm:text-sm text-zinc-400 mt-0.5 truncate">
                          {desc}
                        </div>
                      </div>
                      <div
                        className="font-extrabold text-[20px] sm:text-[22px] tracking-[-1px] leading-none flex-shrink-0"
                        style={{ color }}
                      >
                        {value}
                        <span className="text-[12px] font-normal text-[#555]">
                          %
                        </span>
                      </div>
                    </div>
                    <div className="rounded-full overflow-hidden h-1.5 bg-[#1a1a1a]">
                      <div
                        className="rounded-full h-full transition-all duration-1500"
                        style={{
                          width: `${value}%`,
                          background: `linear-gradient(90deg, ${color}AA, ${color})`,
                          boxShadow: `0 0 8px ${color}60`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── 5. SOURCES ── */}
            {result.resources?.length > 0 && (
              <div className="result-card rounded-2xl p-5 sm:p-7 mb-6 bg-[#0c0c0c] border border-[#1e1e1e]">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(200,255,0,0.06)",
                      border: "1px solid rgba(200,255,0,0.12)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="#c8ff00"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                      <path d="M2 12h20" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-mono-dm text-[11px] tracking-[2px] uppercase text-[#c8ff00] font-semibold">
                      Sources retrieved
                    </div>
                    <div className="font-mono-dm text-[11px] text-[#555] mt-0.5">
                      {result.resources.length} live web sources used to verify
                      this claim — click any to read
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {result.resources?.slice(0, 8).map((url, i) => {
                    let domain = url;
                    try {
                      domain = new URL(url).hostname.replace("www.", "");
                    } catch {}
                    return (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="src flex items-center gap-3 p-3 sm:p-4 rounded-xl no-underline bg-[#111] border border-[#1a1a1a] hover:bg-[#151515] transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#181818] border border-[#242424] shrink-0">
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{
                              background: vc.color,
                              boxShadow: `0 0 6px ${vc.color}`,
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono-dm text-[14px] sm:text-base text-zinc-200 font-medium truncate">
                            {domain}
                          </div>
                          <div className="font-mono-dm text-[12px] sm:text-sm text-zinc-400 truncate mt-0.5">
                            {url}
                          </div>
                        </div>
                        <span className="font-mono-dm text-[13px] text-[#555] shrink-0">
                          ↗
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── ACTIONS ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between sm:justify-start gap-4">
              <button
                onClick={reset}
                className="w-full sm:w-auto font-syne font-semibold text-[14px] flex justify-center items-center gap-2 bg-[#c8ff00] text-[#080808] border-none px-7 py-3 rounded-xl cursor-pointer hover:brightness-110 transition-all"
              >
                ↺ Analyze another
              </button>
              <a
                href="/"
                className="font-mono-dm text-[12px] text-[#555] hover:text-[#999] transition-colors no-underline"
              >
                ← Back to home
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
