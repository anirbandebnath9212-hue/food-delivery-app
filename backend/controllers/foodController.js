const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");

// Create food item
const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      price,
      category,
      restaurant,
    } = req.body;

    if (!name || price === undefined || !restaurant) {
      return res.status(400).json({
        message: "Food name, price and restaurant are required",
      });
    }

    const existingRestaurant = await Restaurant.findById(restaurant);

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const food = await Food.create({
      name,
      description,
      image,
      price,
      category,
      restaurant,
    });

    res.status(201).json({
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create food",
      error: error.message,
    });
  }
};

// Get all food items
const getFoods = async (req, res) => {
  try {
    const foods = await Food.find()
      .populate("restaurant", "name address");

    res.json({
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get foods",
      error: error.message,
    });
  }
};

// Get food items by restaurant
const getFoodsByRestaurant = async (req, res) => {
  try {
    const foods = await Food.find({
      restaurant: req.params.restaurantId,
    });

    res.json({
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get restaurant foods",
      error: error.message,
    });
  }
};

// Get single food item
const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id)
      .populate("restaurant", "name address");

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    res.json({
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get food",
      error: error.message,
    });
  }
};

// Update food item
const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    const restaurant = await Restaurant.findById(food.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this food",
      });
    }

    const {
      name,
      description,
      image,
      price,
      category,
      isAvailable,
    } = req.body;

    if (name !== undefined) food.name = name;
    if (description !== undefined) food.description = description;
    if (image !== undefined) food.image = image;
    if (price !== undefined) food.price = price;
    if (category !== undefined) food.category = category;
    if (isAvailable !== undefined) food.isAvailable = isAvailable;

    await food.save();

    res.json({
      message: "Food updated successfully",
      food,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update food",
      error: error.message,
    });
  }
};

// Delete food item
const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    const restaurant = await Restaurant.findById(food.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this food",
      });
    }

    await food.deleteOne();

    res.json({
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete food",
      error: error.message,
    });
  }
};

module.exports = {
  createFood,
  getFoods,
  getFoodsByRestaurant,
  getFoodById,
  updateFood,
  deleteFood,
};