"use client";
import { useState } from "react";
import { register } from "../actions/auth.actions";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [input, setInput] = useState({ firstname:"", lastname:"", email:"", password:"" });
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
      const payload = {
        fullname: { firstname: input.firstname, lastname: input.lastname },
        email: input.email,
        password: input.password,
      };
      const res = await register(payload);
      if (res?.error) setError(res.error);
      else if (res?.success) router.push("/");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    background:"#0f0f0f",
    border:`1px solid ${focused===name?"#c8ff00":"#1e1e1e"}`,
    borderRadius:14,
    padding:"14px 16px",
    fontSize:14,
    fontFamily:"inherit",
    color:"#f0ede8",
    outline:"none",
    width:"100%",
    transition:"all 0.2s",
    boxShadow:focused===name?"0 0 0 3px rgba(200,255,0,0.06)":"none",
  });

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
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .card { animation: fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        .glow-pulse { animation: glow 3s ease-in-out infinite; }
        .spinner { animation: spin 0.8s linear infinite; }
        .field-row { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
        .scan { animation: scanline 4s linear infinite; }
        .float-card { animation: float 6s ease-in-out infinite; }
        ::placeholder { color: #2a2a2a !important; }
      `}</style>

      <div className="fs min-h-screen bg-[#080808] flex overflow-hidden">

        <div className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12" style={{background:"#0a0a0a",borderRight:"1px solid #161616"}}>

          <div className="scan absolute left-0 right-0 h-[2px] pointer-events-none" style={{background:"linear-gradient(90deg,transparent,rgba(200,255,0,0.06),transparent)",zIndex:1}}/>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>
          <div className="glow-pulse absolute" style={{top:-200,right:-200,width:600,height:600,borderRadius:"50%",background:"radial-gradient(circle,rgba(200,255,0,0.06) 0%,transparent 65%)",pointerEvents:"none"}}/>

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
              What you get
            </div>
            <h2 className="font-extrabold leading-[1.05] mb-6" style={{fontSize:"clamp(32px,4vw,48px)",letterSpacing:-2,color:"#f0ede8"}}>
              Your personal<br/>
              <span style={{color:"#c8ff00"}}>truth engine.</span>
            </h2>

            <div className="float-card rounded-2xl relative overflow-hidden" style={{background:"#0f0f0f",border:"1px solid rgba(255,68,68,0.3)",padding:"20px 24px"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#ff4444,#ff444460,transparent)"}}/>
              <div className="flex items-center gap-2 mb-3">
                <span style={{width:7,height:7,borderRadius:"50%",background:"#ff4444",display:"inline-block",boxShadow:"0 0 8px #ff4444"}}/>
                <span className="fm font-bold tracking-[2px] uppercase" style={{fontSize:11,color:"#ff4444"}}>FAKE</span>
              </div>
              <p className="font-bold mb-3" style={{fontSize:14,color:"#f0ede8",lineHeight:1.5}}>"5G towers are causing the spread of new viruses"</p>
              <p className="fm" style={{fontSize:11,color:"#666",lineHeight:1.6}}>No peer-reviewed study supports this. WHO, CDC, and ICMR have explicitly refuted the claim...</p>
              <div className="flex gap-4 mt-4">
                {[["95","Fake score"],["5","Credibility"],["18","Sources"]].map(([v,l])=>(
                  <div key={l}>
                    <div className="font-bold" style={{fontSize:20,color:"#ff4444",letterSpacing:-1}}>{v}</div>
                    <div className="fm" style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:1}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-10">
            <div style={{borderLeft:"2px solid #1e1e1e",paddingLeft:16}}>
              <p className="fm" style={{fontSize:12,color:"#555",lineHeight:1.7,fontStyle:"italic"}}>
                "Join thousands verifying claims<br/>before they share them."
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative overflow-y-auto">
          <div className="absolute inset-0 pointer-events-none" style={{backgroundImage:"linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)",backgroundSize:"48px 48px"}}/>

          <div className="lg:hidden mb-10 text-center">
            <div className="fs font-extrabold tracking-tight" style={{fontSize:22,color:"#f0ede8"}}>
              Veri<span style={{color:"#c8ff00"}}>dex</span>
            </div>
          </div>

          <div className="card w-full" style={{maxWidth:460}}>

            <div className="mb-10">
              <div className="fm text-[10px] tracking-[3px] uppercase mb-3" style={{color:"#555"}}>— New account</div>
              <h1 className="font-extrabold tracking-tight mb-2" style={{fontSize:32,letterSpacing:-1.5,color:"#f0ede8"}}>Create account</h1>
              <p style={{fontSize:14,color:"#666"}}>
                Already have one?{" "}
                <a href="/login" style={{color:"#c8ff00",fontWeight:600,textDecoration:"none"}}>Sign in</a>
              </p>
            </div>
            {error && (
              <div className="mb-6 rounded-2xl flex items-center gap-3" style={{background:"rgba(255,68,68,0.08)",border:"1px solid rgba(255,68,68,0.2)",padding:"14px 16px"}}>
                <span style={{width:6,height:6,borderRadius:"50%",background:"#ff4444",display:"inline-block",flexShrink:0,boxShadow:"0 0 8px #ff4444"}}/>
                <span className="fm" style={{fontSize:12,color:"#ff6666"}}>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="field-row grid grid-cols-2 gap-4 mb-5" style={{animationDelay:"0.05s"}}>
                <div>
                  <label className="fm block mb-2 uppercase tracking-[2px]" style={{fontSize:10,color:focused==="firstname"?"#c8ff00":"#555"}}>First name</label>
                  <input value={input.firstname} name="firstname" type="text" required placeholder="John"
                    onChange={handleChange} onFocus={()=>setFocused("firstname")} onBlur={()=>setFocused("")}
                    style={inputStyle("firstname")}/>
                </div>
                <div>
                  <label className="fm block mb-2 uppercase tracking-[2px]" style={{fontSize:10,color:focused==="lastname"?"#c8ff00":"#555"}}>Last name</label>
                  <input value={input.lastname} name="lastname" type="text" required placeholder="Doe"
                    onChange={handleChange} onFocus={()=>setFocused("lastname")} onBlur={()=>setFocused("")}
                    style={inputStyle("lastname")}/>
                </div>
              </div>
              <div className="field-row mb-5" style={{animationDelay:"0.1s"}}>
                <label className="fm block mb-2 uppercase tracking-[2px]" style={{fontSize:10,color:focused==="email"?"#c8ff00":"#555"}}>Email address</label>
                <input value={input.email} name="email" type="email" required placeholder="john@example.com"
                  onChange={handleChange} onFocus={()=>setFocused("email")} onBlur={()=>setFocused("")}
                  style={inputStyle("email")}/>
              </div>

              <div className="field-row mb-2" style={{animationDelay:"0.15s"}}>
                <label className="fm block mb-2 uppercase tracking-[2px]" style={{fontSize:10,color:focused==="password"?"#c8ff00":"#555"}}>Password</label>
                <div className="relative">
                  <input value={input.password} name="password" type={showPass?"text":"password"} required placeholder="Min. 8 characters"
                    onChange={handleChange} onFocus={()=>setFocused("password")} onBlur={()=>setFocused("")}
                    style={{...inputStyle("password"),paddingRight:48}}/>
                  <button type="button" onClick={()=>setShowPass(!showPass)}
                    style={{position:"absolute",right:16,top:"50%",transform:"translateY(-50%)",color:showPass?"#c8ff00":"#444",background:"none",border:"none",cursor:"pointer",padding:0,transition:"color 0.2s"}}>
                    {showPass ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>

                {input.password.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[0,1,2,3].map(i=>(
                      <div key={i} className="flex-1 rounded-full transition-all duration-300" style={{height:3,background:input.password.length>i*3?(input.password.length<6?"#ff4444":input.password.length<10?"#ff8800":"#c8ff00"):"#1e1e1e"}}/>
                    ))}
                    <span className="fm ml-2" style={{fontSize:10,color:input.password.length<6?"#ff4444":input.password.length<10?"#ff8800":"#c8ff00"}}>
                      {input.password.length<6?"Weak":input.password.length<10?"Fair":"Strong"}
                    </span>
                  </div>
                )}
              </div>
              <div className="field-row mb-8 mt-5" style={{animationDelay:"0.2s"}}>
                <p className="fm" style={{fontSize:11,color:"#444",lineHeight:1.7}}>
                  By creating an account you agree to our{" "}
                  <a href="/terms" style={{color:"#666",textDecoration:"none"}}>Terms</a>
                  {" "}and{" "}
                  <a href="/privacy" style={{color:"#666",textDecoration:"none"}}>Privacy Policy</a>.
                </p>
              </div>
              <div className="field-row" style={{animationDelay:"0.25s"}}>
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
                      Creating account...
                    </>
                  ) : "Create account →"}
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px" style={{background:"#161616"}}/>
              <span className="fm" style={{fontSize:10,color:"#333",letterSpacing:2,textTransform:"uppercase"}}>Free forever</span>
              <div className="flex-1 h-px" style={{background:"#161616"}}/>
            </div>

            <div className="flex items-center justify-center gap-6">
              {[["🔒","Secure"],["🌐","Real-time"],["⚡","Instant"]].map(([icon,label])=>(
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