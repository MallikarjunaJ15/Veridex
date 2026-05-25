"use client";
import { useState } from "react";
import { register } from "../actions/auth.actions";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const Signup = () => {
  const [input, setInput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });

  const router = useRouter();

  const [view, setView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formdata = {
        fullname: {
          firstname: input.firstname,
          lastname: input.lastname,
        },
        email: input.email,
        password: input.password,
      };

      const apiresponse = await register(formdata);
      if (apiresponse?.success) {
        router.push("/");
      }
    } catch (error) {
      console.error("Signup failed:", error);
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
              Join the Truth Engine
            </h1>
            <p className="text-sm text-zinc-400">
              Create your account to start verifying claims instantly.
            </p>
          </div>

          <form onSubmit={handlePost} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  First Name
                </label>
                <input
                  onChange={onChangeHandler}
                  value={input.firstname}
                  name="firstname"
                  type="text"
                  required
                  placeholder="John"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Last Name
                </label>
                <input
                  onChange={onChangeHandler}
                  value={input.lastname}
                  name="lastname"
                  type="text"
                  required
                  placeholder="Doe"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                onChange={onChangeHandler}
                value={input.email}
                name="email"
                type="email"
                required
                placeholder="john@example.com"
                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c8ff00] focus:ring-1 focus:ring-[#c8ff00] transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  onChange={onChangeHandler}
                  value={input.password}
                  name="password"
                  type={view ? "text" : "password"}
                  required
                  placeholder="••••••••"
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
              className="w-full mt-4 bg-[#c8ff00] text-black font-bold text-sm py-4 rounded-xl hover:bg-[#d4ff33] hover:shadow-[0_0_20px_rgba(200,255,0,0.3)] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                  Creating Account...
                </>
              ) : (
                "Create Account →"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-white hover:text-[#c8ff00] transition-colors font-semibold no-underline"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
