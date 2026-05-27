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
        className="fs min-h-screen bg-[#080808] flex text-[#f0ede8]"
        style={{ fontFamily: "'Syne',sans-serif" }}
      >
        {/*SIDEBAR */}
        <aside
          className="w-[240px] flex-shrink-0 flex flex-col justify-between relative"
          style={{
            background: "#090909",
            borderRight: "1px solid #141414",
            position: "sticky",
            top: 0,
            height: "100vh",
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

            {/* nav */}
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
                  onClick={() => setActiveTab(item.id)}
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
          className="flex-1 overflow-y-auto"
          style={{ background: "#080808" }}
        >
          {activeTab === "analysis" && (
            <div
              className="fade-in"
              style={{ padding: "48px 48px", maxWidth: 900, margin: "0 auto" }}
            >
              <div className="flex items-start justify-between mb-10">
                <div>
                  <div
                    className="fm mb-2"
                    style={{
                      fontSize: 10,
                      color: "#444",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                    }}
                  >
                    — Analysis History
                  </div>
                  <h1
                    className="font-extrabold tracking-tight"
                    style={{
                      fontSize: 32,
                      letterSpacing: -1.5,
                      color: "#f0ede8",
                    }}
                  >
                    Your Verifications
                  </h1>
                  <p style={{ fontSize: 14, color: "#666", marginTop: 6 }}>
                    Every article and claim you've fact-checked — with full AI
                    evidence.
                  </p>
                </div>
                <a href="/analyze" style={{ textDecoration: "none" }}>
                  <button
                    className="fs font-bold flex items-center gap-2 transition-all"
                    style={{
                      background: "#c8ff00",
                      color: "#080808",
                      border: "none",
                      borderRadius: 12,
                      padding: "11px 20px",
                      fontSize: 13,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter = "brightness(1.1)";
                      e.currentTarget.style.boxShadow =
                        "0 0 24px rgba(200,255,0,0.25)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "brightness(1)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    New Analysis
                  </button>
                </a>
              </div>

              {totalScans > 0 && (
                <div className="grid grid-cols-4 gap-3 mb-10">
                  {[
                    {
                      label: "Total Scans",
                      value: totalScans,
                      color: "#f0ede8",
                      sub: "all time",
                    },
                    {
                      label: "Fake Detected",
                      value: fakeCount,
                      color: "#ff4444",
                      sub: "confirmed false",
                    },
                    {
                      label: "Misleading",
                      value: misleadCount,
                      color: "#ff8800",
                      sub: "partial truth",
                    },
                    {
                      label: "Verified Real",
                      value: realCount,
                      color: "#00e676",
                      sub: "confirmed true",
                    },
                  ].map(({ label, value, color, sub }) => (
                    <div
                      key={label}
                      className="rounded-2xl"
                      style={{
                        background: "#0d0d0d",
                        border: "1px solid #161616",
                        padding: "20px 20px",
                      }}
                    >
                      <div
                        className="font-extrabold"
                        style={{
                          fontSize: 32,
                          letterSpacing: -2,
                          color,
                          lineHeight: 1,
                        }}
                      >
                        {value}
                      </div>
                      <div
                        className="font-semibold mt-2"
                        style={{ fontSize: 13, color: "#f0ede8" }}
                      >
                        {label}
                      </div>
                      <div
                        className="fm mt-1"
                        style={{ fontSize: 10, color: "#444" }}
                      >
                        {sub}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {analysis.length === 0 ? (
                <div
                  className="flex flex-col items-center justify-center rounded-3xl"
                  style={{
                    padding: "80px 40px",
                    background: "#0d0d0d",
                    border: "1px dashed #1e1e1e",
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl mb-5"
                    style={{
                      width: 56,
                      height: 56,
                      background: "rgba(200,255,0,0.06)",
                      border: "1px solid rgba(200,255,0,0.1)",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      fill="none"
                      stroke="#c8ff00"
                      strokeWidth="1.5"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                  </div>
                  <h3
                    className="font-bold mb-2"
                    style={{ fontSize: 18, color: "#f0ede8" }}
                  >
                    No verifications yet
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#555",
                      marginBottom: 24,
                      textAlign: "center",
                      maxWidth: 320,
                    }}
                  >
                    Paste a news article or claim to start fact-checking with
                    our live AI pipeline.
                  </p>
                  <a href="/analyze" style={{ textDecoration: "none" }}>
                    <button
                      className="fs font-bold transition-all"
                      style={{
                        background: "#c8ff00",
                        color: "#080808",
                        border: "none",
                        borderRadius: 12,
                        padding: "12px 24px",
                        fontSize: 14,
                        cursor: "pointer",
                      }}
                    >
                      Start Fact-Checking →
                    </button>
                  </a>
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 12 }}
                >
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
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          className="analysis-card rounded-2xl transition-all duration-200 relative overflow-hidden"
                          style={{
                            background: "#0d0d0d",
                            border: "1px solid #161616",
                            padding: "24px 24px",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "#242424";
                            e.currentTarget.style.background = "#0f0f0f";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "#161616";
                            e.currentTarget.style.background = "#0d0d0d";
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: 3,
                              background: vc.color,
                              borderRadius: "2px 0 0 2px",
                            }}
                          />

                          <div style={{ paddingLeft: 16 }}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className="fm flex items-center gap-2 rounded-lg"
                                  style={{
                                    background: vc.bg,
                                    border: `1px solid ${vc.border}`,
                                    padding: "4px 10px",
                                  }}
                                >
                                  <span
                                    style={{
                                      width: 5,
                                      height: 5,
                                      borderRadius: "50%",
                                      background: vc.color,
                                      display: "inline-block",
                                    }}
                                  />
                                  <span
                                    className="font-bold tracking-[1.5px] uppercase"
                                    style={{ fontSize: 10, color: vc.color }}
                                  >
                                    {vc.label}
                                  </span>
                                </div>
                                <div
                                  className="fm"
                                  style={{
                                    fontSize: 11,
                                    color: "#555",
                                    background: "#141414",
                                    border: "1px solid #1e1e1e",
                                    padding: "3px 10px",
                                    borderRadius: 20,
                                  }}
                                >
                                  Score {item.score ?? "—"}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className="fm"
                                  style={{ fontSize: 11, color: "#555" }}
                                >
                                  {date}
                                </span>
                                <span
                                  className="card-arrow"
                                  style={{ color: "#c8ff00" }}
                                >
                                  →
                                </span>
                              </div>
                            </div>

                            <p
                              className="font-medium mb-3"
                              style={{
                                fontSize: 14,
                                color: "#ccc",
                                lineHeight: 1.6,
                              }}
                            >
                              {item.article
                                ? `"${item.article.slice(0, 140)}${item.article.length > 140 ? "..." : ""}"`
                                : "No article content"}
                            </p>

                            {claims.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {claims.slice(0, 2).map((c, ci) => (
                                  <div
                                    key={ci}
                                    className="flex items-center gap-2 rounded-lg"
                                    style={{
                                      background: "#111",
                                      border: "1px solid #1e1e1e",
                                      padding: "5px 10px",
                                    }}
                                  >
                                    <span
                                      className="fm font-bold"
                                      style={{
                                        fontSize: 9,
                                        color: "#c8ff00",
                                        letterSpacing: 1,
                                      }}
                                    >
                                      0{ci + 1}
                                    </span>
                                    <span
                                      className="fm"
                                      style={{ fontSize: 11, color: "#888" }}
                                    >
                                      {c.trim().slice(0, 55)}
                                      {c.trim().length > 55 ? "..." : ""}
                                    </span>
                                  </div>
                                ))}
                                {claims.length > 2 && (
                                  <div
                                    className="fm"
                                    style={{
                                      fontSize: 11,
                                      color: "#444",
                                      padding: "5px 10px",
                                    }}
                                  >
                                    +{claims.length - 2} more
                                  </div>
                                )}
                              </div>
                            )}

                            {item.resources?.length > 0 && (
                              <div className="flex items-center gap-2 mt-3">
                                <svg
                                  width="12"
                                  height="12"
                                  fill="none"
                                  stroke="#555"
                                  strokeWidth="1.5"
                                  viewBox="0 0 24 24"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="M2 12h20" />
                                </svg>
                                <span
                                  className="fm"
                                  style={{ fontSize: 11, color: "#555" }}
                                >
                                  {item.resources.length} sources retrieved
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/*  PROFILE   */}
          {activeTab === "profile" && (
            <div
              className="fade-in"
              style={{ padding: "48px 48px", maxWidth: 900, margin: "0 auto" }}
            >
              <div className="mb-10">
                <div
                  className="fm mb-2"
                  style={{
                    fontSize: 10,
                    color: "#444",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  — Account
                </div>
                <h1
                  className="font-extrabold tracking-tight"
                  style={{
                    fontSize: 32,
                    letterSpacing: -1.5,
                    color: "#f0ede8",
                  }}
                >
                  Profile
                </h1>
                <p style={{ fontSize: 14, color: "#666", marginTop: 6 }}>
                  Your Veridex account details and activity summary.
                </p>
              </div>

              <div
                className="rounded-3xl relative overflow-hidden mb-5"
                style={{
                  background: "#0d0d0d",
                  border: "1px solid #1e1e1e",
                  padding: "40px 40px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: -120,
                    right: -120,
                    width: 400,
                    height: 400,
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle,rgba(200,255,0,0.04) 0%,transparent 65%)",
                    pointerEvents: "none",
                  }}
                />

                <div className="flex items-center gap-8">
                  <div
                    className="flex items-center justify-center rounded-3xl font-extrabold flex-shrink-0 relative"
                    style={{
                      width: 88,
                      height: 88,
                      background: "linear-gradient(135deg,#1a1a1a,#242424)",
                      border: "1px solid #2a2a2a",
                      fontSize: 32,
                      color: "#c8ff00",
                    }}
                  >
                    {initials}
                    <div
                      className="pulse-dot absolute"
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: "#c8ff00",
                        border: "2px solid #080808",
                        bottom: 4,
                        right: 4,
                        boxShadow: "0 0 8px #c8ff00",
                      }}
                    />
                  </div>

                  <div className="flex-1">
                    <h2
                      className="font-extrabold mb-1"
                      style={{
                        fontSize: 26,
                        letterSpacing: -1,
                        color: "#f0ede8",
                      }}
                    >
                      {firstName} {lastName}
                    </h2>
                    <p
                      className="fm mb-5"
                      style={{ fontSize: 13, color: "#666" }}
                    >
                      {email}
                    </p>

                    <div className="flex gap-3">
                      {[
                        {
                          label: "Account Status",
                          value: "Active",
                          color: "#00e676",
                        },
                        {
                          label: "Total Scans",
                          value: totalScans,
                          color: "#f0ede8",
                        },
                        {
                          label: "Avg Fake Score",
                          value: `${avgScore}%`,
                          color: "#ff8800",
                        },
                      ].map(({ label, value, color }) => (
                        <div
                          key={label}
                          className="rounded-2xl"
                          style={{
                            background: "#111",
                            border: "1px solid #1e1e1e",
                            padding: "14px 18px",
                          }}
                        >
                          <div
                            className="font-bold"
                            style={{ fontSize: 18, color, letterSpacing: -0.5 }}
                          >
                            {value}
                          </div>
                          <div
                            className="fm mt-1"
                            style={{
                              fontSize: 10,
                              color: "#555",
                              letterSpacing: 1,
                              textTransform: "uppercase",
                            }}
                          >
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5">
                {[
                  {
                    label: "Fake claims detected",
                    value: fakeCount,
                    color: "#ff4444",
                    bg: "rgba(255,68,68,0.06)",
                    border: "rgba(255,68,68,0.15)",
                    icon: "🚫",
                  },
                  {
                    label: "Misleading content found",
                    value: misleadCount,
                    color: "#ff8800",
                    bg: "rgba(255,136,0,0.06)",
                    border: "rgba(255,136,0,0.15)",
                    icon: "⚠️",
                  },
                  {
                    label: "Real claims verified",
                    value: realCount,
                    color: "#00e676",
                    bg: "rgba(0,230,118,0.06)",
                    border: "rgba(0,230,118,0.15)",
                    icon: "✅",
                  },
                ].map(({ label, value, color, bg, border, icon }) => (
                  <div
                    key={label}
                    className="rounded-2xl"
                    style={{
                      background: bg,
                      border: `1px solid ${border}`,
                      padding: "24px 20px",
                    }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 12 }}>{icon}</div>
                    <div
                      className="font-extrabold"
                      style={{
                        fontSize: 36,
                        letterSpacing: -2,
                        color,
                        lineHeight: 1,
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#999",
                        marginTop: 8,
                        lineHeight: 1.5,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="rounded-2xl"
                style={{
                  background: "#0d0d0d",
                  border: "1px solid #161616",
                  padding: "24px 28px",
                }}
              >
                <div
                  className="fm mb-4"
                  style={{
                    fontSize: 10,
                    color: "#444",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Account Information
                </div>
                {[
                  { label: "Full Name", value: `${firstName} ${lastName}` },
                  { label: "Email", value: email },
                  { label: "Account", value: "Free tier · Unlimited scans" },
                  {
                    label: "Data policy",
                    value:
                      "Your articles are never shared or used for training",
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex items-start justify-between py-4"
                    style={{ borderBottom: "1px solid #141414" }}
                  >
                    <span
                      className="fm"
                      style={{ fontSize: 12, color: "#555" }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#ccc",
                        maxWidth: 320,
                        textAlign: "right",
                        lineHeight: 1.5,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="rounded-2xl mt-5"
                style={{
                  background: "rgba(255,68,68,0.04)",
                  border: "1px solid rgba(255,68,68,0.12)",
                  padding: "24px 28px",
                }}
              >
                <div
                  className="fm mb-1"
                  style={{
                    fontSize: 10,
                    color: "#ff4444",
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  Danger Zone
                </div>
                <p style={{ fontSize: 13, color: "#666", marginBottom: 16 }}>
                  Sign out of your Veridex account on this device.
                </p>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="fs font-bold flex items-center gap-2 transition-all"
                  style={{
                    background: "rgba(255,68,68,0.1)",
                    border: "1px solid rgba(255,68,68,0.2)",
                    color: "#ff4444",
                    borderRadius: 12,
                    padding: "11px 20px",
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,68,68,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,68,68,0.1)";
                  }}
                >
                  {loggingOut ? (
                    <svg
                      className="spin"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="rgba(255,68,68,0.3)"
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
                      width="14"
                      height="14"
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
                  {loggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
