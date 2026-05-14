'use client'
import React from "react";
import { createAnalysis } from "./actions/analysis.actions";

const page = () => {
  const handleTest = async () => {
    const result = await createAnalysis({
      article: "Philt joined the RCB Camp and he is available for mathc againt PBKS on 17th may",
    });
    console.log(result);
  };
  return <div> <button onClick={handleTest} className="bg-black text-white">Test pipeline</button></div>;
};

export default page;
