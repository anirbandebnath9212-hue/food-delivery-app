const express = require("express");

const {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/addressController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();


/* =========================
   GET ALL ADDRESSES
========================= */

router.get(
  "/",
  protect,
  getAddresses
);


/* =========================
   ADD ADDRESS
========================= */

router.post(
  "/",
  protect,
  addAddress
);


/* =========================
   UPDATE ADDRESS
========================= */

router.put(
  "/:id",
  protect,
  updateAddress
);


/* =========================
   DELETE ADDRESS
========================= */

router.delete(
  "/:id",
  protect,
  deleteAddress
);


/* =========================
   SET DEFAULT ADDRESS
========================= */

router.put(
  "/:id/default",
  protect,
  setDefaultAddress
);


module.exports = router;