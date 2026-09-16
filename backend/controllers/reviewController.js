const Review = require("../models/Review");
const Order = require("../models/Order");
const Restaurant = require("../models/Restaurant");

// Create review
const createReview = async (req, res) => {
  try {
    const {
      order: orderId,
      rating,
      comment,
    } = req.body;

    if (!orderId || !rating) {
      return res.status(400).json({
        message:
          "Order and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message:
          "Rating must be between 1 and 5",
      });
    }

    // Find the order
    const order = await Order.findById(
      orderId
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Make sure the customer owns the order
    if (
      order.customer.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to review this order",
      });
    }

    // Only delivered orders can be reviewed
    if (
      order.orderStatus !== "delivered"
    ) {
      return res.status(400).json({
        message:
          "You can only review delivered orders",
      });
    }

    // Check if review already exists
    const existingReview =
      await Review.findOne({
        order: order._id,
      });

    if (existingReview) {
      return res.status(400).json({
        message:
          "You have already reviewed this order",
      });
    }

    // Make sure restaurant still exists
    const restaurant =
      await Restaurant.findById(
        order.restaurant
      );

    if (!restaurant) {
      return res.status(404).json({
        message:
          "Restaurant not found",
      });
    }

    // Create review
    const review = await Review.create({
      customer: req.user._id,

      restaurant: order.restaurant,

      order: order._id,

      rating,

      comment:
        comment || "",
    });

    // Recalculate restaurant rating
    const reviews =
      await Review.find({
        restaurant:
          order.restaurant,
      });

    const totalRating =
      reviews.reduce(
        (total, review) =>
          total + review.rating,
        0
      );

    const averageRating =
      totalRating /
      reviews.length;

    restaurant.rating =
      Number(
        averageRating.toFixed(1)
      );

    await restaurant.save();

    res.status(201).json({
      message:
        "Review submitted successfully",

      review,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to create review",

      error: error.message,
    });
  }
};


// Get restaurant reviews
const getRestaurantReviews =
  async (req, res) => {
    try {
      const reviews =
        await Review.find({
          restaurant:
            req.params.restaurantId,
        })
          .populate(
            "customer",
            "name"
          )
          .sort({
            createdAt: -1,
          });

      res.json({
        count: reviews.length,

        reviews,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to get restaurant reviews",

        error: error.message,
      });
    }
  };


// Get customer's review for an order
const getOrderReview =
  async (req, res) => {
    try {
      const review =
        await Review.findOne({
          order: req.params.orderId,

          customer: req.user._id,
        }).populate(
          "customer",
          "name"
        );

      res.json({
        review: review || null,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to get order review",

        error: error.message,
      });
    }
  };


module.exports = {
  createReview,
  getRestaurantReviews,
  getOrderReview,
};