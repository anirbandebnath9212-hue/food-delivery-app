const express = require("express");

const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
} = require("../controllers/restaurantController");

const protect = require("../middleware/authMiddleware");
const requireRestaurantRole = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Create restaurant
router.post(
  "/",
  protect,
  requireRestaurantRole,
  upload.single("image"),
  createRestaurant
);

// Get all restaurants
router.get("/", getRestaurants);

// Get single restaurant
router.get("/:id", getRestaurantById);

module.exports = router;