"use client";
import { Menu, X } from "lucide-react";
import React, { useState } from "react";

const NavBar = ({ scrolled, user }) => {
  const [mobileView, setMobileView] = useState(false);

  const navItems = ["How it works", "Examples", "FAQ"];

  const handleScroll = (e, item) => {
    e.preventDefault();
    setMobileView(false);
    const id = item.toLowerCase().replace(/ /g, "-");
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 transition-all duration-300 ${
          scrolled || mobileView
            ? "bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="text-xl font-extrabold tracking-tight text-white select-none">
          Veri<span className="text-[#c8ff00]">dex</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={(e) => handleScroll(e, item)}
              className="text-sm text-[#888] font-medium hover:text-[#f0ede8] transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:block">
          <a href={user ? "/analyze" : "/login"}>
            <button className="bg-[#c8ff00] text-[#080808] font-bold text-sm px-[22px] py-[10px] rounded-lg tracking-wide cursor-pointer hover:brightness-110 transition-all shadow-[0_0_20px_rgba(200,255,0,0.15)]">
              {user ? "Try Veridex →" : "Login →"}
            </button>
          </a>
        </div>

        <button
          onClick={() => setMobileView(!mobileView)}
          className="flex md:hidden items-center justify-center p-2 text-white hover:text-[#c8ff00] transition-colors z-50 focus:outline-none"
          aria-label="Toggle Menu"
        >
          {mobileView ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-[#080808] transform transition-transform duration-300 ease-in-out md:hidden flex flex-col justify-between px-8 pt-28 pb-12 ${
          mobileView ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={(e) => handleScroll(e, item)}
              className="text-2xl text-[#888] font-semibold hover:text-[#c8ff00] transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="w-full">
          <a
            href={user ? "/analyze" : "/login"}
            onClick={() => setMobileView(false)}
          >
            <button className="w-full bg-[#c8ff00] text-[#080808] font-bold text-base py-4 rounded-xl tracking-wide hover:brightness-110 transition-all">
              {user ? "Try Veridex →" : "Login →"}
            </button>
          </a>
        </div>
      </div>
    </>
  );
};

export default NavBar;
