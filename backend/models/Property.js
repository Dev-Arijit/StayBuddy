const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    capacity: { type: String, required: true },
    description: { type: String },
    amenities: [{ type: String }],
    images: [{ type: String }], // Cloudinary URLs
    available: { type: Boolean, default: true },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // -------- ANALYTICS --------

    views: {
      type: Number,
      default: 0,
    },

    contactClicks: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Property", propertySchema);
