"use client";
import { useState } from "react";
import { loginUser } from "../actions/auth.actions";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focused, setFocused] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(input);
      if (res?.error) setError(res.error);
      else if (res?.success) router.push("/");
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');
        .fs { font-family: 'Syne', sans-serif; }
        .fm { font-family: 'DM Mono', monospace; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{opacity:0.4} 50%{opacity:0.7} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes scanline { 0%{transform:translateY(-100%)} 100%{transform:translateY(400%)} }
        .card { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .glow-pulse { animation: glow 3s ease-in-out infinite; }
        .spinner { animation: spin 0.8s linear infinite; }
        .field-row { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .scan { animation: scanline 4s linear infinite; }
      `}</style>

      <div className="fs min-h-screen bg-[#080808] flex overflow-hidden">

        <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12" style={{background:"#0a0a0a",borderRight:"1px solid #161616"}}>

          <div className="scan absolute left-0 right-0 h-[2px] pointer-events-none" style={{background:"linear-gradient(90deg,transparent,rgba(200,255,0,0.06),transparent)",zIndex:1}}/>

          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>

          <div className="glow-pulse absolute" style={{bottom:-200,left:-200,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,255,0,0.06) 0%,transparent 65%)",pointerEvents:"none"}}/>

          <div className="relative z-10">
            <a href="/" style={{textDecoration:"none",color:"inherit"}}>
              <div className="fs font-extrabold tracking-tight" style={{fontSize:24,color:"#f0ede8"}}>
                Veri<span style={{color:"#c8ff00"}}>dex</span>
              </div>
            </a>
          </div>

          <div className="relative z-10">
            <div className="fm text-[11px] tracking-[3px] uppercase mb-6 flex items-center gap-3" style={{color:"#c8ff00"}}>
              <span style={{width:24,height:1,background:"#c8ff00",opacity:.5,display:"inline-block"}}/>
              Fact Verification System
            </div>
            <h2 className="font-extrabold leading-[1.05] mb-6" style={{fontSize:"clamp(36px,4vw,52px)",letterSpacing:-2,color:"#f0ede8"}}>
              Truth is one<br/>
              <span style={{color:"#c8ff00"}}>paste</span> away.
            </h2>
            <p style={{fontSize:15,color:"#666",lineHeight:1.8,maxWidth:360}}>
              Our RAG AI pipeline retrieves live sources, compares evidence, and explains why something is true, false, or misleading — in under 10 seconds.
            </p>

            <div className="flex gap-8 mt-10">
              {[["94%","Accuracy"],["15+","Live sources"],["<10s","Per analysis"]].map(([n,l])=>(
                <div key={l}>
                  <div className="font-extrabold" style={{fontSize:28,letterSpacing:-1.5,color:"#f0ede8"}}>{n}</div>
                  <div className="fm" style={{fontSize:10,color:"#555",letterSpacing:1,textTransform:"uppercase",marginTop:2}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10">
            <div style={{borderLeft:"2px solid #1e1e1e",paddingLeft:16}}>
              <p className="fm" style={{fontSize:12,color:"#555",lineHeight:1.7,fontStyle:"italic"}}>
                "Don't believe everything you read.<br/>Verify it in seconds."
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

          <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)",backgroundSize:"48px 48px"}}/>

          <div className="lg:hidden mb-10 text-center">
            <div className="fs font-extrabold tracking-tight" style={{fontSize:22,color:"#f0ede8"}}>
              Veri<span style={{color:"#c8ff00"}}>dex</span>
            </div>
          </div>

          <div className="card w-full" style={{maxWidth:440}}>
            <div className="mb-10">
              <div className="fm text-[10px] tracking-[3px] uppercase mb-3" style={{color:"#555"}}>— Welcome back</div>
              <h1 className="font-extrabold tracking-tight mb-2" style={{fontSize:32,letterSpacing:-1.5,color:"#f0ede8"}}>Sign in</h1>
              <p style={{fontSize:14,color:"#666"}}>
                Don't have an account?{" "}
                <a href="/register" style={{color:"#c8ff00",fontWeight:600,textDecoration:"none"}}>Create one free</a>
              </p>
            </div>

            {error && (
              <div className="mb-6 rounded-2xl flex items-center gap-3" style={{background:"rgba(255,68,68,0.08)",border:"1px solid rgba(255,68,68,0.2)",padding:"14px 16px"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#ff4444",display:"inline-block",flexShrink:0,boxShadow:"0 0 8px #ff4444"}}/>
                <span className="fm" style={{fontSize:12,color:"#ff6666"}}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="field-row mb-5" style={{animationDelay:"0.05s"}}>
                <label className="fm block mb-2 uppercase tracking-[2px]" style={{fontSize:10,color:focused==="email"?"#c8ff00":"#555"}}>
                  Email address
                </label>
                <input
                  value={input.email} name="email" type="email" required
                  placeholder="you@example.com"
                  onChange={handleChange}
                  onFocus={()=>setFocused("email")}
                  onBlur={()=>setFocused("")}
                  className="w-full text-[#f0ede8] placeholder:text-[#2a2a2a] outline-none transition-all duration-200"
                  style={{background:"#0f0f0f",border:`1px solid ${focused==="email"?"#c8ff00":"#1e1e1e"}`,borderRadius:14,padding:"14px 16px",fontSize:14,fontFamily:"inherit",boxShadow:focused==="email"?"0 0 0 3px rgba(200,255,0,0.06)":"none"}}
                />
              </div>

              <div className="field-row mb-2" style={{animationDelay:"0.1s"}}>
                <div className="flex justify-between items-center mb-2">
                  <label className="fm uppercase tracking-[2px]" style={{fontSize:10,color:focused==="password"?"#c8ff00":"#555"}}>
                    Password
                  </label>
                  <a href="/forgot-password" className="fm" style={{fontSize:11,color:"#444",textDecoration:"none"}}
                    onMouseEnter={e=>e.target.style.color="#c8ff00"}
                    onMouseLeave={e=>e.target.style.color="#444"}>
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    value={input.password} name="password" type={showPass?"text":"password"} required
                    placeholder="••••••••"
                    onChange={handleChange}
                    onFocus={()=>setFocused("password")}
                    onBlur={()=>setFocused("")}
                    className="w-full text-[#f0ede8] placeholder:text-[#2a2a2a] outline-none transition-all duration-200"
                    style={{background:"#0f0f0f",border:`1px solid ${focused==="password"?"#c8ff00":"#1e1e1e"}`,borderRadius:14,padding:"14px 48px 14px 16px",fontSize:14,fontFamily:"inherit",boxShadow:focused==="password"?"0 0 0 3px rgba(200,255,0,0.06)":"none"}}
                  />
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{color:showPass?"#c8ff00":"#444",background:"none",border:"none",cursor:"pointer",padding:0}}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <div className="field-row mt-8" style={{animationDelay:"0.15s"}}>
                <button type="submit" disabled={loading}
                  className="w-full fs font-bold flex items-center justify-center gap-2 transition-all duration-200"
                  style={{background:loading?"#9eb800":"#c8ff00",color:"#080808",border:"none",borderRadius:14,padding:"15px 24px",fontSize:15,cursor:loading?"not-allowed":"pointer",boxShadow:loading?"none":"0 0 24px rgba(200,255,0,0.2)"}}
                  onMouseEnter={e=>{ if(!loading){ e.currentTarget.style.background="#d4ff33"; e.currentTarget.style.boxShadow="0 0 36px rgba(200,255,0,0.35)"; }}}
                  onMouseLeave={e=>{ if(!loading){ e.currentTarget.style.background="#c8ff00"; e.currentTarget.style.boxShadow="0 0 24px rgba(200,255,0,0.2)"; }}}>
                  {loading ? (
                    <>
                      <svg className="spinner" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.25)" strokeWidth="3"/>
                        <path d="M12 2a10 10 0 0 1 10 10" stroke="#080808" strokeWidth="3" strokeLinecap="round"/>
                      </svg>
                      Authenticating...
                    </>
                  ) : "Sign in →"}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px" style={{background:"#161616"}}/>
              <span className="fm" style={{fontSize:10,color:"#333",letterSpacing:2,textTransform:"uppercase"}}>Veridex</span>
              <div className="flex-1 h-px" style={{background:"#161616"}}/>
            </div>

            <div className="flex items-center justify-center gap-6">
              {[["🔒","Encrypted"],["⚡","Real-time"],["🌐","15+ sources"]].map(([icon,label])=>(
                <div key={label} className="flex items-center gap-2">
                  <span style={{fontSize:12}}>{icon}</span>
                  <span className="fm" style={{fontSize:10,color:"#444",letterSpacing:1,textTransform:"uppercase"}}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}