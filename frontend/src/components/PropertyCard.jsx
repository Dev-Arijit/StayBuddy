import { Link } from "react-router-dom";

function PropertyCard({
  property,
  showActions = false,
  onDelete,
  onEdit,
  variant = "default" // "default" | "managed"
}) {

  const statusMap = {
    available: { label: "Available", class: "badge-available" },
    occupied: { label: "Occupied", class: "badge-occupied" },
    maintenance: { label: "Maintenance", class: "badge-maintenance" },
  };

  const status = statusMap[property.status] || statusMap.available;

  return (
    <div className="bg-white rounded-xl border border-outline-variant overflow-hidden card-hover group">

      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop"}
          alt={property.title}
          className="h-52 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Price Badge */}
        <span className="absolute top-3 right-3 bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-lg">
          ₹{property.price?.toLocaleString()}/mo
        </span>

        {/* Status Badge */}
        {variant === "managed" && (
          <span className={`absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md ${status.class}`}>
            {status.label}
          </span>
        )}

        {/* New listing badge for public cards */}
        {variant === "default" && property.isNew && (
          <span className="absolute top-3 left-3 badge-available text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md">
            New Listing
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Title & Rating */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-semibold text-on-surface tracking-tight leading-snug">
            {property.title}
          </h2>
          {property.rating && (
            <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium shrink-0">
              <span className="material-icons-round text-sm">star</span>
              {property.rating}
            </span>
          )}
        </div>

        {/* Location */}
        <p className="text-on-surface-variant text-sm mt-1 flex items-center gap-1">
          <span className="material-icons-round text-sm">location_on</span>
          {property.location}
        </p>

        {/* Amenity chips */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {property.amenities.slice(0, 3).map((a, i) => (
              <span
                key={i}
                className="text-[10px] text-on-surface-variant bg-surface-bright px-2 py-0.5 rounded border border-outline-variant"
              >
                {a}
              </span>
            ))}
          </div>
        )}

        {/* Managed variant: specs */}
        {variant === "managed" && (
          <div className="flex items-center gap-4 mt-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-icons-round text-sm">bed</span>
              {property.capacity || "1 Sharing"}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons-round text-sm">visibility</span>
              {property.views || 0}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons-round text-sm">call</span>
              {property.contactClicks || 0}
            </span>
          </div>
        )}

        {/* Default: View Details */}
        {!showActions && variant === "default" && (
          <Link
            to={`/property/${property._id}`}
            className="block mt-4 text-center btn-secondary text-sm"
          >
            View Details
          </Link>
        )}

        {/* Owner actions */}
        {showActions && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(property)}
              className="flex-1 btn-secondary text-sm"
            >
              Manage Room
            </button>
            <button
              onClick={() => onDelete(property._id)}
              className="flex-1 text-sm bg-red-50 text-error py-2 rounded-lg border border-red-200 hover:bg-red-100 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyCard;