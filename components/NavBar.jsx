"use client";
import React from "react";

const NavBar = ({ scrolled, user }) => {
  console.log("got the user to navbar", user);
  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-4.5 transition-all duration-300 ${scrolled ? "bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.06]" : "bg-transparent border-b border-transparent"}`}
      >
        <div className="text-xl font-extrabold tracking-tight">
          Veri<span className="text-[#c8ff00]">dex</span>
        </div>
        <div className="flex items-center gap-8">
          {["How it works", "Examples", "FAQ"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/ /g, "-")}`}
              onClick={(e) => {
                e.preventDefault();
                const id = item.toLowerCase().replace(/ /g, "-");
                const el = document.getElementById(id);
                if (el) {
                  const offset = 80; 
                  const top =
                    el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className="text-sm text-[#888] font-medium hover:text-[#f0ede8] transition-colors duration-200"
            >
              {item}
            </a>
          ))}
        </div>
        {user ? (
          <a href="/analyze">
            <button className="bg-[#c8ff00] text-[#080808] font-bold text-sm px-[22px] py-[10px] rounded-lg tracking-wide cursor-pointer border-none hover:brightness-110 transition-all">
              Try Veridex →
            </button>
          </a>
        ) : (
          <a href="/login">
            <button className="bg-[#c8ff00] text-[#080808] font-bold text-sm px-[22px] py-[10px] rounded-lg tracking-wide cursor-pointer border-none hover:brightness-110 transition-all">
              Login →
            </button>
          </a>
        )}
      </nav>
    </>
  );
};

export default NavBar;
