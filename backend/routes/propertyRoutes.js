const express = require("express");
const router = express.Router();

const propertyController = require("../controllers/propertyController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");


// PUBLIC ROUTES
router.get("/", propertyController.getAllProperties);

router.get(
  "/owner/me",
  authMiddleware.protect,
  propertyController.getMyProperties
);

router.get("/:id", propertyController.getPropertyById);


// OWNER ROUTES
router.post(
  "/",
  authMiddleware.protect,
  upload.array("images", 10),
  propertyController.createProperty
);

router.put(
  "/:id",
  authMiddleware.protect,
  upload.array("images", 10),
  propertyController.updateProperty
);

router.put(
  "/:id/contact",
  propertyController.incrementContactClick
);

router.delete(
  "/:id",
  authMiddleware.protect,
  propertyController.deleteProperty
);

module.exports = router;