import { useState, useEffect } from "react";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/bookings/owner", {
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

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await res.json();
      if (result.success) {
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? result.data : b))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const statusConfig = {
    confirmed: { class: "badge-available", icon: "check_circle" },
    pending: { class: "badge-pending", icon: "schedule" },
    completed: { class: "badge-occupied", icon: "task_alt" },
    cancelled: { class: "badge-maintenance", icon: "cancel" },
  };

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((s, b) => s + (b.amount || 0), 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Bookings</h1>
          <p className="text-sm text-on-surface-variant mt-1">Manage booking requests and track tenant schedules.</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="btn-secondary text-xs flex items-center gap-1.5">
            <span className="material-icons-round text-sm">filter_list</span>
            Filter
          </button>
          <button className="btn-primary text-xs flex items-center gap-1.5">
            <span className="material-icons-round text-sm">download</span>
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Bookings", value: bookings.length, icon: "event_note", color: "text-primary", bg: "bg-primary/10" },
          { label: "Active", value: bookings.filter((b) => b.status === "confirmed").length, icon: "check_circle", color: "text-tertiary", bg: "bg-tertiary/10" },
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: "payments", color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container rounded-xl border border-outline-variant p-5 flex items-center gap-4">
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

      {/* Table */}
      <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 skeleton rounded-lg" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center">
            <span className="material-icons-round text-4xl text-on-muted mb-3 block">event_busy</span>
            <h3 className="text-lg font-medium text-on-surface mb-1">No bookings yet</h3>
            <p className="text-on-surface-variant text-sm">When students book your properties, they&apos;ll appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant">
                  {["Property", "Tenant", "Check-in", "Check-out", "Amount", "Status", "Actions"].map((h) => (
                    <th key={h} className="text-left p-4 text-[10px] uppercase tracking-wider text-on-muted font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const sc = statusConfig[booking.status] || statusConfig.pending;
                  return (
                    <tr key={booking._id} className="border-b border-outline-variant last:border-b-0 hover:bg-surface transition-colors">
                      <td className="p-4 text-on-surface text-sm font-medium">{booking.property?.title || "—"}</td>
                      <td className="p-4">
                        <p className="text-on-surface text-sm">{booking.tenant?.name || "—"}</p>
                        <p className="text-on-muted text-xs">{booking.tenant?.email || ""}</p>
                      </td>
                      <td className="p-4 text-on-surface-variant text-sm">
                        {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4 text-on-surface-variant text-sm">
                        {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : "—"}
                      </td>
                      <td className="p-4 text-primary text-sm font-medium">₹{(booking.amount || 0).toLocaleString()}/mo</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider ${sc.class}`}>
                          <span className="material-icons-round text-xs">{sc.icon}</span>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4">
                        {booking.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateStatus(booking._id, "confirmed")}
                              className="text-tertiary text-xs font-medium hover:underline"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(booking._id, "cancelled")}
                              className="text-error text-xs font-medium hover:underline"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {booking.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(booking._id, "completed")}
                            className="text-primary text-xs font-medium hover:underline"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
