import { useState } from "react";
import PropertyCard from "../components/PropertyCard";
import FilterSidebar from "../components/FilterSidebar";

export default function Listings({ properties }) {

  const [maxPrice, setMaxPrice] = useState(10000);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [capacity, setCapacity] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  // -------- FILTER LOGIC --------
  let filtered = properties.filter((p) => {
    const matchesPrice = p.price <= maxPrice;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase());
    const matchesCapacity = capacity === "" || p.capacity === capacity;
    const matchesAmenities =
      amenities.length === 0 ||
      amenities.every((a) => p.amenities?.includes(a));
    return matchesPrice && matchesSearch && matchesCapacity && matchesAmenities;
  });

  // -------- SORT --------
  if (sortOrder === "low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  }
  if (sortOrder === "high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  // -------- PAGINATION --------
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);
  const isLoading = properties.length === 0;

  return (
    <div className="flex min-h-screen animate-fade-in">

      <FilterSidebar
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        capacity={capacity}
        setCapacity={setCapacity}
        amenities={amenities}
        setAmenities={setAmenities}
      />

      <div className="flex-1 p-6 md:p-8 w-full">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface tracking-tight">
              Available Rooms
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Showing {filtered.length} results near your campus
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-outline-variant rounded-lg px-3">
              <span className="material-icons-round text-on-muted text-lg">search</span>
              <input
                type="text"
                placeholder="Search rooms..."
                className="bg-transparent text-on-surface p-2 w-44 focus:outline-none text-sm placeholder:text-on-muted"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 text-sm text-on-surface-variant">
              <span className="hidden lg:inline">Sort by:</span>
              <select
                className="input-base text-sm py-2"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="">Default</option>
                <option value="low">Lowest Price</option>
                <option value="high">Highest Price</option>
              </select>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-outline-variant overflow-hidden">
                <div className="h-52 skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-5 skeleton w-3/4" />
                  <div className="h-4 skeleton w-1/2" />
                  <div className="h-8 skeleton w-full mt-4" />
                </div>
              </div>
            ))
          ) : paginated.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <span className="material-icons-round text-5xl text-on-muted mb-3 block">search_off</span>
              <h3 className="text-lg font-medium text-on-surface mb-1">No matches found</h3>
              <p className="text-on-surface-variant text-sm">Try adjusting your search or filters.</p>
            </div>
          ) : (
            paginated.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-30 flex items-center justify-center"
            >
              <span className="material-icons-round text-base">chevron_left</span>
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            {totalPages > 5 && (
              <>
                <span className="text-on-muted">…</span>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-9 h-9 rounded-lg text-sm font-medium border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors disabled:opacity-30 flex items-center justify-center"
            >
              <span className="material-icons-round text-base">chevron_right</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}