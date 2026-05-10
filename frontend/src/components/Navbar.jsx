import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Discover" },
    { to: "/listings", label: "Listings" },
    ...(user ? [{ to: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <nav className="glass-nav sticky top-0 z-50 border-b border-outline-variant px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Brand */}
        <Link to="/" className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-primary">StayBuddy</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors pb-1 ${
                isActive(link.to)
                  ? "text-primary border-b-2 border-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {!user && (
            <>
              <Link to="/login" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary text-sm">
                Register
              </Link>
            </>
          )}

          {user && (
            <div className="flex items-center gap-3">
              <button className="text-on-surface-variant hover:text-on-surface transition-colors relative">
                <span className="material-icons-round text-xl">notifications</span>
              </button>
              <ProfileDropdown />
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-on-surface-variant"
        >
          <span className="material-icons-round text-2xl">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pb-4 border-t border-outline-variant pt-4 animate-slide-down space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm py-2 px-3 rounded-lg ${
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-on-surface-variant hover:bg-surface-bright"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!user && (
            <div className="flex gap-3 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary text-sm flex-1 text-center">Login</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary text-sm flex-1 text-center">Register</Link>
            </div>
          )}
          {user && (
            <div className="pt-2 px-3">
              <ProfileDropdown />
            </div>
          )}
        </div>
      )}
    </nav>
  );
}