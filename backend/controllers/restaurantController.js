const Restaurant = require("../models/Restaurant");
const cloudinary = require("../config/cloudinary");

// Create restaurant
const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
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

    // Check if this user already owns a restaurant
    const existingRestaurant = await Restaurant.findOne({
      owner: req.user._id,
    });

    if (existingRestaurant) {
      return res.status(400).json({
        message: "You already have a restaurant",
      });
    }

    let imageUrl = "";

    // Upload restaurant image to Cloudinary
    if (req.file) {
      const uploadResult =
        await new Promise((resolve, reject) => {
          const uploadStream =
            cloudinary.uploader.upload_stream(
              {
                folder: "biterush/restaurants",
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

      imageUrl = uploadResult.secure_url;
    }

    const restaurant = await Restaurant.create({
      name,
      description,
      image: imageUrl,
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
    console.error(error);

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
    const restaurant = await Restaurant.findById(
      req.params.id
    ).populate("owner", "name email");

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

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
};