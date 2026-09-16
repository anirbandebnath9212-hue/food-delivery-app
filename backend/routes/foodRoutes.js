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
const requireRestaurantRole = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Restaurant owner food management
router.post(
  "/",
  protect,
  requireRestaurantRole,
  upload.single("image"),
  createFood
);

router.put(
  "/:id",
  protect,
  requireRestaurantRole,
  upload.single("image"),
  updateFood
);

router.delete(
  "/:id",
  protect,
  requireRestaurantRole,
  deleteFood
);

// Public food routes
router.get("/", getFoods);

router.get(
  "/restaurant/:restaurantId",
  getFoodsByRestaurant
);

router.get("/:id", getFoodById);

module.exports = router;