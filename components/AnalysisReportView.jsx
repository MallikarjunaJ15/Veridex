// app/components/AnalysisReportView.jsx
"use client";

import React from "react";
import Link from "next/link";

export default function AnalysisReportView({ data }) {
  const record = Array.isArray(data) ? data[0] : data;

  const reportId = record?._id || "UNKNOWN_ID";
  const articleText = record?.article || "No input text retrieved";
  const claimText = record?.claim || "No claim extracted";
  const aiExplanation = record?.explanation || "No explanation generated.";
  const verdict = record?.verdict || "unverifiable";
  const score = typeof record?.score === "number" ? record.score : 0;

  const isUnverifiable = verdict === "unverifiable";

  let heroTitle = "This claim checks out.";
  let credibility = isUnverifiable
    ? 0
    : verdict === "real"
      ? 100 - score
      : score;
  let claimVerifiability = isUnverifiable ? 0 : 100 - score;
  let evidenceStrength = isUnverifiable ? 0 : credibility;

  let accentColor = "#c8ff00"; 
  if (isUnverifiable) {
    accentColor = "#a855f7"; // Cyber Purple for subjective queries
    heroTitle = "Query Unverifiable";
  } else if (verdict === "fake") {
    accentColor = "#ef4444"; 
    heroTitle = "Flagged as Misinformation.";
  } else if (verdict === "misleading") {
    accentColor = "#f59e0b"; 
    heroTitle = "Context is Misleading.";
  }

  const rawResources = record?.resources || [];
  const normalizedSources = rawResources.map((urlStr) => {
    try {
      const domain = new URL(urlStr).hostname.replace("www.", "");
      return { name: domain, url: urlStr };
    } catch {
      return { name: "External Reference", url: urlStr };
    }
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#070709",
        color: "#f3f4f6",
        fontFamily: "'Inter', sans-serif",
        padding: "40px 24px",
        display: "flex",
        justifyContent: "center",
        backgroundImage: `radial-gradient(circle at top right, ${accentColor}08, transparent 40%)`,
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .source-card {
          text-decoration: none;
          background: #0e0f12;
          border: 1px solid rgba(255,255,255,0.04);
          padding: 20px;
          border-radius: 16px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 120px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .source-card:hover {
          border-color: ${accentColor}4d !important;
          background: #111317 !important;
          transform: translateY(-2px);
        }
        .back-link {
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 600;
          transition: color 0.2s;
        }
        .back-link:hover {
          color: #fff !important;
        }
      `,
        }}
      />

      <div style={{ width: "100%", maxWidth: "1200px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "3px",
                color: "#666",
              }}
            >
              Report ID
            </span>
            <span
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                padding: "4px 10px",
                borderRadius: "6px",
                fontSize: "12px",
                fontFamily: "monospace",
                color: "#aaa",
              }}
            >
              {reportId}
            </span>
          </div>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #0e0f12 0%, #0a0b0d 100%)",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            borderRadius: "24px",
            padding: "48px",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justify_content: "space-between",
              flexWrap: "wrap",
              gap: "40px",
            }}
          >
            <div style={{ flex: "1", minWidth: "300px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "16px",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: accentColor,
                  }}
                />
                <span
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: accentColor,
                  }}
                >
                  {verdict} DATA ENTRY
                </span>
              </div>
              <h1
                style={{
                  fontSize: "44px",
                  fontWeight: "800",
                  letterSpacing: "-1.5px",
                  lineHeight: "1.1",
                  color: "#fff",
                  margin: "0 0 24px 0",
                }}
              >
                {heroTitle}
              </h1>
              <div
                style={{
                  background: "rgba(255,255,255,0.02)",
                  borderLeft: `3px solid ${accentColor}`,
                  padding: "16px 20px",
                  borderRadius: "0 12px 12px 0",
                  maxWidth: "550px",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontStyle: "italic",
                    color: "#9ca3af",
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  "{articleText}"
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "32px" }}>
              <div
                style={{
                  position: "relative",
                  width: "160px",
                  height: "160px",
                  display: "flex",
                  alignItems: "center",
                  justify_content: "center",
                }}
              >
                <svg
                  width="160"
                  height="160"
                  viewBox="0 0 160 160"
                  style={{ transform: "rotate(-90deg)" }}
                >
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke="rgba(255,255,255,0.03)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="transparent"
                    stroke={accentColor}
                    strokeWidth="8"
                    strokeDasharray={440}
                    strokeDashoffset={
                      isUnverifiable ? 440 : 440 - (440 * credibility) / 100
                    }
                    strokeLinecap="round"
                  />
                </svg>
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    textAlign: "center",
                    left: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: isUnverifiable ? "24px" : "40px",
                      fontWeight: "800",
                      color: "#fff",
                      display: "block",
                      lineHeight: "1",
                    }}
                  >
                    {isUnverifiable ? "N/A" : `${credibility}%`}
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "#6b7280",
                      display: "block",
                      marginTop: "4px",
                    }}
                  >
                    {isUnverifiable ? "Non-Claim" : "Credibility"}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "12px 24px",
                    minWidth: "140px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      color: "#ef4444",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Engine Score
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#f3f4f6",
                    }}
                  >
                    {score}
                  </span>
                </div>
                <div
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "12px 24px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "10px",
                      textTransform: "uppercase",
                      color: "#3b82f6",
                      fontWeight: "600",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    Sources Loaded
                  </span>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "#f3f4f6",
                    }}
                  >
                    {normalizedSources.length} Found
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr",
            gap: "32px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "32px" }}
          >
            <div
              style={{
                background: "#0e0f12",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "20px",
                padding: "32px",
              }}
            >
              <h3
                style={{
                  margin: "0 0 20px 0",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Engine Synthesis Explanation
              </h3>
              <p
                style={{
                  margin: 0,
                  color: "#9ca3af",
                  fontSize: "15px",
                  lineHeight: "1.8",
                }}
              >
                {aiExplanation}
              </p>
            </div>

            <div
              style={{
                background: "#0e0f12",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: "20px",
                padding: "32px",
              }}
            >
              <h4
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  color: "#6b7280",
                }}
              >
                Processed Intent Vector
              </h4>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  background: "rgba(255,255,255,0.01)",
                  border: "1px solid rgba(255,255,255,0.03)",
                  padding: "16px",
                  borderRadius: "12px",
                }}
              >
                <div
                  style={{
                    background: accentColor,
                    color: "#000",
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "11px",
                    fontWeight: "800",
                  }}
                >
                  i
                </div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#e5e7eb",
                  }}
                >
                  {claimText}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: "#0e0f12",
              border: "1px solid rgba(255,255,255,0.05)",
              borderRadius: "20px",
              padding: "32px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3
                style={{
                  margin: "0 0 24px 0",
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Signal Breakdown
              </h3>

              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#9ca3af" }}>Falsity Factor</span>
                  <span style={{ color: "#ef4444", fontWeight: "600" }}>
                    {score}%
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${score}%`,
                      background: "#ef4444",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#9ca3af" }}>Claim Verifiability</span>
                  <span style={{ color: "#f59e0b", fontWeight: "600" }}>
                    {claimVerifiability}%
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${claimVerifiability}%`,
                      background: "#f59e0b",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ color: "#9ca3af" }}>
                    Evidence Cross-Reference Strength
                  </span>
                  <span style={{ color: accentColor, fontWeight: "600" }}>
                    {evidenceStrength}%
                  </span>
                </div>
                <div
                  style={{
                    height: "6px",
                    background: "rgba(255,255,255,0.03)",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${evidenceStrength}%`,
                      background: accentColor,
                    }}
                  />
                </div>
              </div>
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.01)",
                border: `1px dashed ${accentColor}33`,
                padding: "16px",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#777",
                lineHeight: "1.5",
              }}
            >
              💡{" "}
              {isUnverifiable
                ? "Systems bypass automated web scraper tracking when input string contains conversational text parameters rather than factual claims."
                : "Engine matrices note historical cross-referenced consensus maps matching primary directional thesis vectors."}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "48px" }}>
          <h3
            style={{
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#6b7280",
              marginBottom: "16px",
              fontWeight: "700",
            }}
          >
            Retrieved Live Verification Sources
          </h3>
          {normalizedSources.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "16px",
              }}
            >
              {normalizedSources.map((src, idx) => (
                <a
                  href={src.url}
                  key={idx}
                  target="_blank"
                  rel="noreferrer"
                  className="source-card"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#fff",
                      }}
                    >
                      {src.name}
                    </span>
                    <span style={{ color: accentColor, fontSize: "12px" }}>
                      ↗
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#4b5563",
                      wordBreak: "break-all",
                      display: "-webkit-box",
                      WebkitLineClamp: "2",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {src.url}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div
              style={{
                background: "#0e0f12",
                border: "1px dashed rgba(255,255,255,0.05)",
                borderRadius: "16px",
                padding: "40px",
                textAlign: "center",
                color: "#6b7280",
                fontSize: "14px",
              }}
            >
              No external citation sources were requested or compiled for this
              transaction record.
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          }}
        >
          <Link href="/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
          <span
            style={{
              fontSize: "10px",
              color: "#555",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: "700",
            }}
          >
            Veridex RAG Engine v2.0
          </span>
        </div>
      </div>
    </div>
  );
}
