"use client";
import { logoutUser } from "@/app/actions/auth.actions";
import Link from "next/link";
import React, { useState } from "react";

export default function DashboardClientView({ user, analysis }) {
  const [activeTab, setActiveTab] = useState("analysis");
  const handleLogout = async () => {
    await logoutUser();
    console.log("Logging out...");
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex text-[#f0ede8] font-sans selection:bg-[#c8ff00] selection:text-black">
      <aside className="w-64 border-r border-white/[0.06] flex flex-col justify-between bg-[#080808]/50 backdrop-blur-xl">
        <div>
          <div className="px-8 py-8">
            <a href="/">
              <div className="text-2xl font-extrabold tracking-tight">
                Veri<span className="text-[#c8ff00]">dex</span>
              </div>
            </a>
          </div>

          <nav className="flex flex-col gap-2 px-4 mt-4">
            <button
              onClick={() => setActiveTab("analysis")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "analysis"
                  ? "bg-[#c8ff00]/10 text-[#c8ff00] shadow-[inset_0px_1px_0px_0px_rgba(200,255,0,0.1)]"
                  : "text-[#888] hover:text-[#f0ede8] hover:bg-white/[0.02]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analysis History
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === "profile"
                  ? "bg-[#c8ff00]/10 text-[#c8ff00] shadow-[inset_0px_1px_0px_0px_rgba(200,255,0,0.1)]"
                  : "text-[#888] hover:text-[#f0ede8] hover:bg-white/[0.02]"
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profile Settings
            </button>
          </nav>
        </div>
        <div className="p-4 mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/80 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10 lg:p-16">
        <div className="max-w-4xl mx-auto">
          {activeTab === "analysis" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-10">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Your Verifications
                </h1>
                <p className="text-[#888] mt-2 text-sm">
                  Review your past claims and truth analysis.
                </p>
              </header>

              {analysis.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-white/[0.06] border-dashed rounded-2xl bg-white/[0.01]">
                  <div className="w-12 h-12 rounded-full bg-[#c8ff00]/10 flex items-center justify-center mb-4">
                    <svg
                      className="w-6 h-6 text-[#c8ff00]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    No history yet
                  </h3>
                  <p className="text-[#888] text-sm mt-1 mb-6">
                    You haven't verified any claims yet.
                  </p>
                  <a
                    href="/analyze"
                    className="bg-[#c8ff00] text-[#080808] font-bold text-sm px-6 py-2.5 rounded-lg tracking-wide hover:brightness-110 transition-all"
                  >
                    Start Fact-Checking
                  </a>
                </div>
              ) : (
                <div className="grid gap-4">
                  {analysis.map((item, index) => (
                    <Link
                      href={`/dashboard/analysis/${item._id}`}
                      key={item._id || index}
                      className="group p-6 rounded-2xl border border-white/[0.06] bg-[#212124] hover:border-white/[0.12] hover:bg-[#161618] transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#c8ff00] bg-[#c8ff00]/10 px-3 py-1 rounded-full">
                          Analyzed
                        </span>
                        <span className="text-sm text-[#c8ff00] font-mono bg-[#c8ff00]/10 px-3 py-1 rounded-full">
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Just now"}
                        </span>
                      </div>
                      <p className="text-[#f0ede8] font-medium leading-relaxed">
                        {item.claim || "Analysis record..."}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-10">
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Profile Overview
                </h1>
                <p className="text-[#888] mt-2 text-sm">
                  Manage your Veridex account settings.
                </p>
              </header>

              <div className="p-8 rounded-3xl border border-white/[0.06] bg-[#121214] flex items-center gap-8 relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#c8ff00]/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#222] to-[#333] border border-white/10 flex items-center justify-center text-3xl font-bold uppercase shadow-2xl">
                  {user?.fullname?.firstname
                    ? user.fullname.firstname.charAt(0)
                    : "V"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {user?.fullname?.firstname || "Verified User"}
                  </h2>
                  <p className="text-[#888] mt-1">
                    {user?.email || "No email provided"}
                  </p>

                  <div className="mt-6 flex gap-4">
                    <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="block text-xs text-[#888] mb-1">
                        Status
                      </span>
                      <span className="text-sm font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#c8ff00] animate-pulse"></span>
                        Active
                      </span>
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <span className="block text-xs text-[#888] mb-1">
                        Total Scans
                      </span>
                      <span className="text-sm font-medium">
                        {analysis.length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
