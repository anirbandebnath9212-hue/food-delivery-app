const User = require("../models/User");
const Restaurant = require("../models/Restaurant");
const Order = require("../models/Order");

// =========================
// DASHBOARD STATISTICS
// =========================

const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalCustomers,
      totalRestaurantOwners,
      totalRestaurants,
      totalOrders,
      pendingOrders,
      deliveredOrders,
    ] = await Promise.all([
      User.countDocuments(),

      User.countDocuments({
        role: "customer",
      }),

      User.countDocuments({
        role: "restaurant",
      }),

      Restaurant.countDocuments(),

      Order.countDocuments(),

      Order.countDocuments({
        orderStatus: {
          $in: [
            "placed",
            "confirmed",
            "preparing",
            "out_for_delivery",
          ],
        },
      }),

      Order.countDocuments({
        orderStatus: "delivered",
      }),
    ]);

    const revenueResult = await Order.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    res.json({
      stats: {
        totalUsers,
        totalCustomers,
        totalRestaurantOwners,
        totalRestaurants,
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to load dashboard statistics",
      error: error.message,
    });
  }
};

// =========================
// GET ALL USERS
// =========================

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.json({
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load users",
      error: error.message,
    });
  }
};

// =========================
// UPDATE USER STATUS
// =========================

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({
        message:
          "isActive must be true or false",
      });
    }

    if (
      req.user._id.toString() === id
    ) {
      return res.status(400).json({
        message:
          "You cannot change your own account status",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.isActive = isActive;

    await user.save();

    res.json({
      message: isActive
        ? "User activated successfully"
        : "User deactivated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to update user status",
      error: error.message,
    });
  }
};

// =========================
// GET ALL RESTAURANTS
// =========================

const getAllRestaurants = async (req, res) => {
  try {
    const restaurants =
      await Restaurant.find()
        .populate(
          "owner",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      restaurants,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to load restaurants",
      error: error.message,
    });
  }
};

// =========================
// UPDATE RESTAURANT STATUS
// =========================

const updateRestaurantStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { isOpen } = req.body;

    if (typeof isOpen !== "boolean") {
      return res.status(400).json({
        message:
          "isOpen must be true or false",
      });
    }

    const restaurant =
      await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        message:
          "Restaurant not found",
      });
    }

    restaurant.isOpen = isOpen;

    await restaurant.save();

    res.json({
      message: isOpen
        ? "Restaurant opened successfully"
        : "Restaurant closed successfully",

      restaurant,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to update restaurant status",
      error: error.message,
    });
  }
};

// =========================
// GET ALL ORDERS
// =========================

const getAllOrders = async (req, res) => {
  try {
    const orders =
      await Order.find()
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "restaurant",
          "name address"
        )
        .sort({
          createdAt: -1,
        });

    res.json({
      orders,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to load orders",
      error: error.message,
    });
  }
};

// =========================
// UPDATE ORDER STATUS
// =========================

const updateOrderStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const allowedStatuses = [
      "placed",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];

    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        message: "Invalid order status",
      });
    }

    const order =
      await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus =
      orderStatus;

    await order.save();

    const updatedOrder =
      await Order.findById(id)
        .populate(
          "customer",
          "name email phone"
        )
        .populate(
          "restaurant",
          "name address"
        );

    res.json({
      message:
        "Order status updated successfully",

      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to update order status",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  getAllRestaurants,
  updateRestaurantStatus,
  getAllOrders,
  updateOrderStatus,
};