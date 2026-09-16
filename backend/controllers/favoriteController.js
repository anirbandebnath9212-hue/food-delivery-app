const User = require("../models/User");
const Restaurant = require("../models/Restaurant");


/* =========================
   ADD RESTAURANT FAVORITE
========================= */

const addFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant =
      await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    const alreadyFavorite =
      user.favorites.some(
        (favorite) =>
          favorite.toString() ===
          restaurantId.toString()
      );

    if (alreadyFavorite) {
      return res.status(400).json({
        message:
          "Restaurant is already in favorites",
      });
    }

    user.favorites.push(
      restaurant._id
    );

    await user.save();

    res.json({
      message:
        "Restaurant added to favorites",

      favorites:
        user.favorites,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to add favorite",

      error: error.message,
    });
  }
};


/* =========================
   REMOVE RESTAURANT FAVORITE
========================= */

const removeFavorite = async (
  req,
  res
) => {
  try {
    const { restaurantId } = req.params;

    const user = await User.findById(
      req.user._id
    );

    user.favorites =
      user.favorites.filter(
        (favorite) =>
          favorite.toString() !==
          restaurantId.toString()
      );

    await user.save();

    res.json({
      message:
        "Restaurant removed from favorites",

      favorites:
        user.favorites,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to remove favorite",

      error: error.message,
    });
  }
};


/* =========================
   GET FAVORITE RESTAURANTS
========================= */

const getFavorites = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).populate("favorites");

    res.json({
      count:
        user.favorites.length,

      favorites:
        user.favorites,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to get favorites",

      error: error.message,
    });
  }
};


/* =========================
   CHECK RESTAURANT FAVORITE
========================= */

const checkFavorite = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    const isFavorite =
      user.favorites.some(
        (favorite) =>
          favorite.toString() ===
          req.params.restaurantId.toString()
      );

    res.json({
      isFavorite,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to check favorite",

      error: error.message,
    });
  }
};


module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
};