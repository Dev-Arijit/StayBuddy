const Property = require("../models/Property");
const cloudinary = require("../config/cloudinary");

/*
GET ALL PROPERTIES
Public
*/
exports.getAllProperties = async (req, res) => {
  try {

    const {
      location,
      minPrice,
      maxPrice,
      capacity,
      amenities
    } = req.query;

    let query = {};

    // LOCATION SEARCH
    if (location) {
      query.location = {
        $regex: location,
        $options: "i"
      };
    }

    // PRICE RANGE
    if (minPrice || maxPrice) {

      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }

    }

    // SHARING TYPE
    if (capacity) {
      query.capacity = capacity;
    }

    // AMENITIES
    if (amenities) {

      const amenityArray = amenities.split(",");

      query.amenities = {
        $all: amenityArray
      };

    }

    const properties = await Property.find(query)
      .populate("owner", "name phone");

    res.json({
      success: true,
      message: "Properties fetched successfully",
      data: properties
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
GET SINGLE PROPERTY
Public
*/
exports.getPropertyById = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id)
      .populate("owner", "name phone");

    if (!property) {

      return res.status(404).json({
        success: false,
        message: "Property not found"
      });

    }

    // -------- INCREMENT VIEW --------

    property.views += 1;
    await property.save();

    res.json({
      success: true,
      message: "Property fetched successfully",
      data: property
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/*
CREATE PROPERTY
Owner only
*/
exports.createProperty = async (req, res) => {
  try {

    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can create properties",
      });
    }

    let imageUrls = [];

    // Upload images to Cloudinary
    for (let file of req.files || []) {

      const uploadResult = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "student-stay" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(file.buffer);

      });

      imageUrls.push(uploadResult.secure_url);
    }

    const property = await Property.create({
      title: req.body.title,
      location: req.body.location,
      price: req.body.price,
      capacity: req.body.capacity,
      description: req.body.description,

      amenities: Array.isArray(req.body.amenities)
        ? req.body.amenities
        : req.body.amenities
        ? [req.body.amenities]
        : [],

      images: imageUrls,
      owner: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Property created successfully",
      data: property,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

/*
UPDATE PROPERTY
Owner + Ownership check
*/
exports.updateProperty = async (req, res) => {
  try {

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    // ---------------- BASIC FIELDS ----------------

    property.title = req.body.title;
    property.location = req.body.location;
    property.price = req.body.price;
    property.capacity = req.body.capacity;
    property.description = req.body.description;

    // ---------------- AMENITIES ----------------

    if (req.body.amenities) {
      property.amenities = Array.isArray(req.body.amenities)
        ? req.body.amenities
        : [req.body.amenities];
    }

    // ---------------- EXISTING IMAGES ----------------

    let existingImages = [];

    if (req.body.existingImages) {
      existingImages = JSON.parse(req.body.existingImages);
    }

    let newImages = [];

    // ---------------- CLOUDINARY UPLOAD ----------------

    for (let file of req.files || []) {

      const uploadResult = await new Promise((resolve, reject) => {

        const stream = cloudinary.uploader.upload_stream(
          { folder: "student-stay" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        stream.end(file.buffer);

      });

      newImages.push(uploadResult.secure_url);

    }

    // ---------------- FINAL IMAGE ARRAY ----------------

    property.images = [
      ...existingImages,
      ...newImages
    ];

    await property.save();

    res.json({
      success: true,
      message: "Property updated successfully",
      data: property,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


/*
DELETE PROPERTY
Owner + Ownership check
*/
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (property.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await property.deleteOne();

    res.json({
      success: true,
      message: "Property deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/*
GET OWNER'S PROPERTIES
Owner only
*/
exports.getMyProperties = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can access this route",
      });
    }

    const properties = await Property.find({
      owner: req.user._id,
    }).populate("owner", "name phone");

    res.json({
      success: true,
      message: "Owner properties fetched successfully",
      data: properties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// increment contact click number

exports.incrementContactClick = async (req, res) => {

  try {

    const property = await Property.findById(req.params.id);

    if (!property) {

      return res.status(404).json({
        success: false,
        message: "Property not found"
      });

    }

    property.contactClicks += 1;

    await property.save();

    res.json({
      success: true
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};