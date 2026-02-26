import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Info, Phone, Plane, UtensilsCrossed, Calendar, Menu, X } from "lucide-react";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium uppercase tracking-wide transition-colors hover:translate-y-[-1px] transition-transform
   ${isActive ? "text-black" : "text-gray-700 hover:text-gray-500"}`;

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Left */}
        <div className="hidden items-center gap-5 lg:gap-10 md:flex">
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
          className="font-serif text-3xl text-center font-black uppercase tracking-wide text-black sm:text-4xl"
        >
          Perfect Guide
        </NavLink>

        {/* Right */}
        <div className="hidden items-center gap-5 lg:gap-10 md:flex ">
          <NavLink to="/tourism" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Plane className="h-5 w-5" /> Tourism
            </span>
          </NavLink>

          <NavLink to="/delights" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <UtensilsCrossed className="h-5 w-5" /> Delights
            </span>
          </NavLink>

          <NavLink to="/tripplan" className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" /> Trip Plan
            </span>
          </NavLink>
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
        <div className="border-t border-gray-200 bg-white md:hidden ">
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
              ABOUT
            </span>
          </NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} className={navLinkClass}>
            <span className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              CONTACT US
            </span>
          </NavLink>

            <hr />

            <NavLink to="/tourism" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Plane className="h-5 w-5" /> Tourism
              </span>
            </NavLink>

            <NavLink to="/delights" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <UtensilsCrossed className="h-5 w-5" /> Delights
              </span>
            </NavLink>

            <NavLink to="/fancy" onClick={() => setOpen(false)} className={navLinkClass}>
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" /> Trip Plan
              </span>
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
}
