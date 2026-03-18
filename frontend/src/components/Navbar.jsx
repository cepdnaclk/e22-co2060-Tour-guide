import { useState } from "react";
import { NavLink } from "react-router-dom";
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
  UserPlus,
  LogOut,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium uppercase tracking-wide transition-colors hover:translate-y-[-1px] transition-transform ${
    isActive ? "text-black" : "text-gray-700 hover:text-gray-500"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-20 items-center justify-between px-4 sm:px-6 md:grid md:max-w-[1500px] md:grid-cols-[1fr_auto_1fr]">
        {/* LEFT */}
        <div className="hidden items-center gap-5 md:flex lg:gap-8 justify-self-end pr-4">
          <NavLink to="/" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Home
            </span>
          </NavLink>

          <NavLink to="/about" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About
            </span>
          </NavLink>

          <NavLink to="/contact" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contact Us
            </span>
          </NavLink>

          {currentUser && (
          <NavLink to="/chat" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat
            </span>
          </NavLink>
          )}
        </div>

        {/* CENTER LOGO */}
        <NavLink
          to="/"
          className="font-serif text-3xl font-black uppercase tracking-wide text-black md:justify-self-center sm:text-4xl"
        >
          Perfect Guide
        </NavLink>

        {/* RIGHT */}
        <div className="relative hidden h-full w-full max-w-[520px] md:flex justify-self-start pl-4">
          {/* Main links */}
          <div className="flex h-full items-center gap-5 lg:gap-8">
            <NavLink to="/tourism" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Tourism
              </span>
            </NavLink>

            <NavLink to="/explore" className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Backpack className="h-5 w-5" />
                Explore
              </span>
            </NavLink>

            {currentUser && (
              <NavLink to="/tripplan" className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Trip Plan
                </span>
              </NavLink>
            )}
          </div>

          {/* Login / Signup pinned to far right */}
          {!currentUser ? (
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-5">
              <NavLink to="/login" className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <LogIn className="h-5 w-5" />
                  Login
                </span>
              </NavLink>

              <NavLink to="/signup" className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Sign Up
                </span>
              </NavLink>
            </div>
          ) : (
            <div className="absolute right-0 top-1/2 flex -translate-y-1/2 items-center gap-4">
              <span className="max-w-[140px] truncate text-sm font-medium text-gray-700">
                {currentUser.displayName || currentUser.email}
              </span>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gray-700 transition hover:text-red-600"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col gap-4 px-4 py-6">
            <NavLink to="/" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Home
              </span>
            </NavLink>

            <NavLink to="/about" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                About
              </span>
            </NavLink>

            <NavLink to="/contact" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Us
              </span>
            </NavLink>

            {currentUser && (
            <NavLink to="/chat" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat
              </span>
            </NavLink>
            )}

            <hr />

            <NavLink to="/tourism" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Tourism
              </span>
            </NavLink>

            <NavLink to="/explore" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Backpack className="h-5 w-5" />
                Explore
              </span>
            </NavLink>

            {currentUser && (
              <NavLink to="/tripplan" onClick={() => setOpen(false)} className={navLinkClass}>
                <span className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Trip Plan
                </span>
              </NavLink>
            )}

            <hr />

            {!currentUser ? (
              <>
                <NavLink to="/login" onClick={() => setOpen(false)} className={navLinkClass}>
                  <span className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Login
                  </span>
                </NavLink>

                <NavLink to="/signup" onClick={() => setOpen(false)} className={navLinkClass}>
                  <span className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Sign Up
                  </span>
                </NavLink>
              </>
            ) : (
              <>
                <div className="text-sm font-medium text-gray-700">
                  {currentUser.displayName || currentUser.email}
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-left text-sm font-medium uppercase tracking-wide text-gray-700 transition hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}