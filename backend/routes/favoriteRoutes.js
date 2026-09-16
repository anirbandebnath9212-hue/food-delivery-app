const express = require("express");

const {
  addFavorite,
  removeFavorite,
  getFavorites,
  checkFavorite,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


/* =========================
   GET ALL FAVORITE RESTAURANTS
========================= */

router.get(
  "/",
  protect,
  getFavorites
);


/* =========================
   CHECK RESTAURANT FAVORITE
========================= */

router.get(
  "/:restaurantId",
  protect,
  checkFavorite
);


/* =========================
   ADD RESTAURANT FAVORITE
========================= */

router.post(
  "/:restaurantId",
  protect,
  addFavorite
);


/* =========================
   REMOVE RESTAURANT FAVORITE
========================= */

router.delete(
  "/:restaurantId",
  protect,
  removeFavorite
);


module.exports = router;