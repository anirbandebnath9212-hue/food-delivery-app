const User = require("../models/User");
const Food = require("../models/Food");


/* =========================
   ADD FOOD FAVORITE
========================= */

const addFoodFavorite = async (
  req,
  res
) => {
  try {
    const { foodId } = req.params;

    const food =
      await Food.findById(foodId);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    const alreadyFavorite =
      user.favoriteFoods.some(
        (favorite) =>
          favorite.toString() ===
          foodId.toString()
      );

    if (alreadyFavorite) {
      return res.status(400).json({
        message:
          "Food is already in favorites",
      });
    }

    user.favoriteFoods.push(
      food._id
    );

    await user.save();

    res.json({
      message:
        "Food added to favorites",

      favoriteFoods:
        user.favoriteFoods,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to add food favorite",

      error: error.message,
    });
  }
};


/* =========================
   REMOVE FOOD FAVORITE
========================= */

const removeFoodFavorite = async (
  req,
  res
) => {
  try {
    const { foodId } = req.params;

    const user = await User.findById(
      req.user._id
    );

    user.favoriteFoods =
      user.favoriteFoods.filter(
        (favorite) =>
          favorite.toString() !==
          foodId.toString()
      );

    await user.save();

    res.json({
      message:
        "Food removed from favorites",

      favoriteFoods:
        user.favoriteFoods,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to remove food favorite",

      error: error.message,
    });
  }
};


/* =========================
   GET FAVORITE FOODS
========================= */

const getFoodFavorites = async (
  req,
  res
) => {
  try {
    const user =
      await User.findById(
        req.user._id
      ).populate({
        path: "favoriteFoods",

        populate: {
          path: "restaurant",

          select:
            "name image cuisine rating deliveryTime",
        },
      });

    res.json({
      count:
        user.favoriteFoods.length,

      favoriteFoods:
        user.favoriteFoods,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to get favorite foods",

      error: error.message,
    });
  }
};


/* =========================
   CHECK FOOD FAVORITE
========================= */

const checkFoodFavorite = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    const isFavorite =
      user.favoriteFoods.some(
        (favorite) =>
          favorite.toString() ===
          req.params.foodId.toString()
      );

    res.json({
      isFavorite,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to check food favorite",

      error: error.message,
    });
  }
};


module.exports = {
  addFoodFavorite,
  removeFoodFavorite,
  getFoodFavorites,
  checkFoodFavorite,
};