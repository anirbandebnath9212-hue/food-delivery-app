const requireRestaurantRole = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }

  if (req.user.role !== "restaurant") {
    return res.status(403).json({
      message: "Restaurant owner access required",
    });
  }

  next();
};

module.exports = requireRestaurantRole;