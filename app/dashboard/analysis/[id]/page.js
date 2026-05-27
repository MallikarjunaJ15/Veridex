// app/dashboard/analysis/[id]/page.jsx
import React from "react";
import AnalysisReportView from "@/components/AnalysisReportView";
import {
  getAnalysisById,
  getUserHistory,
} from "@/app/actions/analysis.actions";

export default async function AnalysisDetailPage({ params }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const response = await getAnalysisById(id);
  const data = response?.analysis;

  if (!data) {
    return (
      <div
        style={{
          color: "#fff",
          padding: "40px",
          backgroundColor: "#070709",
          minHeight: "100vh",
        }}
      >
        Report item not found or has been removed.
      </div>
    );
  }
  return <AnalysisReportView data={data} />;
}
