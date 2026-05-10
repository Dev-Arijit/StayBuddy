export default function FilterSidebar({
  maxPrice,
  setMaxPrice,
  capacity,
  setCapacity,
  amenities,
  setAmenities
}) {

  const amenityOptions = [
    "High-Speed Wi-Fi",
    "In-unit Laundry",
    "On-site Gym",
    "Parking Space",
    "Air Conditioning",
    "Power Backup"
  ];

  const distanceOptions = ["Under 1 mi", "1-3 mi", "3-6 mi", "Anywhere"];
  const roomTypes = ["Single Room", "Shared Room", "Entire Studio"];

  const toggleAmenity = (a) => {
    if (amenities.includes(a)) {
      setAmenities(amenities.filter((x) => x !== a));
    } else {
      setAmenities([...amenities, a]);
    }
  };

  const clearAll = () => {
    setMaxPrice(10000);
    setCapacity("");
    setAmenities([]);
  };

  return (
    <div className="w-72 bg-white p-6 border-r border-outline-variant shrink-0 h-full overflow-y-auto hidden md:block">

      <h2 className="text-[11px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant mb-6">
        Refine Search
      </h2>

      {/* PRICE RANGE */}
      <div className="mb-8">
        <p className="font-medium text-sm mb-3 text-on-surface">Price Range</p>
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-on-surface-variant mt-2">
          <span>₹1,000</span>
          <span className="text-primary font-medium">₹{maxPrice.toLocaleString()}</span>
        </div>
      </div>

      {/* DISTANCE TO CAMPUS */}
      <div className="mb-8">
        <p className="font-medium text-sm mb-3 text-on-surface">Distance to Campus</p>
        <div className="grid grid-cols-2 gap-2">
          {distanceOptions.map((d) => (
            <button
              key={d}
              className="text-xs px-3 py-2 rounded-lg border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-colors"
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* ROOM TYPE */}
      <div className="mb-8">
        <p className="font-medium text-sm mb-3 text-on-surface">Room Type</p>
        <div className="space-y-2">
          {roomTypes.map((type) => (
            <label key={type} className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">
              <input
                type="radio"
                name="roomType"
                value={type}
                checked={capacity === type}
                onChange={(e) => setCapacity(e.target.value === capacity ? "" : e.target.value)}
                className="accent-primary w-3.5 h-3.5"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* SHARING FILTER */}
      <div className="mb-8">
        <p className="font-medium text-sm mb-3 text-on-surface">Sharing Type</p>
        <select
          value={capacity}
          onChange={(e) => setCapacity(e.target.value)}
          className="input-base w-full text-sm"
        >
          <option value="">All</option>
          <option>1 Sharing</option>
          <option>2 Sharing</option>
          <option>3 Sharing</option>
        </select>
      </div>

      {/* AMENITIES */}
      <div className="mb-8">
        <p className="font-medium text-sm mb-3 text-on-surface">Amenities</p>
        <div className="space-y-2">
          {amenityOptions.map((a) => (
            <label
              key={a}
              className="flex items-center gap-2.5 text-sm text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
            >
              <input
                type="checkbox"
                checked={amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
                className="accent-primary w-3.5 h-3.5 rounded"
              />
              {a}
            </label>
          ))}
        </div>
      </div>

      {/* CLEAR ALL */}
      <button
        onClick={clearAll}
        className="w-full btn-secondary text-sm"
      >
        Clear All Filters
      </button>

    </div>
  );
}