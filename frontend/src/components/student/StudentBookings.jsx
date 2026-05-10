import { useState, useEffect } from "react";

export default function StudentBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) setBookings(result.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const current = bookings.filter((b) => b.status === "confirmed" || b.status === "pending");
  const past = bookings.filter((b) => b.status === "completed" || b.status === "cancelled");

  const totalNights = bookings
    .filter((b) => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => {
      if (b.checkIn && b.checkOut) {
        const diff = new Date(b.checkOut) - new Date(b.checkIn);
        return sum + Math.ceil(diff / (1000 * 60 * 60 * 24));
      }
      return sum;
    }, 0);

  const totalSpent = bookings
    .filter((b) => b.status === "completed" || b.status === "confirmed")
    .reduce((sum, b) => sum + (b.amount || 0), 0);

  const statusConfig = {
    confirmed: { class: "badge-available", icon: "check_circle", label: "Active" },
    pending: { class: "badge-pending", icon: "schedule", label: "Pending" },
    completed: { class: "badge-occupied", icon: "task_alt", label: "Completed" },
    cancelled: { class: "badge-maintenance", icon: "cancel", label: "Cancelled" },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-1">My Bookings</h1>
      <p className="text-sm text-on-surface-variant mb-8">
        View your current stays and booking history.
      </p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 skeleton rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          {/* Current & Upcoming */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-on-surface tracking-tight mb-4 flex items-center gap-2">
              <span className="material-icons-round text-primary">event_available</span>
              Current &amp; Upcoming
            </h2>
            {current.length === 0 ? (
              <div className="bg-surface-container rounded-xl border border-outline-variant p-8 text-center">
                <span className="material-icons-round text-3xl text-on-muted mb-2 block">
                  event_busy
                </span>
                <p className="text-sm text-on-surface-variant">No active bookings.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {current.map((booking) => {
                  const sc = statusConfig[booking.status] || statusConfig.pending;
                  return (
                    <div
                      key={booking._id}
                      className="bg-surface-container rounded-xl border border-outline-variant p-5"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-on-surface font-semibold tracking-tight">
                              {booking.property?.title || "Property"}
                            </h3>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider ${sc.class}`}
                            >
                              <span className="material-icons-round text-xs">{sc.icon}</span>
                              {sc.label}
                            </span>
                          </div>
                          <p className="text-xs text-on-surface-variant flex items-center gap-1">
                            <span className="material-icons-round text-xs">location_on</span>
                            {booking.property?.location || "—"}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-primary font-bold">
                            ₹{(booking.amount || 0).toLocaleString()}
                          </span>
                          {booking.status === "pending" && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="btn-secondary text-xs text-error border-error/30 hover:bg-error/10"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-outline-variant">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-on-muted">Check In</p>
                          <p className="text-sm text-on-surface mt-0.5">
                            {booking.checkIn
                              ? new Date(booking.checkIn).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-on-muted">Check Out</p>
                          <p className="text-sm text-on-surface mt-0.5">
                            {booking.checkOut
                              ? new Date(booking.checkOut).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })
                              : "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-on-muted">Amount Paid</p>
                          <p className="text-sm text-primary font-medium mt-0.5">
                            ₹{(booking.amount || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-on-muted">Owner</p>
                          <p className="text-sm text-on-surface mt-0.5">
                            {booking.owner?.name || "—"}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Bookings */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-on-surface tracking-tight mb-4 flex items-center gap-2">
              <span className="material-icons-round text-on-surface-variant">history</span>
              Past Bookings
            </h2>
            {past.length === 0 ? (
              <div className="bg-surface-container rounded-xl border border-outline-variant p-8 text-center">
                <span className="material-icons-round text-3xl text-on-muted mb-2 block">
                  inbox
                </span>
                <p className="text-sm text-on-surface-variant">No past bookings.</p>
              </div>
            ) : (
              <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-variant">
                        {["Room", "Stay Period", "Status", "Amount"].map((h) => (
                          <th
                            key={h}
                            className="text-left p-4 text-[10px] uppercase tracking-wider text-on-muted font-medium"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {past.map((booking) => {
                        const sc = statusConfig[booking.status] || statusConfig.completed;
                        return (
                          <tr
                            key={booking._id}
                            className="border-b border-outline-variant last:border-b-0 hover:bg-surface transition-colors"
                          >
                            <td className="p-4">
                              <p className="text-on-surface text-sm font-medium">
                                {booking.property?.title || "—"}
                              </p>
                              <p className="text-on-muted text-xs">
                                {booking.property?.location || ""}
                              </p>
                            </td>
                            <td className="p-4 text-on-surface-variant text-sm">
                              {booking.checkIn
                                ? new Date(booking.checkIn).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                : "—"}{" "}
                              -{" "}
                              {booking.checkOut
                                ? new Date(booking.checkOut).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })
                                : "—"}
                            </td>
                            <td className="p-4">
                              <span
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${sc.class}`}
                              >
                                <span className="material-icons-round text-xs">{sc.icon}</span>
                                {sc.label}
                              </span>
                            </td>
                            <td className="p-4 text-primary text-sm font-medium">
                              ₹{(booking.amount || 0).toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Total Nights Stayed", value: `${totalNights} nights`, icon: "dark_mode", color: "text-primary", bg: "bg-primary/10" },
              { label: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, icon: "payments", color: "text-tertiary", bg: "bg-tertiary/10" },
              { label: "Total Bookings", value: bookings.length, icon: "event_note", color: "text-on-surface", bg: "bg-surface-bright" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-surface-container rounded-xl border border-outline-variant p-5 flex items-center gap-4"
              >
                <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                  <span className={`material-icons-round ${s.color}`}>{s.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-on-muted uppercase tracking-wider">{s.label}</p>
                  <p className="text-xl font-bold text-on-surface">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
