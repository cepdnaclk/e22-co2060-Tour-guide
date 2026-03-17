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
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left */}
        <div className="hidden items-center gap-5 md:flex lg:gap-10">
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
        </div>

        {/* Center Logo */}
        <NavLink
          to="/"
          className="font-serif text-center text-3xl font-black uppercase tracking-wide text-black sm:text-4xl"
        >
          Perfect Guide
        </NavLink>

        {/* Right */}
        <div className="hidden items-center gap-5 md:flex lg:gap-10">
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

          <NavLink to="/tripplan" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Trip Plan
            </span>
          </NavLink>

          {!currentUser ? (
            <>
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
            </>
          ) : (
            <div className="flex items-center gap-4">
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

        {/* Mobile Toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-gray-200 bg-white md:hidden">
          <div className="flex flex-col gap-4 px-4 py-6">
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <span className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Home
              </span>
            </NavLink>

            <NavLink
              to="/about"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <span className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                About
              </span>
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <span className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Us
              </span>
            </NavLink>

            <hr />

            <NavLink
              to="/tourism"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <span className="flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Tourism
              </span>
            </NavLink>

            <NavLink
              to="/explore"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <span className="flex items-center gap-2">
                <Backpack className="h-5 w-5" />
                Explore
              </span>
            </NavLink>

            <NavLink
              to="/tripplan"
              onClick={() => setOpen(false)}
              className={navLinkClass}
            >
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Trip Plan
              </span>
            </NavLink>

            <hr />

            {!currentUser ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setOpen(false)}
                  className={navLinkClass}
                >
                  <span className="flex items-center gap-2">
                    <LogIn className="h-5 w-5" />
                    Login
                  </span>
                </NavLink>

                <NavLink
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className={navLinkClass}
                >
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