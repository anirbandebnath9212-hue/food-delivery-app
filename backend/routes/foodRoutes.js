const express = require("express");

const {
  createFood,
  getFoods,
  getFoodsByRestaurant,
  getFoodById,
  updateFood,
  deleteFood,
} = require("../controllers/foodController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Create food
router.post("/", protect, createFood);

// Get all food
router.get("/", getFoods);

// Get food by restaurant
router.get("/restaurant/:restaurantId", getFoodsByRestaurant);

// Get single food
router.get("/:id", getFoodById);

// Update food
router.put("/:id", protect, updateFood);

// Delete food
router.delete("/:id", protect, deleteFood);

module.exports = router;