const express = require("express");

const {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllRestaurants,
  updateRestaurantStatus,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(protect);
router.use(adminMiddleware);

// Dashboard
router.get(
  "/dashboard",
  getDashboardStats
);

// Users
router.get(
  "/users",
  getAllUsers
);

router.put(
  "/users/:id/status",
  updateUserStatus
);

// Restaurants
router.get(
  "/restaurants",
  getAllRestaurants
);

router.put(
  "/restaurants/:id/status",
  updateRestaurantStatus
);

// Orders
router.get(
  "/orders",
  getAllOrders
);

router.put(
  "/orders/:id/status",
  updateOrderStatus
);

module.exports = router;