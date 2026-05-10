import { useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import StudentOverview from "../components/student/StudentOverview";
import StudentBookings from "../components/student/StudentBookings";
import SavedRooms from "../components/student/SavedRooms";
import ProfilePage from "../components/dashboard/ProfilePage";

export default function StudentDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Support ?tab=profile from dropdown
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { key: "overview", label: "Overview", icon: "dashboard" },
    { key: "bookings", label: "My Bookings", icon: "event" },
    { key: "saved", label: "Saved Rooms", icon: "favorite" },
    { key: "profile", label: "Profile", icon: "person" },
  ];

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Student Portal</h2>
        <p className="text-xs text-on-muted mt-0.5">StayBuddy</p>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors text-sm ${
              activeTab === item.key
                ? "bg-primary/10 text-primary font-medium border border-primary/15"
                : "text-on-surface-variant hover:bg-surface-bright hover:text-on-surface"
            }`}
          >
            <span className="material-icons-round text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-outline-variant pt-4 mt-4 space-y-1">
        {/* User card */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-bright border border-outline-variant mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-on-surface font-medium truncate">{user?.name}</p>
            <p className="text-xs text-on-muted">Student</p>
          </div>
        </div>

        <button
          onClick={() => window.open("mailto:support@staybuddy.com")}
          className="flex items-center gap-3 w-full text-left p-3 rounded-lg text-on-surface-variant hover:bg-surface-bright hover:text-on-surface transition-colors text-sm"
        >
          <span className="material-icons-round text-lg">contact_support</span>
          Support
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full text-left p-3 rounded-lg text-error hover:bg-red-50 transition-colors text-sm"
        >
          <span className="material-icons-round text-lg">logout</span>
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <DashboardLayout sidebar={sidebar}>
      {activeTab === "overview" && <StudentOverview />}
      {activeTab === "bookings" && <StudentBookings />}
      {activeTab === "saved" && <SavedRooms />}
      {activeTab === "profile" && <ProfilePage />}
    </DashboardLayout>
  );
}