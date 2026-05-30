import React from "react";
import AnalysisReportView from "@/components/AnalysisReportView";
import { getAnalysisById } from "@/app/actions/analysis.actions";

export default async function AnalysisDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const response = await getAnalysisById(id);
  const data = response?.analysis;

  if (!data) {
    return (
      <div className="min-h-screen bg-[#070709] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="text-[#333] mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#f0ede8]">
            Report Unavailable
          </h2>
          <p className="text-sm text-neutral-500 max-w-sm mx-auto">
            This analysis item could not be found or has been permanently
            removed from our servers.
          </p>
        </div>
      </div>
    );
  }

  return <AnalysisReportView data={data} />;
}
