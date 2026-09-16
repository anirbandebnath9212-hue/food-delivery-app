const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const cloudinary = require("../config/cloudinary");

// Create food item
const createFood = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      restaurant,
    } = req.body;

    if (!name || price === undefined || !restaurant) {
      return res.status(400).json({
        message: "Food name, price and restaurant are required",
      });
    }

    const existingRestaurant = await Restaurant.findById(
      restaurant
    );

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // Only the restaurant owner can add food
    if (
      String(existingRestaurant.owner) !==
      String(req.user._id)
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to add food to this restaurant",
      });
    }

    let imageUrl = "";

    // Upload food image to Cloudinary
    if (req.file) {
      const uploadResult = await new Promise(
        (resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: "biterush/foods",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          uploadStream.end(req.file.buffer);
        }
      );

      imageUrl = uploadResult.secure_url;
    }

    const food = await Food.create({
      name,
      description,
      image: imageUrl,
      price,
      category,
      restaurant,
    });

    res.status(201).json({
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.error(error);

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

    const restaurant = await Restaurant.findById(
      food.restaurant
    );

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    // Only the restaurant owner can update food
    if (
      String(restaurant.owner) !==
      String(req.user._id)
    ) {
      return res.status(403).json({
        message:
          "You are not allowed to update this food",
      });
    }

    const {
      name,
      description,
      price,
      category,
      image,
      isAvailable,
    } = req.body;

    if (name !== undefined) {
      food.name = name;
    }

    if (description !== undefined) {
      food.description = description;
    }

    if (price !== undefined) {
      food.price = Number(price);
    }

    if (category !== undefined) {
      food.category = category;
    }

    if (isAvailable !== undefined) {
      food.isAvailable =
        isAvailable === true ||
        isAvailable === "true";
    }

    // If a new image was selected, upload it
    // to Cloudinary and replace the old image URL.
    if (req.file) {
      const uploadResult =
        await new Promise((resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: "biterush/foods",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );

          uploadStream.end(req.file.buffer);
        });

      food.image = uploadResult.secure_url;
    } else if (image !== undefined) {
      food.image = image;
    }

    const updatedFood = await food.save();

    res.json({
      message: "Food updated successfully",
      food: updatedFood,
    });
  } catch (error) {
    console.error(error);

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