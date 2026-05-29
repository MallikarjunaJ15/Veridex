import React from "react";
import { getUserHistory } from "../actions/analysis.actions";
import { getme } from "../actions/auth.actions";
import DashboardClientView from "@/components/DashboardClientView";

const DashboardPage = async () => {
  const [userRes, historyRes] = await Promise.all([getme(), getUserHistory()]);
  const user = userRes?.user || null;
  const analysis = historyRes?.analysis || [];
  console.log(analysis)
  return <DashboardClientView user={user} analysis={analysis} />;
};

export default DashboardPage;
