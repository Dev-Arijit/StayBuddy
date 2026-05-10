import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allProperties, setAllProperties] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch(`http://localhost:5000/api/properties/${id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success) setProperty(result.data);
        setLoading(false);
        if (token) {
          fetch(`http://localhost:5000/api/users/recent/${id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` }
          }).catch(err => console.error(err));
        }
      })
      .catch((err) => { console.error(err); setLoading(false); });

    // Fetch similar properties
    fetch("http://localhost:5000/api/properties")
      .then(res => res.json())
      .then(result => { if (result.success) setAllProperties(result.data); })
      .catch(() => {});
  }, [id]);

  const toggleWishlist = async () => {
    if (!token) { alert("Login to save properties"); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/users/wishlist/${property._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.success) alert("Wishlist updated");
    } catch (err) { console.error(err); }
  };

  const contactOwner = async () => {
    try {
      await fetch(`http://localhost:5000/api/properties/${property._id}/contact`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } catch (err) { console.error(err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-8 animate-fade-in">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 skeleton mb-4" />
          <div className="h-80 skeleton rounded-xl mb-4" />
          <div className="flex gap-3 mb-8">
            {[1,2,3].map(i => <div key={i} className="h-20 w-28 skeleton rounded-lg" />)}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 w-3/4 skeleton" />
              <div className="h-4 w-1/2 skeleton" />
              <div className="h-32 w-full skeleton mt-4" />
            </div>
            <div className="h-72 w-full skeleton rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-icons-round text-5xl text-error mb-3 block">error_outline</span>
          <h2 className="text-xl font-semibold text-on-surface">Property Not Found</h2>
          <Link to="/listings" className="text-primary text-sm mt-2 inline-block hover:underline">← Back to Listings</Link>
        </div>
      </div>
    );
  }

  const similarProperties = allProperties.filter(p => p._id !== property._id).slice(0, 3);

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="badge-available text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
            {property.capacity || "Studio Suite"}
          </span>
          <span className="text-on-surface-variant text-sm flex items-center gap-1">
            <span className="material-icons-round text-sm">location_on</span>
            {property.location}
          </span>
        </div>

        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
            {property.title}
          </h1>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary transition-colors">
              <span className="material-icons-round text-lg">share</span>
            </button>
            <button
              onClick={toggleWishlist}
              className="w-9 h-9 rounded-lg border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-red-400 hover:border-red-400 transition-colors"
            >
              <span className="material-icons-round text-lg">favorite_border</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="md:col-span-2 space-y-6">

            {/* Main Image */}
            <div className="relative rounded-xl overflow-hidden">
              <img
                src={property.images?.[activeImage]}
                alt="main"
                className="w-full h-80 object-cover"
              />
              <span className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm">
                {activeImage + 1} of {property.images?.length || 1} Photos
              </span>
            </div>

            {/* Thumbnails */}
            {property.images?.length > 1 && (
              <div className="flex gap-2">
                {property.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt="thumb"
                    onClick={() => setActiveImage(index)}
                    className={`h-16 w-24 object-cover rounded-lg cursor-pointer border-2 transition-colors ${
                      activeImage === index ? "border-primary" : "border-outline-variant hover:border-on-muted"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl border border-outline-variant p-6">
              <h2 className="text-lg font-semibold text-on-surface tracking-tight flex items-center gap-2 mb-4">
                <span className="material-icons-round text-primary">description</span>
                Description
              </h2>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                {property.description || "Experience premium student living in this beautifully maintained space. Designed for focused students who value comfort and convenience."}
              </p>

              {/* Room Specs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-outline-variant">
                {[
                  { icon: "bed", label: "Room Type", value: property.capacity || "Private" },
                  { icon: "local_parking", label: "Parking", value: "Available" },
                  { icon: "event", label: "Lease", value: "12 Months" },
                  { icon: "wifi", label: "WiFi Speed", value: "100 Mbps" },
                ].map((spec) => (
                  <div key={spec.label} className="text-center">
                    <span className="material-icons-round text-on-muted text-lg block mb-1">{spec.icon}</span>
                    <p className="text-[10px] uppercase tracking-wider text-on-muted">{spec.label}</p>
                    <p className="text-sm font-medium text-on-surface">{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities & House Rules */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-outline-variant p-6">
                <h2 className="text-lg font-semibold text-on-surface tracking-tight flex items-center gap-2 mb-4">
                  <span className="material-icons-round text-primary">verified</span>
                  Amenities
                </h2>
                <div className="space-y-2.5">
                  {(property.amenities?.length > 0 ? property.amenities : ["High-Speed WiFi", "Air Conditioning", "In-unit Laundry"]).map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-icons-round text-tertiary text-base">check_circle</span>
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-outline-variant p-6">
                <h2 className="text-lg font-semibold text-on-surface tracking-tight flex items-center gap-2 mb-4">
                  <span className="material-icons-round text-error">gavel</span>
                  House Rules
                </h2>
                <div className="space-y-2.5">
                  {["No smoking indoors", "Quiet hours 10PM - 8AM", "No overnight guests", "No sub-letting", "Maintain weekly cleaning"].map((rule, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <span className="material-icons-round text-on-muted text-base">rule</span>
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-white rounded-xl border border-outline-variant p-6">
              <h2 className="text-lg font-semibold text-on-surface tracking-tight flex items-center gap-2 mb-4">
                <span className="material-icons-round text-primary">map</span>
                Map/Location
              </h2>
              <p className="text-sm text-on-surface-variant mb-3 flex items-center gap-1">
                <span className="material-icons-round text-sm">pin_drop</span>
                {property.location}
              </p>
              <div className="w-full h-48 bg-surface-bright rounded-xl border border-outline-variant flex items-center justify-center">
                <span className="text-on-muted text-sm">Map integration coming soon</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - Booking Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-outline-variant p-6 sticky top-20 shadow-sm">
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-3xl font-bold text-on-surface">₹{property.price?.toLocaleString()}</span>
                <span className="text-on-surface-variant text-sm">/month</span>
              </div>
              <span className="badge-available text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md inline-block mb-4">
                Available
              </span>

              {/* Move-in & Duration */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1">Move-in Date</label>
                  <div className="input-base flex items-center gap-2 text-sm cursor-pointer">
                    <span className="material-icons-round text-on-muted text-base">calendar_today</span>
                    <span>Select date</span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1">Lease Duration</label>
                  <select className="input-base w-full text-sm">
                    <option>6 Months</option>
                    <option>12 Months</option>
                  </select>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="border-t border-outline-variant pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Security Deposit</span>
                  <span className="text-on-surface">₹{(property.price || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Broker Fee</span>
                  <span className="text-on-surface">₹0</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Security Deposit</span>
                  <span className="text-tertiary">Included</span>
                </div>
                <div className="flex justify-between text-sm font-semibold pt-2 border-t border-outline-variant">
                  <span className="text-on-surface-variant">Total Due Now</span>
                  <span className="text-primary">₹{((property.price || 0) * 2).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={contactOwner}
                className="btn-primary w-full mt-5 py-3 text-sm"
              >
                Book Room
              </button>
              <p className="text-[10px] text-on-muted text-center mt-2">Free cancellation within 24 hours of booking</p>

              {/* Owner */}
              <div className="border-t border-outline-variant mt-5 pt-4">
                <p className="text-[10px] uppercase tracking-wider text-on-muted mb-2">Managed By</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                      {property.owner?.name?.charAt(0) || "R"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{property.owner?.name || "Property Manager"}</p>
                      <p className="text-xs text-on-muted">{property.owner?.phone || "Verified Owner"}</p>
                    </div>
                  </div>
                  <button className="text-primary text-xs font-medium hover:underline">Message</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Rooms */}
        {similarProperties.length > 0 && (
          <section className="mt-12 pt-8 border-t border-outline-variant">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-xl font-bold text-on-surface tracking-tight">Similar Rooms nearby</h2>
                <p className="text-sm text-on-surface-variant mt-1">Based on location and preferences</p>
              </div>
              <Link to="/listings" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                View all results <span className="material-icons-round text-base">arrow_forward</span>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {similarProperties.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}