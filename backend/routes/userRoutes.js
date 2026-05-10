const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/dashboard",
  authMiddleware.protect,
  userController.getStudentDashboard
);

router.put(
  "/wishlist/:id",
  authMiddleware.protect,
  userController.toggleWishlist
);

router.put(
  "/recent/:id",
  authMiddleware.protect,
  userController.addRecentlyViewed
);

router.put(
  "/profile",
  authMiddleware.protect,
  userController.updateProfile
);

module.exports = router;