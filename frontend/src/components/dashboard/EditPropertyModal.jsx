import { useState } from "react";

export default function EditPropertyModal({
  property,
  onClose,
  onSave
}) {

  const amenityOptions = [
    "WiFi",
    "Attached Bathroom",
    "Power Backup",
    "Furnished",
    "AC",
    "Parking"
  ];

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: property.title,
    location: property.location,
    price: property.price,
    capacity: property.capacity,
    description: property.description || ""
  });

  const [amenities, setAmenities] = useState(
    property.amenities || []
  );

  const [existingImages, setExistingImages] = useState(
    property.images || []
  );

  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  const [dragIndex, setDragIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleAmenity = (amenity) => {
    if (amenities.includes(amenity)) {
      setAmenities(amenities.filter(a => a !== amenity));
    } else {
      setAmenities([...amenities, amenity]);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    setNewImages(prev => [...prev, ...fileArray]);
    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDropUpload = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewPreviews(newPreviews.filter((_, i) => i !== index));
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDrop = (index) => {
    if (dragIndex === null) return;
    const updated = [...existingImages];
    const [dragged] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, dragged);
    setExistingImages(updated);
    setDragIndex(null);
  };

  const setCover = (index) => {
    const updated = [...existingImages];
    const [selected] = updated.splice(index, 1);
    updated.unshift(selected);
    setExistingImages(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const form = new FormData();
    form.append("title", formData.title);
    form.append("location", formData.location);
    form.append("price", formData.price);
    form.append("capacity", formData.capacity);
    form.append("description", formData.description);
    amenities.forEach(a => form.append("amenities", a));
    newImages.forEach(file => form.append("images", file));
    form.append("existingImages", JSON.stringify(existingImages));
    await onSave(form);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fade-in">
      <div className="bg-white p-6 rounded-xl w-[750px] max-h-[90vh] overflow-y-auto border border-outline-variant shadow-xl animate-scale-in">

        <h2 className="text-2xl font-semibold mb-4 text-on-surface tracking-tight">
          Edit Property
        </h2>

        <div className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-base w-full text-sm"
              placeholder="Property Title"
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Location</label>
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-base w-full text-sm"
              placeholder="Location"
            />
          </div>

          {/* PRICE */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Monthly Rent</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="input-base w-full text-sm"
              placeholder="Monthly Rent"
            />
          </div>

          {/* CAPACITY */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Capacity</label>
            <select
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              className="input-base w-full text-sm"
            >
              <option>1 Sharing</option>
              <option>2 Sharing</option>
              <option>3 Sharing</option>
            </select>
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-1.5">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-base w-full text-sm resize-none"
              rows={3}
              placeholder="Description"
            />
          </div>

          {/* IMAGE DROP AREA */}
          <div
            onDrop={handleDropUpload}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-outline-variant p-8 rounded-xl text-center bg-surface-bright hover:border-primary/50 transition-colors"
          >
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              id="editImageUpload"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <label htmlFor="editImageUpload" className="cursor-pointer block">
              <span className="material-icons-round text-3xl text-on-muted mb-2 block">cloud_upload</span>
              <p className="text-sm text-on-surface-variant">Drag & Drop Images Here or Click to Upload</p>
            </label>
          </div>

          {/* IMAGE GRID */}
          <div className="grid grid-cols-3 gap-3">
            {existingImages.map((img, i) => (
              <div
                key={i}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(i)}
                className="relative cursor-move group rounded-lg overflow-hidden border border-outline-variant"
              >
                <img src={img} className="h-24 w-full object-cover" />
                {i === 0 && (
                  <span className="absolute top-1 left-1 bg-primary text-white text-[10px] px-2 py-0.5 rounded">
                    Cover
                  </span>
                )}
                <div className="absolute bottom-1 left-1 flex gap-1">
                  {i !== 0 && (
                    <button
                      onClick={() => setCover(i)}
                      className="text-[10px] bg-white/90 text-on-surface-variant px-2 py-0.5 rounded border border-outline-variant"
                    >
                      Set Cover
                    </button>
                  )}
                </div>
                <button
                  onClick={() => removeExistingImage(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >×</button>
              </div>
            ))}

            {newPreviews.map((img, i) => (
              <div key={`new-${i}`} className="relative group rounded-lg overflow-hidden border border-outline-variant">
                <img src={img} className="h-24 w-full object-cover" />
                <button
                  onClick={() => removeNewImage(i)}
                  className="absolute top-1 right-1 bg-black/50 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >×</button>
              </div>
            ))}
          </div>

          {/* AMENITIES */}
          <div>
            <label className="text-[10px] uppercase tracking-wider text-on-muted block mb-2">Amenities</label>
            <div className="flex flex-wrap gap-2">
              {amenityOptions.map(a => (
                <button
                  key={a}
                  type="button"
                  onClick={() => toggleAmenity(a)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-colors ${
                    amenities.includes(a)
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "text-on-surface-variant border-outline-variant hover:border-primary/50"
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="btn-secondary text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary text-sm flex items-center gap-2"
            >
              {loading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Uploading...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}