const Booking = require("../models/Booking");
const Property = require("../models/Property");

// -------- CREATE BOOKING --------

exports.createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, message } = req.body;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    // Students only
    if (req.user.role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Only students can create bookings",
      });
    }

    // Can't book own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot book your own property",
      });
    }

    const booking = await Booking.create({
      property: propertyId,
      tenant: req.user._id,
      owner: property.owner,
      checkIn,
      checkOut,
      amount: property.price,
      message,
    });

    // Increment contact clicks as a side effect
    property.contactClicks += 1;
    await property.save();

    const populated = await Booking.findById(booking._id)
      .populate("property", "title location price images")
      .populate("tenant", "name email phone")
      .populate("owner", "name email phone");

    res.status(201).json({
      success: true,
      message: "Booking request created",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// -------- GET MY BOOKINGS (tenant) --------

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ tenant: req.user._id })
      .populate("property", "title location price images")
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// -------- GET BOOKINGS FOR OWNER --------

exports.getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only owners can access this",
      });
    }

    const bookings = await Booking.find({ owner: req.user._id })
      .populate("property", "title location price images")
      .populate("tenant", "name email phone")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// -------- UPDATE BOOKING STATUS (owner) --------

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Only the owner of the property can update status
    if (booking.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    booking.status = status;
    await booking.save();

    const populated = await Booking.findById(booking._id)
      .populate("property", "title location price images")
      .populate("tenant", "name email phone")
      .populate("owner", "name email phone");

    res.json({
      success: true,
      message: "Booking status updated",
      data: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// -------- CANCEL BOOKING (tenant) --------

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.tenant.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (booking.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed booking",
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({
      success: true,
      message: "Booking cancelled",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
