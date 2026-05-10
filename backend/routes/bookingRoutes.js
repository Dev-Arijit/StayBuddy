const express = require("express");
const router = express.Router();

const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middleware/authMiddleware");

// Student creates a booking
router.post(
  "/",
  authMiddleware.protect,
  bookingController.createBooking
);

// Student gets their bookings
router.get(
  "/my",
  authMiddleware.protect,
  bookingController.getMyBookings
);

// Owner gets bookings for their properties
router.get(
  "/owner",
  authMiddleware.protect,
  bookingController.getOwnerBookings
);

// Owner updates booking status (confirm/complete/cancel)
router.put(
  "/:id/status",
  authMiddleware.protect,
  bookingController.updateBookingStatus
);

// Student cancels a booking
router.put(
  "/:id/cancel",
  authMiddleware.protect,
  bookingController.cancelBooking
);

module.exports = router;
