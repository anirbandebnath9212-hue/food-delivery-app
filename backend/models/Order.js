const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    food: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },

    items: {
      type: [orderItemSchema],

      required: true,

      validate: {
        validator: function (items) {
          return items.length > 0;
        },

        message:
          "Order must contain at least one item",
      },
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryAddress: {
      type: String,
      required: true,
      trim: true,
    },

    paymentMethod: {
      type: String,

      enum: [
        "cash_on_delivery",
        "online",
      ],

      default: "cash_on_delivery",
    },

    paymentStatus: {
      type: String,

      enum: [
        "pending",
        "paid",
        "failed",
      ],

      default: "pending",
    },

    orderStatus: {
      type: String,

      enum: [
        "placed",
        "confirmed",
        "preparing",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],

      default: "placed",
    },
  },

  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

module.exports = Order;