const express = require("express");

const {
  addFoodFavorite,
  removeFoodFavorite,
  getFoodFavorites,
  checkFoodFavorite,
} = require("../controllers/foodFavoriteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


/* =========================
   GET ALL FAVORITE FOODS
========================= */

router.get(
  "/",
  protect,
  getFoodFavorites
);


/* =========================
   CHECK FOOD FAVORITE
========================= */

router.get(
  "/:foodId",
  protect,
  checkFoodFavorite
);


/* =========================
   ADD FOOD FAVORITE
========================= */

router.post(
  "/:foodId",
  protect,
  addFoodFavorite
);


/* =========================
   REMOVE FOOD FAVORITE
========================= */

router.delete(
  "/:foodId",
  protect,
  removeFoodFavorite
);


module.exports = router;