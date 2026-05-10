import { useState, useEffect } from "react";

export default function Revenue() {
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0, monthlyRevenue: 0, pendingPayments: 0, properties: []
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/properties/owner/me", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(result => {
        if (result.success && result.data) {
          const properties = result.data;
          const monthlyRevenue = properties.reduce((sum, p) => sum + (p.price || 0), 0);
          setRevenueData({
            totalRevenue: monthlyRevenue * 6,
            monthlyRevenue,
            pendingPayments: Math.round(monthlyRevenue * 0.15),
            properties: properties.map(p => ({ id: p._id, title: p.title, price: p.price, contacts: p.contactClicks || 0 }))
          });
        }
      })
      .catch(err => console.error(err));
  }, []);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const mockHeights = [60, 85, 45, 90, 75, 100];

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Revenue</h1>
          <p className="text-sm text-on-surface-variant mt-1">Track your earnings and payment history.</p>
        </div>
        <button className="btn-primary text-xs flex items-center gap-1.5 mt-4 md:mt-0">
          <span className="material-icons-round text-sm">download</span>
          Download Report
        </button>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Revenue (6mo)", value: `₹${revenueData.totalRevenue.toLocaleString()}`, icon: "trending_up", color: "text-tertiary", bg: "bg-tertiary/10" },
          { label: "Monthly Revenue", value: `₹${revenueData.monthlyRevenue.toLocaleString()}`, icon: "account_balance_wallet", color: "text-primary", bg: "bg-primary/10" },
          { label: "Pending Payments", value: `₹${revenueData.pendingPayments.toLocaleString()}`, icon: "pending", color: "text-error", bg: "bg-error/10" },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container rounded-xl border border-outline-variant p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-on-muted uppercase tracking-wider">{s.label}</span>
              <div className={`w-8 h-8 ${s.bg} rounded-lg flex items-center justify-center`}>
                <span className={`material-icons-round text-base ${s.color}`}>{s.icon}</span>
              </div>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-surface-container rounded-xl border border-outline-variant p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-on-surface tracking-tight">Revenue Trend</h2>
          <div className="flex items-center gap-2 text-xs text-on-muted">
            <span className="w-2.5 h-2.5 bg-primary rounded-full" /> Monthly Income
          </div>
        </div>
        <div className="flex items-end gap-4 h-44">
          {months.map((month, i) => {
            const height = revenueData.monthlyRevenue > 0 ? mockHeights[i % mockHeights.length] : 20;
            return (
              <div key={month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex justify-center" style={{ height: '130px' }}>
                  <div
                    className="w-full max-w-10 bg-linear-to-t from-primary/60 to-primary rounded-t-lg transition-all duration-500 hover:from-primary/80 hover:to-primary cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-[10px] text-on-muted uppercase">{month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Revenue by Property */}
      <div className="bg-surface-container rounded-xl border border-outline-variant p-6">
        <h2 className="text-lg font-semibold text-on-surface mb-4 tracking-tight">Revenue by Property</h2>
        {revenueData.properties.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-icons-round text-3xl text-on-muted mb-2 block">bar_chart</span>
            <p className="text-on-surface-variant text-sm">No properties found. Add properties to track revenue.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {revenueData.properties.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-surface border border-outline-variant hover:border-outline transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <span className="material-icons-round text-primary text-base">apartment</span>
                  </div>
                  <div>
                    <p className="text-on-surface text-sm font-medium">{p.title}</p>
                    <p className="text-on-muted text-xs">{p.contacts} contact clicks</p>
                  </div>
                </div>
                <span className="text-primary font-semibold text-sm">₹{p.price?.toLocaleString()}/mo</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
