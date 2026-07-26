import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Info,
  Phone,
  Plane,
  Backpack,
  Calendar,
  Menu,
  X,
  LogIn,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium tracking-wide transition-all duration-250 hover:translate-y-[-1px] ${isActive
    ? "text-brand-pink bg-pink-100/95 border border-pink-200/50 font-semibold"
    : "text-earth-medium hover:text-brand-pink hover:bg-pink-100/40 border border-transparent"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleProtectedClick = (e, path) => {
    if (!currentUser) {
      e.preventDefault();
      setOpen(false);
      navigate("/login", { state: { from: { pathname: path } } });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pink-100/50 bg-pink-50/90 backdrop-blur-md shadow-xs">
      <nav className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:grid md:max-w-[1500px] md:grid-cols-[1fr_auto_1fr]">
        {/* LEFT: Public Links & Chat */}
        <div className="hidden items-center gap-2 md:flex justify-self-end pr-4">
          <NavLink to="/" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </span>
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              About
            </span>
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Contact Us
            </span>
          </NavLink>

          <NavLink
            to="/chat"
            className={navLinkClass}
            onClick={(e) => handleProtectedClick(e, "/chat")}
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </span>
          </NavLink>
        </div>

        {/* CENTER LOGO */}
        <NavLink
          to="/"
          className="font-sans text-2xl font-bold uppercase tracking-wider text-earth-dark md:justify-self-center sm:text-3xl hover:opacity-90 transition-opacity"
        >
          Perfect Guide
        </NavLink>

        {/* RIGHT: Feature Links & Auth Controls */}
        <div className="hidden h-full w-full items-center justify-between gap-4 pl-4 md:flex">
          {/* Main feature links (always visible, protected by click handlers) */}
          <div className="flex h-full items-center gap-2">
            <NavLink
              to="/tourism"
              className={navLinkClass}
              onClick={(e) => handleProtectedClick(e, "/tourism")}
            >
              <span className="flex items-center gap-2">
                <Plane className="h-4 w-4" />
                Tourism
              </span>
            </NavLink>

            <NavLink
              to="/explore"
              className={navLinkClass}
              onClick={(e) => handleProtectedClick(e, "/explore")}
            >
              <span className="flex items-center gap-2">
                <Backpack className="h-4 w-4" />
                Explore
              </span>
            </NavLink>

            <NavLink
              to="/tripplan"
              className={navLinkClass}
              onClick={(e) => handleProtectedClick(e, "/tripplan")}
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Trip Plan
              </span>
            </NavLink>
          </div>

          {/* Auth controls */}
          <div className="flex items-center gap-4">
            {!currentUser ? (
              <NavLink
                to="/login"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-teal hover:bg-teal-700 text-white font-medium text-sm transition-all shadow-xs hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="h-4 w-4" />
                Login / Register
              </NavLink>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand-teal to-teal-700 flex items-center justify-center text-white text-[10px] font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate text-sm font-semibold text-earth-dark">
                    {currentUser.displayName || currentUser.email.split('@')[0]}
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-earth-medium border border-slate-200 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all active:scale-95 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 hover:bg-teal-100/50 text-earth-dark md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-teal-100/50 bg-teal-50/95 backdrop-blur-md shadow-lg md:hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-5 px-5 py-6">
            {/* Public links */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-earth-light uppercase tracking-widest px-2">Public Pages</span>
              <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass}>
                <Home className="h-4 w-4" />
                Home
              </NavLink>

              <NavLink to="/about" onClick={() => setOpen(false)} className={navLinkClass}>
                <Info className="h-4 w-4" />
                About
              </NavLink>

              <NavLink to="/contact" onClick={() => setOpen(false)} className={navLinkClass}>
                <Phone className="h-4 w-4" />
                Contact Us
              </NavLink>

              <NavLink
                to="/chat"
                onClick={(e) => handleProtectedClick(e, "/chat")}
                className={navLinkClass}
              >
                <MessageCircle className="h-4 w-4" />
                Chat
              </NavLink>
            </div>

            <hr className="border-teal-100/50" />

            {/* Features */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-earth-light uppercase tracking-widest px-2">Features</span>
              <NavLink
                to="/tourism"
                onClick={(e) => handleProtectedClick(e, "/tourism")}
                className={navLinkClass}
              >
                <Plane className="h-4 w-4" />
                Tourism
              </NavLink>

              <NavLink
                to="/explore"
                onClick={(e) => handleProtectedClick(e, "/explore")}
                className={navLinkClass}
              >
                <Backpack className="h-4 w-4" />
                Explore
              </NavLink>

              <NavLink
                to="/tripplan"
                onClick={(e) => handleProtectedClick(e, "/tripplan")}
                className={navLinkClass}
              >
                <Calendar className="h-4 w-4" />
                Trip Plan
              </NavLink>
            </div>

            <hr className="border-teal-100/50" />

            {/* Auth controls */}
            <div className="flex flex-col gap-2">
              {!currentUser ? (
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-brand-teal hover:bg-teal-700 text-white font-medium text-sm transition shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  Login / Register
                </NavLink>
              ) : (
                <div className="flex flex-col gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-teal to-teal-700 flex items-center justify-center text-white text-sm font-bold">
                      {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[11px] font-medium text-earth-light uppercase">Logged In As</span>
                      <span className="text-sm font-semibold text-earth-dark truncate">
                        {currentUser.displayName || currentUser.email}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-earth-medium hover:text-red-700 hover:bg-red-50/50 hover:border-red-100 transition cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}