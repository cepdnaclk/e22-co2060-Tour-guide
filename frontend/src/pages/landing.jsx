// src/pages/landing.jsx
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      className="relative min-h-screen w-full bg-cover bg-center flex flex-col justify-between font-sans text-white overflow-hidden"
      style={{ backgroundImage: "url('/landing.jpg')" }}
    >
      {/* Dark overlay for optimal background contrast */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Top Header Navbar */}
      <header className="relative z-10 mx-auto w-full max-w-7xl px-8 py-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center font-bold text-sm text-white">
            PG
          </div>
          <span
            style={{ color: "#ffffff" }}
            className="font-bold text-lg tracking-wider uppercase"
          >
            PERFECT GUIDE
          </span>
        </div>

        {/* Header Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide">
          <button
            onClick={() => navigate("/home")}
            style={{ color: "#ffffff" }}
            className="hover:opacity-80 transition cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/about")}
            style={{ color: "#ffffff" }}
            className="hover:opacity-80 transition cursor-pointer"
          >
            Discover
          </button>
          <button
            onClick={() => navigate("/tourism")}
            style={{ color: "#ffffff" }}
            className="hover:opacity-80 transition cursor-pointer"
          >
            Tourism
          </button>
          <button
            onClick={() => navigate("/explore")}
            style={{ color: "#ffffff" }}
            className="hover:opacity-80 transition cursor-pointer"
          >
            Explore
          </button>
          <button
            onClick={() => navigate("/tripplan")}
            style={{ color: "#ffffff" }}
            className="hover:opacity-80 transition cursor-pointer"
          >
            Trip Plan
          </button>
          <button
            onClick={() => navigate("/contact")}
            style={{ color: "#ffffff" }}
            className="hover:opacity-80 transition cursor-pointer"
          >
            Contact
          </button>
        </nav>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 mx-auto w-full max-w-7xl px-8 py-12 flex-1 flex flex-col justify-center items-center text-center my-auto">
        <div className="max-w-2xl flex flex-col items-center">
          {/* Main Title - Forced Pure White */}
          <h1
            style={{
              color: "#ffffff",
              WebkitTextFillColor: "#ffffff",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
            className="text-5xl sm:text-10xl md:text-6xl font-black uppercase tracking-tight leading-[0.9] mb-6"
          >
            WELCOME TO PERFECT GUIDE <br />
             
          
          </h1>

          {/* Description Paragraph */}
          <p
            style={{ color: "#f8fafc" }}
            className="text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-light drop-shadow text-center"
          >
            Discover the rich heritage, stunning nature, and unique culture of Sri Lanka.
            From emerald tea plantations to pristine coastal waters, plan your unforgettable journey today.
          </p>

          {/* Explore Button */}
          <button
            onClick={() => navigate("/home")}
            style={{ color: "#ffffff" }}
            className="mx-auto px-10 py-3.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/30 font-medium text-base tracking-wide transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-2xl cursor-pointer"
          >
            Explore
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-xs">
        <p style={{ color: "#efe8e6" }}>
          © {new Date().getFullYear()} PERFECT GUIDE. All rights reserved.
        </p>
      </footer>
    </div>
  );
}