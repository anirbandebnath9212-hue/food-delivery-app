const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    cuisine: {
      type: String,
      default: "",
      trim: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    deliveryTime: {
      type: Number,
      default: 30,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

module.exports = Restaurant;