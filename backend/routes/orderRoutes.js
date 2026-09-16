const express = require("express");
const requireRestaurantRole = require("../middleware/roleMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getRestaurantOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Customer creates order
router.post("/", protect, createOrder);

// Customer gets their orders
router.get("/my-orders", protect, getMyOrders);

// Restaurant owner gets restaurant orders
router.get(
  "/restaurant/:restaurantId",
  protect,
  requireRestaurantRole,
  getRestaurantOrders
);

// Customer gets single order
router.get("/:id", protect, getOrderById);

// Customer cancels order
router.put("/:id/cancel", protect, cancelOrder);

// Restaurant owner updates order status
router.put(
  "/:id/status",
  protect,
  requireRestaurantRole,
  updateOrderStatus
);

module.exports = router;