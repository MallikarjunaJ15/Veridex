"use client";
import { useEffect, useState } from "react";
import NavBar from "./NavBar";

export default function LandingPage({ user }) {
  const [scrolled, setScrolled] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  const [count3, setCount3] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const animateCount = (setter, target, duration) => {
      const start = performance.now();
      const update = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setter(Math.round(target * ease));
        if (p < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    };
    const timer = setTimeout(() => {
      animateCount(setCount1, 94, 2000);
      animateCount(setCount2, 15, 1500);
      animateCount(setCount3, 2800, 2500);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      num: "01",
      title: "Paste any article or claim",
      desc: "News article, WhatsApp forward, social media post, or any text you want verified. We handle any language, any length.",
      tag: "Input",
      accent: "#c8ff00",
    },
    {
      num: "02",
      title: "AI extracts the core claims",
      desc: "Gemini 2.5 Flash reads the content and identifies 1–3 specific, verifiable factual assertions — the statements that can actually be checked.",
      tag: "Extract",
      accent: "#00e5ff",
    },
    {
      num: "03",
      title: "Real-time web search",
      desc: "We query 15+ live sources across news outlets, fact-check databases, and government portals. No cached data. Always current.",
      tag: "Retrieve",
      accent: "#a78bfa",
    },
    {
      num: "04",
      title: "Evidence-based verdict",
      desc: "AI compares claims against retrieved evidence and delivers a verdict with full reasoning — not a guess, a conclusion backed by sources.",
      tag: "Verdict",
      accent: "#34d399",
    },
  ];

  const problems = [
    {
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="#c8ff00"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" />
          <path d="M19.14 19.14 21 21M15 9l-6 6M9 9l6 6" />
        </svg>
      ),
      label: "WhatsApp Forwards",
      text: "Your cousin forwards a message about a government scheme that sounds too good to be true.",
    },
    {
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="#c8ff00"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2" />
          <path d="M2 8h10" />
          <path d="M2 12h10" />
          <path d="M2 16h6" />
        </svg>
      ),
      label: "Suspicious Headlines",
      text: "A news headline sounds alarming but you can't tell if it's from a credible source.",
    },
    {
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="#c8ff00"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M22 4s-2.8 2-5 2c-3 0-4-2-7-2a8 8 0 0 0-5 2v14a8 8 0 0 1 5-2c3 0 4 2 7 2 2.2 0 5-2 5-2V4Z" />
        </svg>
      ),
      label: "Viral Social Posts",
      text: "A tweet claiming something shocking about a public figure is getting thousands of shares.",
    },
    {
      icon: (
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="#c8ff00"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      ),
      label: "Group Chat Claims",
      text: "A Telegram group is spreading a health claim that contradicts what doctors say.",
    },
  ];

  const sampleVerdicts = [
    {
      label: "MISLEADING",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      dot: "bg-amber-500",
      barColor: "#f59e0b",
      article:
        '"COVID vaccines reduced hospitalization rates. However, they cause infertility in most women."',
      explanation:
        "While the first claim regarding hospitalization rates is factually accurate, the secondary claim about infertility is completely false. Therefore, the overall text is highly misleading.",
      claimsCount: 2,
      sources: 14,
    },
    {
      label: "FALSE",
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      dot: "bg-red-500",
      barColor: "#ef4444",
      article:
        '"The CEO of OpenTech just announced they are filing for bankruptcy and shutting down all servers tomorrow."',
      explanation:
        "No primary or secondary news sources support this statement. OpenTech's recent financial disclosures show record profits, making this a fabricated rumor.",
      claimsCount: 3,
      sources: 8,
    },
    {
      label: "TRUE",
      color: "text-[#00e676]",
      bg: "bg-[#00e676]/10",
      border: "border-[#00e676]/20",
      dot: "bg-[#00e676]",
      barColor: "#00e676",
      article:
        '"The new climate bill passed the Senate with a 51-49 vote, allocating $300 billion to renewable energy projects over the next decade."',
      explanation:
        "This statement perfectly matches official congressional voting records and the published text of the bill verified across multiple tier-1 government sources.",
      claimsCount: 4,
      sources: 12,
    },
  ];

  const trustCards = [
    {
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="m13 2-2 2.5h3L12 7" />
          <path d="M10 14v-3" />
          <path d="M14 14v-3" />
          <path d="M11 19H6.93A2 2 0 0 1 5 17.27l1-10H18l-.52 5" />
          <path d="M19 16v6" />
          <path d="M22 19l-3 3-3-3" />
        </svg>
      ),
      title: "Not a classifier",
      body: "We don't just label content as fake or real. We retrieve actual evidence, read it, and reason from it — the way an investigative journalist would.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
          <path d="M2 12h20" />
        </svg>
      ),
      title: "Always current",
      body: "Every analysis pulls live web data. No stale databases. No cached verdicts. The web is searched fresh every single time you paste an article.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
          <path d="M11 8v6" />
          <path d="M8 11h6" />
        </svg>
      ),
      title: "Fully explainable",
      body: "Every verdict shows you the exact sources and reasoning behind it. You see how we reached the conclusion — not just the final answer.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
      title: "Your data stays yours",
      body: "We don't sell your data or use your articles to train AI models. What you paste stays private between you and your analysis.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M3 3v18h18" />
          <path d="m19 9-5 5-4-4-3 3" />
        </svg>
      ),
      title: "Confidence scoring",
      body: "Every verdict includes a 0–100 credibility score so you understand exactly how strongly the evidence supports or contradicts the claim.",
    },
    {
      icon: (
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      title: "Built for India",
      body: "Designed with Indian misinformation patterns in mind — government scheme rumors, election claims, health misinformation, and WhatsApp forwards.",
    },
  ];

  const faqs = [
    {
      q: "How is this different from just Googling it?",
      a: "Google shows you results. Veridex reads those results, compares them against the specific claims in the article, and tells you where they contradict each other — with full reasoning. It's the difference between a search engine and a fact-checker.",
    },
    {
      q: "Can it be fooled by cleverly written misinformation?",
      a: "It's harder than it sounds. Because we retrieve live sources and compare claims against actual evidence, the AI isn't just reading tone — it's checking facts. No system is perfect, but we don't rely on just one signal.",
    },
    {
      q: "Is my article stored or shared?",
      a: "Your analysis is saved to your account history so you can revisit it. We do not share your data or use it to train models. Your account data is yours.",
    },
    {
      q: "What languages does it support?",
      a: "Currently optimized for English and Hindi. Regional language support is on the roadmap. The web search works across languages but verdict quality is best in English.",
    },
  ];

  const marqueeItems = [
    "Paste the article",
    "AI extracts core claims",
    "Real-time Verification per claim",
    "Evidence-based AI",
    "15+ Sources",
    "Explainable Verdicts",
    "No Hallucination",
    "Fact-Check in 10s",
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap');
        .font-syne { font-family: 'Syne', sans-serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        .font-serif-inst { font-family: 'Instrument Serif', serif; }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes marquee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        .animate-pulse-dot { animation: pulse-dot 2s infinite; }
        .animate-marquee { animation: marquee 20s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        .animate-fadeUp { animation: fadeUp 0.3s forwards; }
        .step-card:hover { border-color: rgba(200,255,0,0.2) !important; transform: translateY(-2px); }
        .step-card { transition: all 0.25s ease; }
        .trust-card:hover { border-color: rgba(255,255,255,0.08) !important; background: #111 !important; }
        .trust-card { transition: all 0.25s ease; }
        .problem-card:hover { border-color: rgba(200,255,0,0.15) !important; background: #111 !important; }
        .problem-card { transition: all 0.25s ease; }
        .verdict-card:hover { border-color: rgba(255,255,255,0.07) !important; }
        .verdict-card { transition: border-color 0.25s ease; }
      `}</style>

      <div className="font-syne bg-[#080808] text-[#f0ede8] overflow-x-hidden min-h-screen">
        {/* NAV */}
        <NavBar scrolled={scrolled} user={user} />
        {/* HERO */}
        <section className="min-h-screen flex flex-col items-center justify-center px-12 pt-35 pb-25 text-center relative">
          <div
            className="absolute top-[20%] md:top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-200 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse, rgba(200,255,0,0.05) 0%, transparent 65%)",
            }}
          />

          <div className="inline-flex items-center gap-2 bg-[#c8ff00]/6 border border-[#c8ff00]/20 rounded-full px-3.5 py-1.5 mb-9">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c8ff00] inline-block animate-pulse-dot" />
            <span className="font-mono-dm text-[11px] text-[#c8ff00] tracking-[1.5px] uppercase">
              Live AI Fact Verification
            </span>
          </div>

          <h1
            className=" font-bold md:font-extrabold leading-[1.05] md:leading-[0.92] md:tracking-[-4px] mb-6 md:mb-7 max-w-225 text-white"
            style={{ fontSize: "clamp(38px, 7.5vw, 96px)" }}
          >
            Stop sharing
            <br />
            <span
              className="font-serif-inst italic font-normal text-[#777]"
              style={{ fontSize: "0.9em", letterSpacing: "-2px" }}
            >
              misinformation
            </span>
            <br />
            unknowingly
          </h1>

          <p className="text-base md:text-lg text-[#bbb] md:font-semibold max-w-130  leading-[1.6] md:leading-[1.7] mb-8  md:mb-12">
            Veridex uses a 3-step RAG AI pipeline to retrieve real-time
            evidence, compare it against any claim, and explain exactly why
            something is true, false, or misleading.
          </p>

          <div className="felx  flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-20">
            <a href="/analyze">
              <button className="bg-[#c8ff00] text-[#080808] font-bold text-[15px] px-8 py-[14px] rounded-xl tracking-wide flex items-center gap-2 border-none cursor-pointer hover:brightness-110 transition-all">
                Fact-check for free →
              </button>
            </a>
            <a href="#how-it-works">
              <button className="bg-transparent border border-[#333] text-[#bbb] text-sm font-medium px-7 py-[14px] rounded-xl cursor-pointer hover:border-[#555] hover:text-white transition-all">
                See how it works
              </button>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row border border-[#1a1a1a] rounded-2xl overflow-hidden">
            {[
              { num: `${count1}%`, label: "Accuracy on benchmark datasets" },
              { num: `${count2}+`, label: "Live sources per analysis" },
              { num: `${count3}+`, label: "Articles fact-checked" },
            ].map(({ num, label }, i) => (
              <div
                key={i}
                className={`px-10 py-6 text-center bg-[#0d0d0d] ${i < 2 ? "border-b sm:border-b-0 sm:border-r border-[#1a1a1a]" : ""}`}
              >
                <div className="text-[32px] font-extrabold :tracking-[-1.5px] text-[#f0ede8] mb-2">
                  {num}
                </div>
                <div className="font-mono-dm text-[12px] text-[#888] tracking-wide uppercase">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* THE PROBLEM */}
        <section className="py-5 md:py-30 px-12 max-w-275 mx-auto">
          <div className="grid  grid-cols-1 gap-15 md:grid-cols-2 md:gap-20 items-center">
            <div>
              <div className="font-mono-dm text-[10px] tracking-[3px] uppercase text-[#c8ff00] mb-5">
                The Problem
              </div>
              <h2
                className=" font-extrabold leading-[1.05] tracking-[-2px] mb-6"
                style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
              >
                Misinformation spreads
                <br />
                <span className="font-serif-inst italic font-normal text-[#666]">
                  faster than truth
                </span>
              </h2>

              <p className="text-base text-[#999] leading-[1.75] mb-4">
                By the time a correction is published, the original false claim
                has already been shared thousands of times. Most people
                don&apos;t fact-check — not because they don&apos;t care, but
                because it takes too long.
              </p>
              <p className="text-base text-[#999] leading-[1.75]">
                Veridex makes verification as fast as sharing. Paste. Analyze.
                Know the truth in under 10 seconds.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              {problems.map(({ icon, label, text }, i) => (
                <div
                  key={i}
                  className="problem-card flex items-start gap-4 px-5 py-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#c8ff00]/6 border border-[#c8ff00]/15 flex items-center justify-center shrink-0 mt-0.5">
                    {icon}
                  </div>
                  <div>
                    <div className="text-[12px] font-semibold text-[#c8ff00] font-mono-dm tracking-wide uppercase mb-1">
                      {label}
                    </div>
                    <span className="text-sm text-[#aaa] leading-[1.6]">
                      {text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py:10 md:py-30 px-12 bg-[#0a0a0a] border-t border-b border-[#111]"
        >
          <div className="max-w-250 mx-auto">
            <div className="text-center mb-18">
              <div className="font-mono-dm text-[10px] tracking-[3px] uppercase text-[#c8ff00] mb-4">
                How it works
              </div>
              <h2
                className="font-extrabold tracking-[-2px] leading-[1.05]"
                style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
              >
                Not a classifier.
                <br />
                <span className="font-serif-inst italic font-normal text-[#666]">
                  A fact-checker.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1  md:grid-cols-2 gap-8 md:gap-4">
              {steps.map(({ num, title, desc, tag, accent }, i) => (
                <div
                  key={i}
                  className="step-card p-8 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl relative overflow-hidden cursor-default"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-0.5"
                    style={{
                      background: `linear-gradient(90deg, ${accent}60, ${accent}20, transparent)`,
                    }}
                  />
                  <div
                    className="absolute top-5 right-5 font-mono-dm text-[10px] tracking-widest uppercase px-2 py-[3px] rounded border"
                    style={{
                      color: accent,
                      borderColor: `${accent}30`,
                      background: `${accent}10`,
                    }}
                  >
                    {tag}
                  </div>
                  <div
                    className="font-mono-dm text-[40px] font-light mb-4 tracking-[-2px]"
                    style={{ color: `${accent}30` }}
                  >
                    {num}
                  </div>
                  <h3 className="text-[17px] font-bold mb-3 tracking-tight text-[#f0ede8]">
                    {title}
                  </h3>
                  <p className="text-sm text-[#999] leading-[1.75]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REAL EXAMPLES */}
        <section id="examples" className="py-20 md:py-30 px-6 md:px-12">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-16">
              <div className="font-mono text-[10px] tracking-[3px] uppercase text-[#c8ff00] mb-4 font-bold">
                Real Examples
              </div>
              <h2
                className="font-extrabold tracking-tight text-white"
                style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
              >
                See it in action
              </h2>
              <p className="text-base text-zinc-400 mt-4 max-w-[440px] mx-auto">
                Real articles. Independent claim extraction. Live sources.
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {sampleVerdicts.map((item, i) => (
                <div
                  key={i}
                  className="px-6 md:px-8 py-7 bg-[#0d0d0d] border border-[#1a1a1a] rounded-2xl grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-8 items-start relative overflow-hidden transition-all hover:border-[#333]"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1"
                    style={{ background: item.barColor }}
                  />

                  <div className="pl-2 md:pl-3">
                    <div
                      className={`inline-flex items-center gap-2 ${item.bg} border ${item.border} rounded-md px-2.5 py-1 mb-4`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${item.dot} inline-block shrink-0`}
                      />
                      <span
                        className={`font-mono text-[10px] ${item.color} tracking-[1.5px] font-bold`}
                      >
                        {item.label}
                      </span>
                    </div>

                    <p className="text-[15px] text-zinc-300 italic mb-3 leading-[1.6] font-medium border-l-2 border-[#222] pl-4">
                      {item.article}
                    </p>

                    <p className="text-[14px] text-zinc-400 leading-relaxed">
                      <span className="font-semibold text-zinc-300">
                        Analysis:{" "}
                      </span>
                      {item.explanation}
                    </p>
                  </div>

                  <div className="flex flex-row md:flex-col justify-between md:justify-center w-full md:w-auto gap-6 md:gap-8 shrink-0 border-t border-[#1a1a1a] md:border-none pt-5 md:pt-2 md:pl-6 md:border-l">
                    <div className="text-center md:text-right">
                      <div className="text-[28px] font-extrabold text-white tracking-tight leading-none">
                        {item.claimsCount}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase mt-2 font-semibold">
                        Claims
                        <br className="hidden md:block" /> Verified
                      </div>
                    </div>

                    <div className="text-center md:text-right">
                      <div className="text-[24px] font-bold text-zinc-300 leading-none">
                        {item.sources}
                      </div>
                      <div className="font-mono text-[10px] text-zinc-500 tracking-widest uppercase mt-2 font-semibold">
                        Sources
                        <br className="hidden md:block" /> Checked
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="py-12 bg-[#0a0a0a] border-t border-b border-[#111] overflow-hidden">
          <div className="overflow-hidden">
            <div className="animate-marquee flex gap-12 w-max">
              {[...Array(2)].map((_, ri) =>
                marqueeItems.map((item, i) => (
                  <div
                    key={`${ri}-${i}`}
                    className="flex items-center gap-12 shrink-0"
                  >
                    <span className="font-mono-dm text-[13px] text-[#7e7e7e] tracking-widest uppercase whitespace-nowrap">
                      {item}
                    </span>
                    <span className="text-[#c8ff00] text-[10px]">✦</span>
                  </div>
                )),
              )}
            </div>
          </div>
        </div>

        {/* WHY TRUST US */}
        <section className="py-20 md:py-30 px-12 max-w-250 mx-auto">
          <div className="text-center mb-16">
            <div className="font-mono-dm text-[10px] tracking-[3px] uppercase text-[#c8ff00] mb-4">
              Why trust Veridex
            </div>
            <h2
              className="font-extrabold tracking-[-2px]"
              style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
            >
              Built different
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {trustCards.map(({ icon, title, body }, i) => (
              <div
                key={i}
                className="trust-card p-7 bg-[#0d0d0d] border border-[#1a1a1a] rounded-[14px]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#c8ff00]/[0.06] border border-[#c8ff00]/15 flex items-center justify-center mb-5 text-[#c8ff00]">
                  {icon}
                </div>
                <h3 className="text-[15px] font-bold mb-3 tracking-tight text-[#f0ede8]">
                  {title}
                </h3>
                <p className="text-[13px] text-[#888] leading-[1.75]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="py-10 md:py-30 px-12 bg-[#0a0a0a] border-t border-[#111]"
        >
          <div className="max-w-170 mx-auto">
            <div className="text-center mb-16">
              <div className="font-mono-dm text-[10px] tracking-[3px] uppercase text-[#c8ff00] mb-4">
                FAQ
              </div>
              <h2
                className="font-extrabold tracking-[-2px]"
                style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
              >
                Questions answered
              </h2>
            </div>
            {faqs.map(({ q, a }, i) => (
              <div key={i} className="border-b border-[#1a1a1a]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-6 flex justify-between items-center bg-transparent border-none text-[#f0ede8] text-left gap-4 cursor-pointer"
                >
                  <span className="text-[15px] font-semibold tracking-tight">
                    {q}
                  </span>
                  <span
                    className={`text-[#555] text-xl shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : "rotate-0"}`}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div className="pb-6 text-sm text-[#999] leading-[1.75] animate-fadeUp">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className=" py-15 md:py-35 px-12 text-center relative overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  w-full max-w-175  pointer-events-none rounded-full"
            style={{
              background:
                "radial-gradient(ellipse, rgba(200,255,0,0.05) 0%, transparent 65%)",
            }}
          />
          <div className="font-mono-dm text-[10px] tracking-[3px] uppercase text-[#c8ff00] mb-6">
            Start for free
          </div>
          <h2
            className="font-extrabold tracking-[-3px] leading-[0.95] mb-6"
            style={{ fontSize: "clamp(40px, 6vw, 80px)" }}
          >
            The next article you read
            <br />
            <span
              className="font-serif-inst italic font-normal text-[#555]"
              style={{ fontSize: "0.85em" }}
            >
              could be false.
            </span>
          </h2>
          <p className="text-[17px] text-[#999] max-w-100 mx-auto mb-12 leading-[1.7]">
            Paste it into Veridex before you share it. Takes 10 seconds. Could
            save you from spreading something untrue.
          </p>
          {user ? (
            <a href="/analyze">
              <button className="bg-[#c8ff00] text-[#080808] border-none px-10 py-4 rounded-xl text-base font-bold tracking-wide inline-flex items-center gap-[10px] cursor-pointer hover:brightness-110 transition-all">
                Fact-check now — it&apos;s free →
              </button>
            </a>
          ) : (
            <a href="/login">
              <button className="bg-[#c8ff00] text-[#080808] border-none px-10 py-4 rounded-xl text-base font-bold tracking-wide inline-flex items-center gap-[10px] cursor-pointer hover:brightness-110 transition-all">
               Login — it&apos;s free →
              </button>
            </a>
          )}
        </section>

        {/* FOOTER */}
        <footer className="px-6 md:px-12 py-10 border-t border-[#111] flex flex-col md:flex-row justify-between items-center gap-6 md:gap-0 text-center md:text-left">
          <div className="text-base font-extrabold">
            Veri<span className="text-[#c8ff00]">dex</span>
          </div>
          <div className="font-mono-dm text-[11px] text-zinc-400">
            Truth backed by evidence.
          </div>
          <div className="font-mono-dm text-[11px] text-[#7b7a7a]">
            © 2026 Veridex
          </div>
        </footer>
      </div>
    </>
  );
}
