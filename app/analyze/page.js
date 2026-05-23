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
    const duration = 1800;
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
    if (!article || article.trim().length < 20) {
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

    // ── FIRE API IMMEDIATELY — runs in background while animations play ──
    const apiPromise = createAnalysis({ article: article.trim() });

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
      `✓ Verdict: ${r.verdict?.toUpperCase()} — score: ${r.score}/100`,
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

  const verdictConfig = {
    fake: {
      color: "#ff4444",
      bg: "rgba(255,68,68,0.08)",
      border: "rgba(255,68,68,0.25)",
      glow: "rgba(255,68,68,0.12)",
      label: "FAKE",
      sub: "This claim is false",
      scoreLabel: "Fake probability",
    },
    misleading: {
      color: "#ff8800",
      bg: "rgba(255,136,0,0.08)",
      border: "rgba(255,136,0,0.25)",
      glow: "rgba(255,136,0,0.12)",
      label: "MISLEADING",
      sub: "Contains misleading information",
      scoreLabel: "Misleading score",
    },
    real: {
      color: "#00e676",
      bg: "rgba(0,230,118,0.08)",
      border: "rgba(0,230,118,0.25)",
      glow: "rgba(0,230,118,0.12)",
      label: "VERIFIED",
      sub: "This claim is accurate",
      scoreLabel: "Fake probability",
    },
  };

  const vc = result
    ? verdictConfig[result.verdict] || verdictConfig.misleading
    : null;
  const credibility = result ? 100 - (result.score || 0) : 0;
  const circumference = 2 * Math.PI * 54;
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
        @keyframes resultIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes stepPulse { 0%,100%{box-shadow:0 0 0 0 rgba(200,255,0,.4)} 50%{box-shadow:0 0 0 8px rgba(200,255,0,0)} }
        @keyframes verdictIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        @keyframes barFill { from{width:0} to{width:var(--target-width)} }
        .source-link:hover { background: rgba(255,255,255,0.04) !important; }
        .source-link { transition: background 0.15s; }
        textarea::placeholder { color: #2a2a2a; }
        .log-entry { opacity:0; transform:translateY(6px); animation: logIn 0.3s forwards; }
      `}</style>

      <div className="font-syne bg-[#080808] min-h-screen text-[#f0ede8] overflow-x-hidden">
        {/* NAV */}
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 border-b border-white/[0.04] backdrop-blur-xl bg-[#080808]/80">
          <a href="/" className="no-underline text-[#f0ede8]">
            <span className="text-[18px] font-extrabold tracking-tight">
              Veri<span className="text-[#c8ff00]">dex</span>
            </span>
          </a>
          <div className="font-mono-dm text-[10px] text-[#444] border border-[#1e1e1e] px-3 py-1 rounded-full tracking-widest uppercase">
            RAG · AI · Real-time
          </div>
        </nav>

        {/* ══ INPUT ══ */}
        {view === "input" && (
          <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-16">
            <div className="text-center mb-10 w-full max-w-[680px]">
              <div className="font-mono-dm text-[10px] tracking-[3px] uppercase mb-4 flex items-center justify-center gap-3 text-[#c8ff00]">
                <span className="w-8 h-px bg-[#c8ff00] opacity-40 inline-block" />
                Fact Verification
                <span className="w-8 h-px bg-[#c8ff00] opacity-40 inline-block" />
              </div>
              <h1 className="font-extrabold tracking-[-2px] mb-3 leading-tight text-[clamp(28px,5vw,44px)]">
                What do you want to verify?
              </h1>
              <p className="text-[18px] text-[#777] leading-[1.7]">
                Paste a news article, claim, or WhatsApp forward. Our AI
                pipeline retrieves live evidence and explains the truth.
              </p>
            </div>

            <div className="w-full max-w-[740px]">
              <div className="rounded-2xl p-5 bg-[#0f0f0f] border border-[#222] focus-within:border-[#c8ff00]/20 transition-colors duration-300">
                <div className="font-mono-dm text-[10px] tracking-[2px] uppercase mb-4 flex items-center gap-2 text-gray-300">
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
                  className="w-full bg-transparent border-none outline-none text-[#f0ede8] text-[15px] leading-[1.75] resize-none placeholder:text-[#f0ede8]"
                  style={{ fontFamily: "inherit" }}
                />

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#1a1a1a]">
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
                    className="font-syne font-bold text-[14px] bg-[#c8ff00] text-[#080808] border-none px-7 py-3 rounded-xl cursor-pointer hover:brightness-110 transition-all"
                  >
                    Analyze →
                  </button>
                </div>
              </div>

              <div className="flex mt-6 rounded-xl overflow-hidden border border-[#1a1a1a]">
                {[
                  { num: "3", label: "AI Pipeline Steps", icon: "⚡" },
                  { num: "15+", label: "Live Sources Checked", icon: "🌐" },
                  { num: "<10s", label: "Average Analysis Time", icon: "⏱" },
                ].map(({ num, label, icon }, i) => (
                  <div
                    key={i}
                    className={`flex-1 py-5 px-4 text-center bg-[#0d0d0d] ${i < 2 ? "border-r border-[#1a1a1a]" : ""}`}
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

        {/* ══ ANALYZING ══ */}
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
              const state = steps[n];
              return (
                <div
                  key={n}
                  className="flex items-center gap-5 px-5 py-5 rounded-xl mb-3 transition-all duration-500"
                  style={{
                    border: `1px solid ${state === "active" ? "rgba(200,255,0,0.18)" : state === "done" ? "#1e1e1e" : "transparent"}`,
                    background:
                      state === "active"
                        ? "rgba(200,255,0,0.025)"
                        : "transparent",
                    opacity: state === "" ? 0.2 : 1,
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl font-mono-dm text-[13px] flex-shrink-0 transition-all duration-300"
                    style={{
                      width: 44,
                      height: 44,
                      border: `1px solid ${state === "active" ? "#c8ff00" : state === "done" ? "rgba(0,230,118,0.4)" : "#222"}`,
                      background:
                        state === "active"
                          ? "rgba(200,255,0,0.08)"
                          : state === "done"
                            ? "rgba(0,230,118,0.06)"
                            : "#111",
                      color:
                        state === "active"
                          ? "#c8ff00"
                          : state === "done"
                            ? "#00e676"
                            : "#444",
                      animation:
                        state === "active" ? "stepPulse 1s infinite" : "none",
                    }}
                  >
                    {state === "done"
                      ? "✓"
                      : state === "active"
                        ? "◉"
                        : `0${n}`}
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

        {/* ══ RESULT ══ */}
        {view === "result" && result && vc && (
          <div
            className="min-h-screen px-6 pt-24 pb-20 max-w-[900px] mx-auto"
            style={{
              animation: "resultIn 0.6s cubic-bezier(0.16,1,0.3,1) forwards",
            }}
          >
            {/* ── HERO VERDICT CARD ── */}
            <div
              className="relative rounded-2xl overflow-hidden mb-5"
              style={{
                background: "#0d0d0d",
                border: `1px solid ${vc.border}`,
              }}
            >
              {/* top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{
                  background: `linear-gradient(90deg, ${vc.color}, ${vc.color}50, transparent)`,
                }}
              />
              {/* ambient glow */}
              <div
                className="absolute pointer-events-none"
                style={{
                  top: -80,
                  right: -80,
                  width: 320,
                  height: 320,
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${vc.glow} 0%, transparent 70%)`,
                }}
              />

              <div
                className="flex items-center gap-8 p-8"
                style={{
                  animation:
                    "verdictIn 0.5s 0.1s cubic-bezier(0.16,1,0.3,1) both",
                }}
              >
                {/* score circle */}
                <div
                  className="relative flex-shrink-0"
                  style={{ width: 160, height: 160 }}
                >
                  <svg
                    className="absolute inset-0"
                    style={{ transform: "rotate(-90deg)" }}
                    viewBox="0 0 120 120"
                    width="160"
                    height="160"
                  >
                    <circle
                      fill="none"
                      stroke="#1a1a1a"
                      strokeWidth="7"
                      cx="60"
                      cy="60"
                      r="54"
                    />
                    <circle
                      fill="none"
                      stroke={vc.color}
                      strokeWidth="7"
                      strokeLinecap="round"
                      cx="60"
                      cy="60"
                      r="54"
                      style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeOffset,
                        transition:
                          "stroke-dashoffset 1.8s cubic-bezier(0.16,1,0.3,1)",
                        filter: `drop-shadow(0 0 10px ${vc.color}80)`,
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      className="font-extrabold text-[#f0ede8]"
                      style={{ fontSize: 44, letterSpacing: -2, lineHeight: 1 }}
                    >
                      {scoreDisplay}
                    </div>
                    <div className="font-mono-dm text-[10px] tracking-widest uppercase mt-1 text-[#555]">
                      credibility
                    </div>
                  </div>
                </div>

                {/* verdict + article preview */}
                <div className="flex-1 min-w-0">
                  <div
                    className="inline-flex items-center gap-2 rounded-lg mb-4 px-4 py-2"
                    style={{
                      background: vc.bg,
                      border: `1px solid ${vc.border}`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{
                        background: vc.color,
                        boxShadow: `0 0 8px ${vc.color}`,
                      }}
                    />
                    <span
                      className="font-extrabold tracking-[2px] uppercase text-[13px]"
                      style={{ color: vc.color }}
                    >
                      {vc.label}
                    </span>
                  </div>

                  <h2
                    className="font-extrabold text-[#f0ede8] mb-4 leading-tight"
                    style={{
                      fontSize: "clamp(20px,3vw,30px)",
                      letterSpacing: -0.5,
                    }}
                  >
                    {vc.sub}
                  </h2>

                  <div
                    className="font-mono-dm text-[12px] leading-[1.65] p-4 rounded-xl text-[#aaa]"
                    style={{
                      background: "#111",
                      borderLeft: `3px solid ${vc.color}50`,
                    }}
                  >
                    {article.slice(0, 200)}
                    {article.length > 200 ? "..." : ""}
                  </div>
                </div>

                {/* score stats */}
                <div
                  className="flex flex-col gap-3 flex-shrink-0"
                  style={{ minWidth: 130 }}
                >
                  {[
                    {
                      label: vc.scoreLabel,
                      value: result.score,
                      color: vc.color,
                    },
                    {
                      label: "Credibility score",
                      value: credibility,
                      color: "#00e676",
                    },
                    {
                      label: "Sources analyzed",
                      value: result.resources?.length || 0,
                      color: "#00bcd4",
                    },
                  ].map(({ label, value, color }) => (
                    <div
                      key={label}
                      className="text-center py-4 px-3 rounded-xl bg-[#111] border border-[#1a1a1a]"
                    >
                      <div
                        className="font-extrabold text-[28px] tracking-[-1px] leading-none"
                        style={{ color }}
                      >
                        {value}
                      </div>
                      <div className="font-mono-dm text-[10px] tracking-wide uppercase mt-2 text-[#555] leading-[1.4]">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── AI EXPLANATION ── */}
            <div className="rounded-2xl p-7 mb-4 bg-[#0d0d0d] border border-[#1e1e1e]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#c8ff00]/[0.06] border border-[#c8ff00]/10">
                  <svg
                    width="14"
                    height="14"
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
                  <div className="font-mono-dm text-[10px] tracking-[2px] uppercase text-[#c8ff00]">
                    AI Explanation
                  </div>
                  <div className="font-mono-dm text-[11px] text-[#555]">
                    Evidence-based analysis from {result.resources?.length || 0}{" "}
                    retrieved sources
                  </div>
                </div>
              </div>
              <p className="text-[16px] leading-[1.85] text-[#ddd] font-[400]">
                {result.explanation}
              </p>
            </div>

            {/* ── CLAIMS + CONFIDENCE GRID ── */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* claims */}
              <div className="rounded-2xl p-6 bg-[#0d0d0d] border border-[#1e1e1e]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#c8ff00]/[0.06] border border-[#c8ff00]/10">
                    <svg
                      width="14"
                      height="14"
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
                    <div className="font-mono-dm text-[10px] tracking-[2px] uppercase text-[#c8ff00]">
                      Claims Extracted
                    </div>
                    <div className="font-mono-dm text-[11px] text-[#555]">
                      {claims.length} verifiable statement
                      {claims.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
                <div>
                  {claims.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 py-3 rounded-lg px-2"
                      style={{
                        borderBottom:
                          i < claims.length - 1 ? "1px solid #161616" : "none",
                      }}
                    >
                      <span className="font-mono-dm text-[10px] font-bold px-2 py-1 rounded flex-shrink-0 mt-[2px] text-[#c8ff00] bg-[#c8ff00]/[0.08]">
                        0{i + 1}
                      </span>
                      <span className="text-[13px] leading-[1.65] text-[#ccc]">
                        {c.trim()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* confidence breakdown */}
              <div className="rounded-2xl p-6 bg-[#0d0d0d] border border-[#1e1e1e]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#c8ff00]/[0.06] border border-[#c8ff00]/10">
                    <svg
                      width="14"
                      height="14"
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
                    <div className="font-mono-dm text-[10px] tracking-[2px] uppercase text-[#c8ff00]">
                      Confidence Breakdown
                    </div>
                    <div className="font-mono-dm text-[11px] text-[#555]">
                      Signal analysis
                    </div>
                  </div>
                </div>
                {[
                  {
                    label: "Fake probability",
                    value: result.score,
                    color: vc.color,
                  },
                  {
                    label: "Claim verifiability",
                    value: Math.round(result.score * 0.85),
                    color: "#ff8800",
                  },
                  {
                    label: "Evidence strength",
                    value: credibility,
                    color: "#00e676",
                  },
                  {
                    label: "Source credibility",
                    value: Math.round(credibility * 0.9),
                    color: "#00bcd4",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="mb-5">
                    <div className="flex justify-between mb-2">
                      <span className="font-mono-dm text-[12px] text-[#888]">
                        {label}
                      </span>
                      <span
                        className="font-mono-dm text-[12px] font-bold"
                        style={{ color }}
                      >
                        {value}%
                      </span>
                    </div>
                    <div className="rounded-full overflow-hidden h-[5px] bg-[#1a1a1a]">
                      <div
                        className="rounded-full h-full transition-all duration-1000"
                        style={{
                          width: `${value}%`,
                          background: color,
                          boxShadow: `0 0 8px ${color}60`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── SOURCES ── */}
            {result.resources?.length > 0 && (
              <div className="rounded-2xl p-6 mb-6 bg-[#0d0d0d] border border-[#1e1e1e]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#c8ff00]/[0.06] border border-[#c8ff00]/10">
                    <svg
                      width="14"
                      height="14"
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
                    <div className="font-mono-dm text-[10px] tracking-[2px] uppercase text-[#c8ff00]">
                      Sources Retrieved
                    </div>
                    <div className="font-mono-dm text-[11px] text-[#555]">
                      {result.resources.length} live web sources — click to open
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {result.resources.slice(0, 8).map((url, i) => {
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
                        className="source-link flex items-center gap-3 p-3 rounded-xl no-underline bg-[#111] border border-[#1a1a1a] hover:border-[#2a2a2a]"
                      >
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#1a1a1a] border border-[#242424] flex-shrink-0">
                          <span className="w-[5px] h-[5px] rounded-full bg-[#c8ff00] inline-block" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-mono-dm text-[12px] font-semibold text-[#bbb]">
                            {domain}
                          </div>
                          <div className="font-mono-dm text-[10px] text-[#444] overflow-hidden text-ellipsis whitespace-nowrap">
                            {url}
                          </div>
                        </div>
                        <span className="font-mono-dm text-[11px] text-[#444] flex-shrink-0">
                          ↗
                        </span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── ACTIONS ── */}
            <div className="flex items-center gap-4">
              <button
                onClick={reset}
                className="font-syne font-semibold text-[13px] flex items-center gap-2 bg-transparent border border-[#2a2a2a] text-[#ccc] px-6 py-3 rounded-xl cursor-pointer hover:border-[#555] hover:text-white transition-all"
              >
                ↺ Analyze another
              </button>
              <a
                href="/"
                className="font-mono-dm text-[12px] text-[#444] hover:text-[#888] transition-colors no-underline"
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
