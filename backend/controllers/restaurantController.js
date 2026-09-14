const Restaurant = require("../models/Restaurant");

// Create restaurant
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      address,
      phone,
      cuisine,
      deliveryTime,
    } = req.body;

    if (!name || !address) {
      return res.status(400).json({
        message: "Restaurant name and address are required",
      });
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      image,
      address,
      phone,
      cuisine,
      deliveryTime,
      owner: req.user._id,
    });

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create restaurant",
      error: error.message,
    });
  }
};

// Get all restaurants
const getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find()
      .populate("owner", "name email");

    res.json({
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get restaurants",
      error: error.message,
    });
  }
};

// Get single restaurant
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate("owner", "name email");

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    res.json({
      restaurant,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get restaurant",
      error: error.message,
    });
  }
};

// Temporary: assign restaurant to logged-in user

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
};