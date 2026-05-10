import { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import DashboardOverview from "../components/dashboard/DashboardOverview";
import OwnerProperties from "../components/dashboard/OwnerProperties";
import AddPropertyForm from "../components/dashboard/AddPropertyForm";
import Bookings from "../components/dashboard/Bookings";
import Revenue from "../components/dashboard/Revenue";
import ProfilePage from "../components/dashboard/ProfilePage";

export default function OwnerDashboard() {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialTab = params.get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { key: "overview",   label: "Overview",       icon: "dashboard" },
    { key: "properties", label: "Properties",     icon: "apartment" },
    { key: "bookings",   label: "Bookings",       icon: "event_note" },
    { key: "revenue",    label: "Revenue",        icon: "payments" },
    { key: "profile",    label: "Profile",        icon: "person" },
  ];

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">Management</h2>
        <p className="text-xs text-on-muted mt-0.5">StayBuddy Admin</p>
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

      {/* Add Property CTA */}
      <button
        onClick={() => setActiveTab("add")}
        className="btn-primary w-full mt-4 flex items-center justify-center gap-2 text-sm py-3"
      >
        <span className="material-icons-round text-base">add</span>
        Add New Property
      </button>

      {/* Bottom */}
      <div className="border-t border-outline-variant pt-4 mt-4 space-y-1">
        <button
          onClick={() => window.open("mailto:support@staybuddy.com")}
          className="flex items-center gap-3 w-full text-left p-3 rounded-lg text-on-surface-variant hover:bg-surface-bright hover:text-on-surface transition-colors text-sm"
        >
          <span className="material-icons-round text-lg">help_outline</span>
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
      {activeTab === "overview" && <DashboardOverview />}
      {activeTab === "properties" && <OwnerProperties onAddProperty={() => setActiveTab("add")} />}
      {activeTab === "add" && <AddPropertyForm />}
      {activeTab === "bookings" && <Bookings />}
      {activeTab === "revenue" && <Revenue />}
      {activeTab === "profile" && <ProfilePage />}
    </DashboardLayout>
  );
}