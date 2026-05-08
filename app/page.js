import React from "react";
import { createAnalysis } from "./actions/analysis.actions";

const page = () => {
  const handleTest = async () => {
    const result = await createAnalysis({
      article: "Government announced free laptops for students",
    });
    console.log(result);
  };
  return <div> <button onClick={handleTest}>Test pipeline</button></div>;
};

export default page;
