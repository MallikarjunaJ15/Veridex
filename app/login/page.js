"use client";
import { useState } from "react";
import { loginUser } from "../actions/auth.actions";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const [view, setView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setServerError("");

    try {
      const response = await loginUser(input);

      if (response?.error) {
        setServerError(response.error);
      } else if (response?.success) {
        router.push("/");
      }
    } catch (error) {
      setServerError("An unexpected authentication error occurred.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c8ff00] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#0c0c0e]/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-zinc-400">
              Access the Veridex portal to check live data.
            </p>
          </div>

          {serverError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400 font-medium">
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                value={input.email}
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                onChange={handleChange}
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-xs text-zinc-500 hover:text-[#c8ff00] transition-colors"
                >
                  Forgot?
                </a>
              </div>
              <div className="relative flex items-center">
                <input
                  value={input.password}
                  name="password"
                  type={view ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl pl-4 pr-12 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setView(!view)}
                  className="absolute right-4 text-zinc-500 hover:text-white transition-colors focus:outline-none"
                >
                  {view ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-[#c8ff00] text-black font-bold text-sm py-4 rounded-xl hover:bg-[#d4ff33] hover:shadow-[0_0_20px_rgba(200,255,0,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Sign In →"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              New to Veridex?{" "}
              <a
                href="/register"
                className="text-white hover:text-[#c8ff00] transition-colors font-semibold no-underline"
              >
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
