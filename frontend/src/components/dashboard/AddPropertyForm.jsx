import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function AddPropertyForm() {
  const { user } = useContext(AuthContext);

  const amenityOptions = [
    { label: "High-Speed WiFi", icon: "wifi" },
    { label: "Air Conditioning", icon: "ac_unit" },
    { label: "In-unit Laundry", icon: "local_laundry_service" },
    { label: "Bike Storage", icon: "pedal_bike" },
    { label: "Full Kitchen", icon: "kitchen" },
    { label: "Pet Friendly", icon: "pets" },
    { label: "Power Backup", icon: "bolt" },
    { label: "Parking", icon: "local_parking" },
  ];

  const [formData, setFormData] = useState({
    title: "", location: "", price: "", capacity: "1 Sharing", description: "",
  });
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!user || user.role !== "owner") {
    return <div className="p-10 text-error">Access Denied</div>;
  }

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setImageFiles((prev) => [...prev, ...fileArray]);
    fileArray.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onloadend = () => setImagePreviews((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const removeImage = (index) => {
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const toggleAmenity = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const form = new FormData();
    form.append("title", formData.title);
    form.append("location", formData.location);
    form.append("price", formData.price);
    form.append("capacity", formData.capacity);
    form.append("description", formData.description);
    selectedAmenities.forEach((a) => form.append("amenities", a));
    imageFiles.forEach((file) => form.append("images", file));
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/properties", {
        method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form,
      });
      const result = await res.json();
      setLoading(false);
      if (result.success) {
        alert("Property added successfully");
        setFormData({ title: "", location: "", price: "", capacity: "1 Sharing", description: "" });
        setSelectedAmenities([]); setImageFiles([]); setImagePreviews([]);
      } else { alert(result.message); }
    } catch (err) { console.error(err); setLoading(false); alert("Failed to add property"); }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* FORM */}
      <div className="lg:col-span-3">
        <h1 className="text-2xl font-bold text-on-surface tracking-tight mb-1">List Your Space</h1>
        <p className="text-sm text-on-surface-variant mb-8">Fill out the details to reach thousands of students searching for their next home.</p>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Property Details */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary text-base">apartment</span>
              Property Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Listing Title</label>
                <input name="title" value={formData.title} onChange={handleChange} placeholder="Modern Loft near Campus" className="input-base w-full text-sm" required />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Property Type</label>
                <select name="capacity" value={formData.capacity} onChange={handleChange} className="input-base w-full text-sm">
                  <option>1 Sharing</option>
                  <option>2 Sharing</option>
                  <option>3 Sharing</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Address</label>
              <input name="location" value={formData.location} onChange={handleChange} placeholder="123 Academic Way, University District" className="input-base w-full text-sm" required />
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary text-base">build</span>
              Amenities
            </h2>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={() => toggleAmenity(a.label)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors ${
                    selectedAmenities.includes(a.label)
                      ? "bg-primary/15 text-primary border-primary/30"
                      : "text-on-surface-variant border-outline-variant hover:border-primary/50"
                  }`}
                >
                  <span className="material-icons-round text-base">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price & Lease */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary text-base">payments</span>
              Price & Lease Terms
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Monthly Rent (₹)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="5000" className="input-base w-full text-sm" required />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Security Deposit (₹)</label>
                <input type="number" placeholder="5000" className="input-base w-full text-sm" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Lease Length</label>
                <select className="input-base w-full text-sm">
                  <option>6 Months</option>
                  <option>12 Months</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} placeholder="Describe your space..." className="input-base w-full text-sm resize-none" />
          </div>

          {/* Photo Upload */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-on-surface-variant flex items-center gap-2 mb-4">
              <span className="material-icons-round text-primary text-base">photo_camera</span>
              Photo Upload
            </h2>
            <div
              onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
                isDragging ? "border-primary bg-primary/5" : "border-outline-variant"
              }`}
            >
              <input type="file" multiple accept="image/*" onChange={(e) => handleFiles(e.target.files)} className="hidden" id="imageUpload" />
              <label htmlFor="imageUpload" className="cursor-pointer block">
                <span className="material-icons-round text-3xl text-on-muted mb-2 block">cloud_upload</span>
                <p className="text-sm text-on-surface-variant">Main Photo — Drop or click to upload</p>
              </label>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group rounded-lg overflow-hidden border border-outline-variant">
                    <img src={img} alt="preview" className="h-24 w-full object-cover" />
                    {index === 0 && (
                      <span className="absolute top-1 left-1 bg-primary text-on-primary text-[10px] px-1.5 py-0.5 rounded">Cover</span>
                    )}
                    <button
                      type="button" onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black/60 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    >×</button>
                  </div>
                ))}
                {imagePreviews.length < 4 && (
                  <label htmlFor="imageUpload" className="h-24 border-2 border-dashed border-outline-variant rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                    <span className="material-icons-round text-on-muted text-2xl">add</span>
                  </label>
                )}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-sm font-semibold uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? (
              <><span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" /> Uploading...</>
            ) : (
              <>Publish Listing <span className="material-icons-round text-base">send</span></>
            )}
          </button>
        </form>
      </div>

      {/* LIVE PREVIEW */}
      <div className="lg:col-span-2">
        <div className="sticky top-24">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-on-muted uppercase tracking-wider font-medium">Live Preview</p>
            <button className="text-primary text-xs hover:underline flex items-center gap-1">
              <span className="material-icons-round text-sm">open_in_new</span>
              Expanded/Top View
            </button>
          </div>
          <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
            <div className="h-48 bg-surface relative">
              {imagePreviews[0] ? (
                <img src={imagePreviews[0]} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-icons-round text-4xl text-on-muted">image</span>
                </div>
              )}
              {formData.price && (
                <span className="absolute top-3 right-3 bg-primary text-on-primary text-xs font-bold px-3 py-1.5 rounded-lg">
                  ₹{Number(formData.price).toLocaleString()}/mo
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex gap-2 mb-2">
                <span className="badge-available text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md">Verified Owner</span>
                <span className="text-[9px] font-medium text-primary">0.2 Miles from Campus</span>
              </div>
              <h3 className="font-semibold text-on-surface tracking-tight">
                {formData.title || "Modern Loft near Campus"}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                <span className="material-icons-round text-xs">location_on</span>
                {formData.location || "123 Academic Way, University District"}
              </p>
              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-outline-variant">
                {[
                  { label: "Bedrooms", value: formData.capacity?.charAt(0) || "1" },
                  { label: "Bathrooms", value: "Shared" },
                  { label: "Sq Ft", value: "340" },
                ].map((spec) => (
                  <div key={spec.label} className="text-center">
                    <p className="text-[10px] uppercase tracking-wider text-on-muted">{spec.label}</p>
                    <p className="text-sm font-semibold text-on-surface">{spec.value}</p>
                  </div>
                ))}
              </div>
              {selectedAmenities.length > 0 && (
                <div className="mt-3 pt-3 border-t border-outline-variant">
                  <p className="text-[10px] uppercase tracking-wider text-on-muted mb-2">Top Amenities</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedAmenities.slice(0, 3).map((a) => (
                      <span key={a} className="text-[10px] text-on-surface-variant flex items-center gap-1">
                        <span className="material-icons-round text-tertiary text-xs">check</span>{a}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <button className="btn-secondary w-full mt-4 text-xs uppercase tracking-wider font-semibold">
                Request to Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
