import { useEffect, useState } from "react";
import PropertyCard from "../PropertyCard";
import ConfirmModal from "./ConfirmModal";
import EditPropertyModal from "./EditPropertyModal";

export default function OwnerProperties({ onAddProperty }) {
  const [properties, setProperties] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const token = localStorage.getItem("token");

  const fetchProperties = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/properties/owner/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setProperties(result.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchProperties(); }, []);

  const confirmDelete = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/properties/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (result.success) setProperties((prev) => prev.filter((p) => p._id !== deleteId));
      setDeleteId(null);
    } catch (err) { console.error(err); }
  };

  const saveEdit = async (formData) => {
    const res = await fetch(`http://localhost:5000/api/properties/${editingProperty._id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const result = await res.json();
    if (result.success) {
      setProperties(prev => prev.map(p => p._id === editingProperty._id ? result.data : p));
      setEditingProperty(null);
    }
  };

  const totalRevenue = properties.reduce((s, p) => s + (p.price || 0), 0);
  const totalViews = properties.reduce((s, p) => s + (p.views || 0), 0);

  const miniStats = [
    { label: "Total Assets", value: properties.length, color: "text-on-surface" },
    { label: "Available", value: properties.length, color: "text-tertiary", uppercase: true },
    { label: "Occupancy Rate", value: totalViews > 0 ? `${Math.min(95, Math.round((properties.length / Math.max(totalViews, 1)) * 100 * 10))}%` : "75%", color: "text-on-surface" },
    { label: "Monthly Rev.", value: `₹${totalRevenue.toLocaleString()}`, color: "text-primary", uppercase: true },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface tracking-tight">Managed Properties</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Monitor performance and manage status for your {properties.length} active listings.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary text-xs flex items-center gap-1.5">
            <span className="material-icons-round text-sm">filter_alt</span>
            Status: All
          </button>
          <button className="btn-secondary text-xs flex items-center gap-1.5">
            <span className="material-icons-round text-sm">location_on</span>
            Location
          </button>
          {onAddProperty && (
            <button onClick={onAddProperty} className="btn-primary text-xs flex items-center gap-1.5">
              <span className="material-icons-round text-sm">add</span>
              Add New Property
            </button>
          )}
        </div>
      </div>

      {/* Mini Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {miniStats.map((s) => (
          <div key={s.label} className="bg-surface-container rounded-xl border border-outline-variant p-4">
            <p className={`text-[10px] font-semibold tracking-[0.12em] ${s.uppercase ? s.color : 'text-on-muted'} uppercase`}>{s.label}</p>
            <p className={`text-xl font-bold ${s.color} mt-1`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Property Grid */}
      <div className="grid md:grid-cols-3 gap-5 stagger-children">
        {properties.map((p) => (
          <PropertyCard
            key={p._id}
            property={p}
            variant="managed"
            showActions
            onDelete={() => setDeleteId(p._id)}
            onEdit={() => setEditingProperty(p)}
          />
        ))}
      </div>

      {properties.length === 0 && (
        <div className="text-center py-16">
          <span className="material-icons-round text-5xl text-on-muted mb-3 block">home_work</span>
          <h3 className="text-lg font-medium text-on-surface mb-1">No properties yet</h3>
          <p className="text-on-surface-variant text-sm mb-4">Start by adding your first property.</p>
          {onAddProperty && (
            <button onClick={onAddProperty} className="btn-primary text-sm">Add Property</button>
          )}
        </div>
      )}

      {deleteId && (
        <ConfirmModal
          title="Delete Property"
          message="Are you sure you want to delete this property? This action cannot be undone."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {editingProperty && (
        <EditPropertyModal
          property={editingProperty}
          onClose={() => setEditingProperty(null)}
          onSave={saveEdit}
        />
      )}
    </div>
  );
}