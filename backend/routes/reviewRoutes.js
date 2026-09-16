const express = require("express");

const {
  createReview,
  getRestaurantReviews,
  getOrderReview,
} = require("../controllers/reviewController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


// Create review
router.post(
  "/",
  protect,
  createReview
);


// Get reviews for a restaurant
router.get(
  "/restaurant/:restaurantId",
  getRestaurantReviews
);


// Get customer's review for an order
router.get(
  "/order/:orderId",
  protect,
  getOrderReview
);


module.exports = router;