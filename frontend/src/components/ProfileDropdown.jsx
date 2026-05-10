import { useState, useRef, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProfileDropdown() {
  const { user, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  if (!user) return null;

  const menuItems = [
    { label: "My Dashboard", icon: "dashboard", to: "/dashboard" },
    { label: "Explore", icon: "explore", to: "/" },
    { label: "My Profile", icon: "person", to: "/dashboard?tab=profile" },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold group-hover:bg-primary/20 transition-colors">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <span className="material-icons-round text-on-surface-variant text-base group-hover:text-on-surface transition-colors">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-64 bg-white border border-outline-variant rounded-xl shadow-xl overflow-hidden animate-slide-down z-50">
          {/* User info header */}
          <div className="p-4 border-b border-outline-variant bg-surface-bright">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-on-surface truncate">{user.name}</p>
                <p className="text-xs text-on-muted truncate">{user.email}</p>
              </div>
            </div>
            <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md badge-available">
              {user.role}
            </span>
          </div>

          {/* Menu items */}
          <div className="p-2">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-on-surface-variant hover:bg-surface-bright hover:text-on-surface transition-colors"
              >
                <span className="material-icons-round text-lg">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-outline-variant">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-error hover:bg-red-50 transition-colors w-full text-left"
            >
              <span className="material-icons-round text-lg">logout</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
