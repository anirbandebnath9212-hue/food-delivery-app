const Order = require("../models/Order");
const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");

// Create order
const createOrder = async (req, res) => {
  try {
    const {
      restaurant,
      items,
      deliveryAddress,
    } = req.body;

    if (!restaurant || !items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({
        message: "Restaurant, items and delivery address are required",
      });
    }

    const existingRestaurant = await Restaurant.findById(restaurant);

    if (!existingRestaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    const orderItems = [];
    let totalPrice = 0;

    for (const item of items) {
      const food = await Food.findById(item.food);

      if (!food) {
        return res.status(404).json({
          message: `Food not found: ${item.food}`,
        });
      }

      if (food.restaurant.toString() !== restaurant.toString()) {
        return res.status(400).json({
          message: "All food items must belong to the selected restaurant",
        });
      }

      if (!food.isAvailable) {
        return res.status(400).json({
          message: `${food.name} is currently unavailable`,
        });
      }

      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for ${food.name}`,
        });
      }

      orderItems.push({
        food: food._id,
        name: food.name,
        price: food.price,
        quantity: item.quantity,
      });

      totalPrice += food.price * item.quantity;
    }

    const order = await Order.create({
      customer: req.user._id,
      restaurant,
      items: orderItems,
      totalPrice,
      deliveryAddress,
    });

    res.status(201).json({
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Get customer's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user._id,
    })
      .populate("restaurant", "name address")
      .populate("items.food", "name image");

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get orders",
      error: error.message,
    });
  }
};

// Get single order for customer
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("restaurant", "name address phone")
      .populate("items.food", "name image");

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (
      order.customer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this order",
      });
    }

    res.json({
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get order",
      error: error.message,
    });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to cancel this order",
      });
    }

    if (
      order.orderStatus === "delivered" ||
      order.orderStatus === "cancelled"
    ) {
      return res.status(400).json({
        message: "This order cannot be cancelled",
      });
    }

    order.orderStatus = "cancelled";

    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};

// Get restaurant orders
const getRestaurantOrders = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to view these orders",
      });
    }

    const orders = await Order.find({
      restaurant: restaurant._id,
    })
      .populate("customer", "name email phone")
      .populate("items.food", "name image")
      .sort({ createdAt: -1 });

    res.json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to get restaurant orders",
      error: error.message,
    });
  }
};

// Update order status by restaurant owner
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "placed",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const restaurant = await Restaurant.findById(order.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        message: "Restaurant not found",
      });
    }

    if (restaurant.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this order",
      });
    }

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({
        message: "Cancelled orders cannot be updated",
      });
    }

    if (order.orderStatus === "delivered") {
      return res.status(400).json({
        message: "Delivered orders cannot be updated",
      });
    }

    order.orderStatus = status;

    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getRestaurantOrders,
  updateOrderStatus,
};