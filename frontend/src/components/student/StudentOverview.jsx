import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function StudentOverview() {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({ wishlist: [], recentlyViewed: [] });
  const [activeBooking, setActiveBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Fetch dashboard data (wishlist + recent)
    fetch("http://localhost:5000/api/users/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setData(result.data);
      })
      .catch((err) => console.error(err));

    // Fetch active booking
    fetch("http://localhost:5000/api/bookings/my", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data.length > 0) {
          const active = result.data.find(
            (b) => b.status === "confirmed" || b.status === "pending"
          );
          if (active) setActiveBooking(active);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-32 skeleton rounded-xl" />
        <div className="h-48 skeleton rounded-xl" />
        <div className="grid grid-cols-2 gap-4">
          <div className="h-28 skeleton rounded-xl" />
          <div className="h-28 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "Student"}.
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              {activeBooking
                ? "Your accommodation status is up to date."
                : "Browse listings to find your perfect room."}
            </p>
          </div>
          {activeBooking && (
            <div className="flex items-center gap-2">
              <span className="badge-available text-[10px] font-semibold uppercase tracking-wider px-3 py-1.5 rounded-lg">
                <span className="material-icons-round text-xs mr-1">verified</span>
                Active Resident
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Active Booking */}
      <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
        <h2 className="text-lg font-semibold text-on-surface tracking-tight mb-4 flex items-center gap-2">
          <span className="material-icons-round text-primary">house</span>
          Active Booking
        </h2>
        {activeBooking ? (
          <div className="bg-surface rounded-xl border border-outline-variant p-5">
            <h3 className="text-on-surface font-semibold tracking-tight">
              {activeBooking.property?.title || "Property"}
            </h3>
            <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
              <span className="material-icons-round text-xs">location_on</span>
              {activeBooking.property?.location || "Location not available"}
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-outline-variant">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-on-muted">Check In</p>
                <p className="text-sm font-medium text-on-surface mt-0.5">
                  {new Date(activeBooking.checkIn).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-on-muted">Rent</p>
                <p className="text-sm font-medium text-on-surface mt-0.5">Monthly</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-on-muted">Amount</p>
                <p className="text-sm font-medium text-primary mt-0.5">
                  ₹{(activeBooking.amount || 0).toLocaleString()}/mo
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="material-icons-round text-3xl text-on-muted mb-2 block">
              home_work
            </span>
            <p className="text-sm text-on-surface-variant">
              No active booking. Browse listings to find your next stay.
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Saved Favorites */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
          <h2 className="text-lg font-semibold text-on-surface tracking-tight mb-4 flex items-center gap-2">
            <span className="material-icons-round text-error">favorite</span>
            Saved Favorites
          </h2>
          {data.wishlist.length === 0 ? (
            <div className="text-center py-6">
              <span className="material-icons-round text-2xl text-on-muted mb-2 block">
                bookmark_border
              </span>
              <p className="text-sm text-on-surface-variant">No saved rooms yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.wishlist.slice(0, 3).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface border border-outline-variant hover:border-outline transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="material-icons-round text-primary text-base">apartment</span>
                    </div>
                    <div>
                      <p className="text-on-surface text-sm font-medium">{p.title}</p>
                      <p className="text-on-muted text-xs">
                        ₹{p.price?.toLocaleString()}/mo
                      </p>
                    </div>
                  </div>
                  <span className="material-icons-round text-error text-lg">favorite</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
          <h2 className="text-lg font-semibold text-on-surface tracking-tight mb-4 flex items-center gap-2">
            <span className="material-icons-round text-tertiary">history</span>
            Recent Activity
          </h2>
          {data.recentlyViewed.length === 0 ? (
            <div className="text-center py-6">
              <span className="material-icons-round text-2xl text-on-muted mb-2 block">
                visibility_off
              </span>
              <p className="text-sm text-on-surface-variant">No recent activity.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.recentlyViewed.slice(0, 4).map((p) => (
                <div
                  key={p._id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-outline-variant"
                >
                  <div className="w-8 h-8 bg-tertiary/10 rounded-lg flex items-center justify-center">
                    <span className="material-icons-round text-tertiary text-sm">visibility</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-on-surface truncate">Viewed: {p.title}</p>
                    <p className="text-xs text-on-muted">{p.location}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
