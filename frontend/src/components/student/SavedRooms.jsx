import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function SavedRooms() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (result.success) setWishlist(result.data.wishlist);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, [token]);

  const removeFromWishlist = async (propertyId) => {
    try {
      await fetch(`http://localhost:5000/api/users/wishlist/${propertyId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist((prev) => prev.filter((p) => p._id !== propertyId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-1">Saved Rooms</h1>
      <p className="text-sm text-on-surface-variant mb-8">
        Properties you&apos;ve saved for later. Click to view details.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
              <div className="h-40 skeleton" />
              <div className="p-4 space-y-3">
                <div className="h-5 skeleton w-3/4" />
                <div className="h-4 skeleton w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="bg-surface-container rounded-xl border border-outline-variant p-12 text-center">
          <span className="material-icons-round text-4xl text-on-muted mb-3 block">
            bookmark_border
          </span>
          <h3 className="text-lg font-medium text-on-surface mb-1">No saved rooms</h3>
          <p className="text-on-surface-variant text-sm mb-4">
            Browse listings and click the heart icon to save rooms here.
          </p>
          <Link to="/listings" className="btn-primary text-sm">
            Explore Listings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.map((property) => (
            <div
              key={property._id}
              className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden group hover:border-outline transition-colors"
            >
              {/* Image */}
              <div className="relative h-40 bg-surface">
                {property.images && property.images[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="material-icons-round text-3xl text-on-muted">image</span>
                  </div>
                )}
                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(property._id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-error/80 transition-colors"
                >
                  <span className="material-icons-round text-error text-lg">favorite</span>
                </button>
                {/* Price badge */}
                <span className="absolute bottom-3 right-3 bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-lg">
                  ₹{property.price?.toLocaleString()}/mo
                </span>
              </div>

              {/* Details */}
              <div className="p-4">
                <Link
                  to={`/property/${property._id}`}
                  className="text-on-surface font-semibold tracking-tight hover:text-primary transition-colors"
                >
                  {property.title}
                </Link>
                <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                  <span className="material-icons-round text-xs">location_on</span>
                  {property.location}
                </p>
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-outline-variant">
                  <span className="text-xs text-on-muted flex items-center gap-1">
                    <span className="material-icons-round text-xs">group</span>
                    {property.capacity || "—"}
                  </span>
                  {property.amenities && property.amenities.length > 0 && (
                    <span className="text-xs text-on-muted">
                      {property.amenities.length} amenities
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
