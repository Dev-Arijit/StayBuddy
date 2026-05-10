import { useState, useEffect } from "react";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    totalViews: 0,
    totalContacts: 0,
    occupancyRate: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/properties/owner/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          const properties = result.data;
          const totalViews = properties.reduce((sum, p) => sum + (p.views || 0), 0);
          const totalContacts = properties.reduce((sum, p) => sum + (p.contactClicks || 0), 0);
          setStats({
            totalProperties: properties.length,
            totalViews,
            totalContacts,
            occupancyRate: properties.length > 0 ? Math.round((totalContacts / Math.max(totalViews, 1)) * 100) : 0
          });
          setRecentActivity(properties.slice(0, 5).map(p => ({
            id: p._id, title: p.title,
            views: p.views || 0, contacts: p.contactClicks || 0, price: p.price
          })));
        }
      })
      .catch(err => console.error(err));
  }, []);

  const statCards = [
    { label: "Occupancy Rate", value: `${stats.occupancyRate}%`, icon: "donut_large", color: "text-primary", bgColor: "bg-primary/10", badge: "+2.4%", badgeColor: "text-tertiary" },
    { label: "Total Revenue", value: `₹${(stats.totalContacts * 1500).toLocaleString()}`, icon: "account_balance_wallet", color: "text-tertiary", bgColor: "bg-tertiary/10", badge: "+12%", badgeColor: "text-tertiary" },
    { label: "Active Listings", value: stats.totalProperties, icon: "apartment", color: "text-primary", bgColor: "bg-primary/10", badge: "Stable", badgeColor: "text-on-surface-variant" },
    { label: "Pending Requests", value: `0${stats.totalContacts}`, icon: "pending_actions", color: "text-error", bgColor: "bg-error/10", badge: "-4%", badgeColor: "text-error" }
  ];

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const barHeights = [65, 80, 55, 90, 75, 95, 70];
  const barHeightsPrev = [50, 60, 45, 70, 60, 75, 55];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Dashboard Overview</h1>
          <p className="text-on-surface-variant text-sm mt-1">Welcome back. Here is what is happening with your properties today.</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <button className="btn-secondary text-xs flex items-center gap-1.5">
            <span className="material-icons-round text-sm">calendar_today</span>
            Last 30 Days
          </button>
          <button className="btn-primary text-xs flex items-center gap-1.5">
            <span className="material-icons-round text-sm">download</span>
            Export Report
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-surface-container rounded-xl border border-outline-variant p-5 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 ${card.bgColor} rounded-lg flex items-center justify-center`}>
                <span className={`material-icons-round ${card.color}`}>{card.icon}</span>
              </div>
              <span className={`text-xs font-medium ${card.badgeColor}`}>{card.badge}</span>
            </div>
            <p className="text-xs text-on-surface-variant uppercase tracking-wider">{card.label}</p>
            <p className={`text-2xl font-bold text-on-surface mt-1`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
        {/* Occupancy Trends */}
        <div className="lg:col-span-3 bg-surface-container rounded-xl border border-outline-variant p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-on-surface tracking-tight">Occupancy Trends</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-primary rounded-full" /> Current</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-primary/30 rounded-full" /> Previous</span>
            </div>
          </div>
          <div className="flex items-end gap-3 h-44">
            {days.map((day, i) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex items-end gap-1 justify-center" style={{ height: '140px' }}>
                  <div className="w-3 bg-primary/30 rounded-t transition-all duration-500" style={{ height: `${barHeightsPrev[i]}%` }} />
                  <div className="w-3 bg-primary rounded-t transition-all duration-500 hover:bg-primary/80" style={{ height: `${barHeights[i]}%` }} />
                </div>
                <span className="text-[10px] text-on-muted uppercase">{day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Mix */}
        <div className="lg:col-span-2 bg-surface-container rounded-xl border border-outline-variant p-6">
          <h2 className="text-lg font-semibold text-on-surface tracking-tight mb-6">Revenue Mix</h2>
          <div className="space-y-5">
            {[
              { label: "Student Housing", pct: 60, color: "bg-primary" },
              { label: "Corporate Suites", pct: 27, color: "bg-tertiary" },
              { label: "Short-term Rentals", pct: 13, color: "bg-[#fb923c]" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-on-surface-variant">{item.label}</span>
                  <span className="text-on-surface font-medium">{item.pct}%</span>
                </div>
                <div className="w-full bg-outline-variant rounded-full h-1.5">
                  <div className={`${item.color} h-1.5 rounded-full transition-all duration-700`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6 pt-5 border-t border-outline-variant">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-on-muted">Avg Daily Rate</p>
              <p className="text-lg font-bold text-on-surface">₹{stats.totalProperties > 0 ? Math.round((stats.totalContacts * 1500) / 30).toLocaleString() : "0"}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-on-muted">RevPAR</p>
              <p className="text-lg font-bold text-on-surface">₹{stats.totalProperties > 0 ? Math.round((stats.totalContacts * 1200) / 30).toLocaleString() : "0"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-on-surface tracking-tight">Recent Activity</h2>
            <button className="text-primary text-xs font-medium hover:underline">View all History</button>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-on-surface-variant text-sm">No activity yet. Add properties to get started.</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface border border-outline-variant">
                  <div className="w-8 h-8 bg-tertiary/10 rounded-full flex items-center justify-center shrink-0">
                    <span className="material-icons-round text-tertiary text-base">check_circle</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-on-surface truncate">{item.title}</p>
                    <p className="text-xs text-on-muted">{item.views} views · {item.contacts} contacts</p>
                  </div>
                  <span className="text-xs text-on-muted shrink-0">3h ago</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Listing Performance */}
        <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-on-surface tracking-tight">Listing Performance</h2>
            <span className="badge-available text-[10px] font-semibold px-2 py-0.5 rounded-md">Top Performer</span>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-on-surface-variant text-sm">No data available yet.</p>
          ) : (
            <>
              <div className="bg-surface rounded-xl border border-outline-variant p-6 text-center mb-4">
                <p className="text-xs uppercase tracking-[0.2em] text-on-muted mb-1">Premium</p>
                <p className="text-xl font-bold text-on-surface tracking-wider">{recentActivity[0]?.title || "STUDIO"}</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Rating", value: "4.8" },
                  { label: "Enquiries", value: stats.totalContacts },
                  { label: "Vacancy", value: "0" },
                ].map((metric) => (
                  <div key={metric.label} className="bg-surface rounded-lg border border-outline-variant p-3 text-center">
                    <p className="text-lg font-bold text-on-surface">{metric.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-on-muted">{metric.label}</p>
                  </div>
                ))}
              </div>
              <button className="btn-secondary w-full mt-4 text-sm">Manage Listing Settings</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
