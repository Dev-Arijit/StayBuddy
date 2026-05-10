import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const res = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      const result = await res.json();
      if (result.success) setSaved(true);
      else alert(result.message || "Failed to update profile");
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "N/A";

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-1">My Profile</h1>
      <p className="text-sm text-on-surface-variant mb-8">
        Manage your account information and preferences.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Form */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
          <h2 className="text-lg font-semibold text-on-surface mb-5 tracking-tight flex items-center gap-2">
            <span className="material-icons-round text-primary">person</span>
            Profile Information
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">
                Full Name
              </label>
              <input
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="input-base w-full text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                className="input-base w-full text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">
                Phone
              </label>
              <input
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="input-base w-full text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            {saved && (
              <p className="text-tertiary text-sm flex items-center gap-1">
                <span className="material-icons-round text-base">check_circle</span>
                Profile updated successfully
              </p>
            )}
          </form>
        </div>

        {/* Account Info & Notifications */}
        <div className="space-y-6">
          <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
            <h2 className="text-lg font-semibold text-on-surface mb-4 tracking-tight flex items-center gap-2">
              <span className="material-icons-round text-primary">admin_panel_settings</span>
              Account
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-outline-variant">
                <span className="text-sm text-on-surface-variant">Role</span>
                <span className="badge-occupied text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  {user?.role || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-outline-variant">
                <span className="text-sm text-on-surface-variant">Account Status</span>
                <span className="badge-available text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-surface border border-outline-variant">
                <span className="text-sm text-on-surface-variant">Member Since</span>
                <span className="text-sm text-on-surface font-medium">{memberSince}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
            <h2 className="text-lg font-semibold text-on-surface mb-5 tracking-tight flex items-center gap-2">
              <span className="material-icons-round text-primary">notifications</span>
              Notification Preferences
            </h2>
            <div className="space-y-4">
              <NotifToggle label="Email notifications for bookings" defaultOn={true} />
              <NotifToggle label="SMS alerts for contact requests" defaultOn={true} />
              <NotifToggle label="Weekly activity summary" defaultOn={false} />
              <NotifToggle label="Marketing and promotional emails" defaultOn={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotifToggle({ label, defaultOn }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-on-surface-variant">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-colors relative ${
          on ? "bg-primary" : "bg-outline-variant"
        }`}
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full absolute top-1 transition-transform shadow-sm ${
            on ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
