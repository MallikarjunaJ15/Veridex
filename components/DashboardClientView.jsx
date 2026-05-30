"use client";
import { logoutUser } from "@/app/actions/auth.actions";
import Link from "next/link";
import { useState } from "react";

const verdictConfig = {
  fake: {
    color: "#ff4444",
    bg: "rgba(255,68,68,0.08)",
    border: "rgba(255,68,68,0.2)",
    label: "FAKE",
  },
  misleading: {
    color: "#ff8800",
    bg: "rgba(255,136,0,0.08)",
    border: "rgba(255,136,0,0.2)",
    label: "MISLEADING",
  },
  real: {
    color: "#00e676",
    bg: "rgba(0,230,118,0.08)",
    border: "rgba(0,230,118,0.2)",
    label: "VERIFIED",
  },
};

export default function DashboardClientView({ user, analysis = [] }) {
  const [activeTab, setActiveTab] = useState("analysis");
  const [loggingOut, setLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = async () => {
    setLoggingOut(true);
    await logoutUser();
  };

  const firstName = user?.fullname?.firstname || "User";
  const lastName = user?.fullname?.lastname || "";
  const initials = `${firstName[0] || "V"}${lastName[0] || ""}`.toUpperCase();
  const email = user?.email || "";

  const totalScans = analysis.length;
  const fakeCount = analysis.filter((a) => a.verdict === "fake").length;
  const realCount = analysis.filter((a) => a.verdict === "real").length;
  const misleadCount = analysis.filter(
    (a) => a.verdict === "misleading",
  ).length;
  const avgScore = totalScans
    ? Math.round(analysis.reduce((s, a) => s + (a.score || 0), 0) / totalScans)
    : 0;

  const navItems = [
    {
      id: "analysis",
      label: "Analysis History",
      icon: (
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .fs { font-family: 'Syne', sans-serif; }
        .fm { font-family: 'DM Mono', monospace; }
        * { box-sizing: border-box; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.3} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .fade-in { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards; }
        .pulse-dot { animation: pulse-dot 2s infinite; }
        .spin { animation: spin 0.8s linear infinite; }
        .analysis-card:hover .card-arrow { opacity:1; transform:translateX(0); }
        .card-arrow { opacity:0; transform:translateX(-6px); transition:all 0.2s; }
        .nav-btn { transition: all 0.2s; border: 1px solid transparent; }
        .nav-btn:hover { background: rgba(255,255,255,0.03); }
        .nav-btn.active { background: rgba(200,255,0,0.07); border-color: rgba(200,255,0,0.1); }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#0a0a0a; } ::-webkit-scrollbar-thumb { background:#222; border-radius:2px; }
      `}</style>

      <div
        className="fs min-h-screen bg-[#080808] flex flex-col md:flex-row text-[#f0ede8]"
        style={{ fontFamily: "'Syne',sans-serif" }}
      >
        <div
          className="flex md:hidden items-center justify-between p-4 sticky top-0 z-40"
          style={{ background: "#090909", borderBottom: "1px solid #141414" }}
        >
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <div
              className="font-extrabold tracking-tight"
              style={{ fontSize: 20, color: "#f0ede8" }}
            >
              Veri<span style={{ color: "#c8ff00" }}>dex</span>
            </div>
          </a>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl focus:outline-none transition-colors"
            style={{
              color: "#f0ede8",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {/* Hamburger / Close Icon Switch */}
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 2. BACKGROUND BACKDROP OVERLAY (Dim background when mobile menu is open) */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* 3. SIDEBAR DRAWER COMPONENT */}
        <aside
          className={`fixed md:sticky top-0 bottom-0 left-0 h-screen w-60 shrink-0 flex flex-col justify-between z-50 md:z-10 transition-transform duration-300 ease-in-out md:translate-x-0 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{
            background: "#090909",
            borderRight: "1px solid #141414",
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.025]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          <div className="relative z-10">
            <div
              style={{
                padding: "28px 24px 24px",
                borderBottom: "1px solid #141414",
              }}
            >
              <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  className="font-extrabold tracking-tight"
                  style={{ fontSize: 20, color: "#f0ede8" }}
                >
                  Veri<span style={{ color: "#c8ff00" }}>dex</span>
                </div>
              </a>
              <div
                className="fm mt-1"
                style={{
                  fontSize: 9,
                  color: "#333",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                Dashboard
              </div>
            </div>

            {/* User Badge Container */}
            <div
              style={{
                padding: "16px 16px 12px",
                borderBottom: "1px solid #141414",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-xl font-extrabold flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    background: "linear-gradient(135deg,#1e1e1e,#2a2a2a)",
                    border: "1px solid #2a2a2a",
                    fontSize: 13,
                    color: "#c8ff00",
                  }}
                >
                  {initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    className="font-bold truncate"
                    style={{ fontSize: 13, color: "#f0ede8" }}
                  >
                    {firstName} {lastName}
                  </div>
                  <div
                    className="fm truncate"
                    style={{ fontSize: 10, color: "#555" }}
                  >
                    {email}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ padding: "12px 12px 0" }}>
              <div
                className="fm mb-3"
                style={{
                  fontSize: 9,
                  color: "#333",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  paddingLeft: 12,
                }}
              >
                Navigation
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`nav-btn w-full flex items-center gap-3 rounded-xl mb-1 ${activeTab === item.id ? "active" : ""}`}
                  style={{
                    padding: "10px 12px",
                    color: activeTab === item.id ? "#c8ff00" : "#666",
                    background: "none",
                    border: "1px solid transparent",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span
                    style={{
                      color: activeTab === item.id ? "#c8ff00" : "#444",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-medium" style={{ fontSize: 13 }}>
                    {item.label}
                  </span>
                  {item.id === "analysis" && totalScans > 0 && (
                    <span
                      className="fm ml-auto"
                      style={{
                        fontSize: 10,
                        color: activeTab === "analysis" ? "#c8ff00" : "#444",
                        background:
                          activeTab === "analysis"
                            ? "rgba(200,255,0,0.08)"
                            : "#161616",
                        padding: "2px 7px",
                        borderRadius: 20,
                      }}
                    >
                      {totalScans}
                    </span>
                  )}
                </button>
              ))}

              {/* New Analysis Action Button */}
              <a
                href="/analyze"
                style={{
                  textDecoration: "none",
                  display: "block",
                  marginTop: 8,
                }}
              >
                <div
                  className="flex items-center gap-3 rounded-xl font-bold transition-all"
                  style={{
                    padding: "10px 12px",
                    background: "rgba(200,255,0,0.07)",
                    border: "1px solid rgba(200,255,0,0.12)",
                    color: "#c8ff00",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                  New Analysis
                </div>
              </a>
            </div>
          </div>

          {/* Sign Out Section Footer */}
          <div
            className="relative z-10"
            style={{
              padding: "12px 12px 20px",
              borderTop: "1px solid #141414",
            }}
          >
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="w-full flex items-center gap-3 rounded-xl transition-all"
              style={{
                padding: "10px 12px",
                color: "#666",
                background: "none",
                border: "1px solid transparent",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#ff4444";
                e.currentTarget.style.background = "rgba(255,68,68,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,68,68,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#666";
                e.currentTarget.style.background = "none";
                e.currentTarget.style.borderColor = "transparent";
              }}
            >
              {loggingOut ? (
                <svg
                  className="spin"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="rgba(255,68,68,0.25)"
                    strokeWidth="3"
                  />
                  <path
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke="#ff4444"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              )}
              <span className="font-medium">
                {loggingOut ? "Signing out..." : "Sign out"}
              </span>
            </button>
          </div>
        </aside>

        {/*MAIN CONTENT  */}
        <main
          className="flex-1 w-full min-w-0 p-6 md:p-10"
          style={{ background: "#080808" }}
        >
          {activeTab === "analysis" && (
            <div className="fade-in px-4 py-8 md:p-12 w-full max-w-[1200px] mx-auto">
              {/* --- Header Section --- */}
              <div className="flex flex-col lg:flex-row sm:items-center sm:justify-between gap-6 mb-12 lg:mb-16">
                <div>
                  <div className="font-mono text-xs md:text-sm text-[#888] tracking-[0.2em] uppercase mb-4 flex items-center gap-2">
                    <span className="w-6 h-[1px] bg-[#444]"></span> Analysis
                    History
                  </div>
                  <h1 className="font-extrabold tracking-tight text-2xl md:text-2xl lg:text-3xl text-[#f0ede8] mb-4">
                    Your Verifications
                  </h1>
                  <p className="text-base md:text-lg text-[#777] max-w-xl leading-relaxed">
                    Every article and claim you've fact-checked, backed by our
                    full AI evidence pipeline.
                  </p>
                </div>

                <a href="/analyze" className="w-full lg:w-auto">
                  <button className="w-full lg:w-auto flex items-center justify-center gap-3 bg-[#c8ff00] text-[#080808] px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 hover:shadow-[0_0_24px_rgba(200,255,0,0.3)] hover:scale-[1.02] active:scale-95">
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 5v14M5 12h14"
                      />
                    </svg>
                    New Analysis
                  </button>
                </a>
              </div>

              {/* --- Stats Grid --- */}
              {totalScans > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 lg:mb-16">
                  {[
                    {
                      label: "Fact Checks Completed",
                      value: totalScans,
                      color: "#f0ede8",
                      sub: "All time",
                      glow: "rgba(240, 237, 232, 0.1)",
                    },
                    {
                      label: "False Claims Found",
                      value: fakeCount,
                      color: "#ff3366",
                      sub: "Confirmed false",
                      glow: "rgba(255, 51, 102, 0.1)",
                    },
                    {
                      label: "Misleading",
                      value: misleadCount,
                      color: "#ffaa00",
                      sub: "Partial truth",
                      glow: "rgba(255, 170, 0, 0.1)",
                    },
                    {
                      label: "Verified Claims",
                      value: realCount,
                      color: "#00e5ff",
                      sub: "Confirmed true",
                      glow: "rgba(0, 229, 255, 0.1)",
                    },
                  ].map(({ label, value, color, sub, glow }) => (
                    <div
                      key={label}
                      className="group relative rounded-2xl p-6 md:p-8 bg-[#090909] border border-[#222] overflow-hidden transition-all duration-300 hover:border-[#333] hover:bg-[#0c0c0c]"
                    >
                      <div
                        className="absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: glow }}
                      />

                      <div className="relative z-10">
                        <div
                          className="font-extrabold text-3xl md:text-4xl tracking-tighter mb-3"
                          style={{ color }}
                        >
                          {value}
                        </div>
                        <div className="font-semibold text-lg md:text-xl text-[#e0e0e0] mb-1">
                          {label}
                        </div>
                        <div className="font-mono text-xs md:text-sm text-[#666] uppercase tracking-wider">
                          {sub}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* --- Main Content Area --- */}
              {analysis.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl text-center p-16 md:p-24 bg-[#090909] border border-dashed border-[#333] relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

                  <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-[#141414] border border-[#2a2a2a] mb-6 shadow-[0_0_30px_rgba(200,255,0,0.05)]">
                    <svg
                      width="32"
                      height="32"
                      fill="none"
                      stroke="#c8ff00"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.3-4.3"
                      />
                    </svg>
                  </div>
                  <h3 className="font-bold text-2xl md:text-3xl text-[#f0ede8] mb-4">
                    No verifications yet
                  </h3>
                  <p className="text-base md:text-lg text-[#666] mb-8 max-w-md leading-relaxed">
                    Paste a news article or claim to start fact-checking with
                    our live AI pipeline.
                  </p>
                  <a href="/analyze">
                    <button className="bg-[#1a1a1a] text-[#c8ff00] border border-[#333] px-8 py-4 rounded-xl text-base font-bold transition-all hover:bg-[#222] hover:border-[#444]">
                      Start Fact-Checking →
                    </button>
                  </a>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {analysis.map((item, i) => {
                    const vc =
                      verdictConfig[item.verdict] || verdictConfig.misleading;
                    const claims = item.claim ? item.claim.split(" | ") : [];
                    const date = item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "";

                    return (
                      <Link
                        href={`/dashboard/analysis/${item._id}`}
                        key={item._id || i}
                      >
                        <div className="group relative bg-[#090909] border border-[#222] rounded-2xl p-6 md:p-8 transition-all duration-300 hover:bg-[#0c0c0c] hover:border-[#333] cursor-pointer overflow-hidden">
                          <div
                            className="absolute left-0 top-0 bottom-0 w-[4px] transition-all duration-300 group-hover:w-[6px]"
                            style={{
                              background: vc.color,
                              boxShadow: `0 0 16px ${vc.color}40`,
                            }}
                          />

                          <div className="pl-4 md:pl-6">
                            {/* Card Header */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                              <div className="flex flex-wrap items-center gap-3">
                                <div
                                  className="flex items-center gap-2 rounded-md px-3 py-1.5"
                                  style={{
                                    background: vc.bg,
                                    border: `1px solid ${vc.border}`,
                                  }}
                                >
                                  <span
                                    className="w-2 h-2 rounded-full animate-pulse"
                                    style={{ background: vc.color }}
                                  />
                                  <span
                                    className="font-mono font-bold tracking-[0.15em] uppercase text-xs md:text-sm"
                                    style={{ color: vc.color }}
                                  >
                                    {vc.label}
                                  </span>
                                </div>
                                <div className="font-mono text-xs md:text-sm text-[#888] bg-[#141414] border border-[#222] px-3 py-1.5 rounded-md">
                                  Score:{" "}
                                  <span className="text-[#e0e0e0] font-bold">
                                    {item.score ?? "—"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto mt-2 md:mt-0">
                                <span className="font-mono text-xs md:text-sm text-[#555] uppercase tracking-wider">
                                  {date}
                                </span>
                                <span className="text-[#444] text-xl transition-colors duration-300 group-hover:text-[#c8ff00] group-hover:translate-x-2 transform">
                                  →
                                </span>
                              </div>
                            </div>

                            <p className="font-medium text-base md:text-lg text-[#ccc] leading-relaxed mb-6 pr-4 line-clamp-2 md:line-clamp-3">
                              {item.article
                                ? `"${item.article}"`
                                : "No article content provided."}
                            </p>

                            {/* Footer */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-t border-[#1a1a1a] pt-5 mt-2">
                              {claims.length > 0 && (
                                <div className="flex flex-wrap gap-2 md:gap-3">
                                  {claims.slice(0, 2).map((c, ci) => (
                                    <div
                                      key={ci}
                                      className="flex items-center gap-2 bg-[#111] border border-[#222] rounded-lg px-3 py-2 max-w-[250px] md:max-w-[400px]"
                                    >
                                      <span className="font-mono font-bold text-[10px] md:text-xs text-[#c8ff00] tracking-widest shrink-0">
                                        0{ci + 1}
                                      </span>
                                      <span className="font-mono text-xs md:text-sm text-[#999] truncate">
                                        {c.trim()}
                                      </span>
                                    </div>
                                  ))}
                                  {claims.length > 2 && (
                                    <div className="font-mono text-xs md:text-sm text-[#555] flex items-center px-2">
                                      +{claims.length - 2} more
                                    </div>
                                  )}
                                </div>
                              )}

                              {item.resources?.length > 0 && (
                                <div className="flex items-center gap-2 shrink-0">
                                  <svg
                                    width="16"
                                    height="16"
                                    fill="none"
                                    stroke="#666"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                  </svg>
                                  <span className="font-mono text-xs md:text-sm text-[#666] tracking-wide uppercase">
                                    {item.resources.length} Sources
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {activeTab === "profile" && (
            <div className="fade-in w-full max-w-225 mx-auto px-4 py-8 md:py-12">
              <div className="mb-6 md:mb-10 text-center md:text-left">
                <div className="fm mb-2 text-[10px] text-[#555] tracking-widest uppercase">
                  — Account
                </div>
                <h1 className="font-extrabold tracking-tight text-3xl md:text-4xl text-[#f0ede8]">
                  Profile
                </h1>
                <p className="text-sm text-[#888] mt-1.5">
                  Your Veridex account details and activity summary.
                </p>
              </div>

              <div className="rounded-3xl relative overflow-hidden mb-6 bg-[#0d0d0d] border border-[#1e1e1e] p-6 md:p-10">
              
                <div
                  className="absolute -top-30 -right-30 w-100 h-100 rounded-full pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(200,255,0,0.03) 0%, transparent 70%)",
                  }}
                />

                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 relative z-10">
                  {/* Avatar Box */}
                  <div
                    className="flex items-center justify-center rounded-3xl font-extrabold shrink-0 relative w-20 h-20 md:w-24 md:h-24 text-2xl md:text-3xl text-[#c8ff00] border border-[#2a2a2a]"
                    style={{
                      background: "linear-gradient(135deg, #141414, #222)",
                    }}
                  >
                    {initials}
                    <div
                      className="pulse-dot absolute bottom-1 right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#c8ff00] border-[2.5px] border-[#0d0d0d]"
                      style={{
                        boxShadow: "0 0 12px #c8ff00",
                      }}
                    />
                  </div>

                  {/* Identity & Core Meta Row */}
                  <div className="flex-1 w-full text-center md:text-left">
                    <h2 className="font-extrabold mb-1 text-xl md:text-2xl tracking-tight text-[#f0ede8]">
                      {firstName} {lastName}
                    </h2>
                    <p className="fm mb-6 text-sm text-[#666] break-all">
                      {email}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      {[
                        {
                          label: "Account Status",
                          value: "Active",
                          color: "text-[#00e676]",
                        },
                        {
                          label: "Total Scans",
                          value: totalScans,
                          color: "text-[#f0ede8]",
                        },
                      ].map(({ label, value, color }) => (
                        <div
                          key={label}
                          className="rounded-2xl flex-1 bg-[#121212] border border-[#1c1c1c] p-4 text-center sm:text-left"
                        >
                          <div
                            className={`font-bold text-xl md:text-2xl tracking-tight ${color}`}
                          >
                            {value}
                          </div>
                          <div className="fm mt-1 text-[10px] text-zinc-400 tracking-widest uppercase">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Detailed Meta Parameters Box --- */}
              <div className="rounded-2xl border border-neutral-800/60 bg-neutral-950/40 p-5 md:p-8 backdrop-blur-md mb-8">
                <div className="text-xs md:text-sm font-mono uppercase tracking-widest text-neutral-500 font-bold mb-4">
                  Account Information
                </div>

                <div className="divide-y divide-neutral-800/40">
                  {[
                    { label: "Full Name", value: `${firstName} ${lastName}` },
                    { label: "Email Address", value: email },
                    {
                      label: "License Level",
                      value: "Free Tier · Unlimited Scans",
                      badge: true,
                    },
                    {
                      label: "Data Policy",
                      value:
                        "Your articles are entirely private & omitted from training sets",
                    },
                  ].map(({ label, value, badge }) => (
                    <div
                      key={label}
                      className="flex flex-col sm:flex-row sm:items-center justify-between py-4 md:py-5 gap-1 sm:gap-3 first:pt-2 last:pb-2"
                    >
                      <span className="text-sm md:text-base font-medium text-neutral-400">
                        {label}
                      </span>
                      <span
                        className={`text-sm md:text-base text-neutral-300 sm:max-w-[500px] sm:text-right leading-relaxed break-words ${badge ? "font-mono text-emerald-400 font-bold" : ""}`}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger Zone Segment */}
              <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-5 md:p-6 mb-6 backdrop-blur-md">
                <div className="text-[10px] font-mono uppercase tracking-widest text-red-400 font-semibold mb-2">
                  Danger Zone
                </div>
                <p className="text-xs md:text-sm text-neutral-500 mb-5 leading-relaxed max-w-xl">
                  Terminate your current active session and securely clear local
                  system states and cache tokens immediately.
                </p>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full sm:w-auto justify-center inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-500/15 bg-red-500/10 text-xs font-semibold font-mono tracking-wide text-red-400 transition-all duration-200 hover:bg-red-500/20 hover:border-red-500/25 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus:outline-none focus:ring-1 focus:ring-red-500/30"
                >
                  {loggingOut ? (
                    <>
                      <svg
                        className="animate-spin w-3.5 h-3.5 text-red-400"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-20"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="3"
                        />
                        <path
                          className="opacity-100"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Signing out...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                        />
                      </svg>
                      <span>Sign out</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
