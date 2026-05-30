export function AnalyzingView({ stepIdx }) {
  const STEPS = [
    { id: 1, doing: "Identifying important claims...", done: "Claims identified" },
    { id: 2, doing: "Searching trusted sources...", done: "Sources gathered" },
    { id: 3, doing: "Comparing evidence per claim...", done: "Evidence compared" },
    { id: 4, doing: "Generating verdict...", done: "Analysis complete" },
  ];

  return (
    <>
      <style>{`
        @keyframes scan { 
          0% { transform: translateX(-100%) } 
          100% { transform: translateX(350%) } 
        }
        @keyframes stepPulse { 
          0%, 100% { box-shadow: 0 0 0 0 rgba(200,255,0,0.4) } 
          50% { box-shadow: 0 0 0 8px rgba(200,255,0,0) } 
        }
      `}</style>
      
      <div className="min-h-[80vh] px-6 pt-28 pb-16 max-w-[820px] mx-auto font-sans">
        <div className="font-mono text-[11px] tracking-[3px] uppercase mb-8 text-[#555]">
          — Analyzing your content
        </div>
        
        {STEPS.map((step) => {
          const isDone = stepIdx > step.id;
          const isActive = stepIdx === step.id;
          const isPending = stepIdx < step.id;

          return (
            <div
              key={step.id}
              className={`flex items-start sm:items-center gap-4 sm:gap-5 px-4 sm:px-5 py-5 rounded-xl mb-3 transition-all duration-500 border ${
                isActive
                  ? "border-[#c8ff00]/20 bg-[#c8ff00]/2"
                  : isDone
                  ? "border-[#1e1e1e] bg-transparent"
                  : "border-transparent bg-transparent opacity-20"
              }`}
            >
              <div
                className={`flex items-center justify-center rounded-xl font-mono text-[13px] flex-shrink-0 transition-all duration-300 w-11 h-11 border ${
                  isActive
                    ? "border-[#c8ff00] bg-[#c8ff00]/10 text-[#c8ff00]"
                    : isDone
                    ? "border-[#00e676]/40 bg-[#00e676]/5 text-[#00e676]"
                    : "border-[#222] bg-[#111] text-[#444]"
                }`}
                style={{
                  animation: isActive ? "stepPulse 1.5s infinite" : "none",
                }}
              >
                {isDone ? "✓" : isActive ? "◉" : `0${step.id}`}
              </div>
              
              <div className="flex-1">
                <div className="text-[15px] font-bold mb-1 text-[#f0ede8] font-syne tracking-wide">
                  {isDone ? step.done : step.doing}
                </div>
                <div className="font-mono text-[12px] text-[#666] leading-[1.5]">
                  {isDone 
                    ? `Step successfully completed.` 
                    : isActive 
                    ? `Searching for evidence across trusted sources...` 
                    : `Next step will begin automatically..`}
                </div>
              </div>
            </div>
          );
        })}

        <div className="my-10 overflow-hidden rounded-sm h-[2px] bg-[#111] w-full">
          <div
            className="h-full w-[40%]"
            style={{
              background: "linear-gradient(90deg, transparent, #c8ff00, transparent)",
              animation: "scan 1.5s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </>
  );
}