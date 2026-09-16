const User = require("../models/User");


/* =========================
   GET SAVED ADDRESSES
========================= */

const getAddresses = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    ).select("savedAddresses");

    res.json({
      addresses:
        user.savedAddresses || [],
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to get saved addresses",

      error: error.message,
    });
  }
};


/* =========================
   ADD ADDRESS
========================= */

const addAddress = async (
  req,
  res
) => {
  try {
    const {
      label,
      address,
    } = req.body;

    if (
      !label ||
      !address
    ) {
      return res.status(400).json({
        message:
          "Label and address are required",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    const newAddress = {
      label: label.trim(),
      address: address.trim(),
      isDefault:
        user.savedAddresses.length === 0,
    };

    user.savedAddresses.push(
      newAddress
    );

    await user.save();

    res.status(201).json({
      message:
        "Address added successfully",

      address:
        user.savedAddresses[
          user.savedAddresses.length - 1
        ],

      addresses:
        user.savedAddresses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to add address",

      error: error.message,
    });
  }
};


/* =========================
   UPDATE ADDRESS
========================= */

const updateAddress = async (
  req,
  res
) => {
  try {
    const {
      label,
      address,
    } = req.body;

    if (
      !label ||
      !address
    ) {
      return res.status(400).json({
        message:
          "Label and address are required",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    const savedAddress =
      user.savedAddresses.id(
        req.params.id
      );

    if (!savedAddress) {
      return res.status(404).json({
        message:
          "Address not found",
      });
    }

    savedAddress.label =
      label.trim();

    savedAddress.address =
      address.trim();

    await user.save();

    res.json({
      message:
        "Address updated successfully",

      address:
        savedAddress,

      addresses:
        user.savedAddresses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to update address",

      error: error.message,
    });
  }
};


/* =========================
   DELETE ADDRESS
========================= */

const deleteAddress = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    const savedAddress =
      user.savedAddresses.id(
        req.params.id
      );

    if (!savedAddress) {
      return res.status(404).json({
        message:
          "Address not found",
      });
    }

    const wasDefault =
      savedAddress.isDefault;

    savedAddress.deleteOne();

    if (
      wasDefault &&
      user.savedAddresses.length > 0
    ) {
      user.savedAddresses[0].isDefault =
        true;
    }

    await user.save();

    res.json({
      message:
        "Address deleted successfully",

      addresses:
        user.savedAddresses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to delete address",

      error: error.message,
    });
  }
};


/* =========================
   SET DEFAULT ADDRESS
========================= */

const setDefaultAddress = async (
  req,
  res
) => {
  try {
    const user = await User.findById(
      req.user._id
    );

    const savedAddress =
      user.savedAddresses.id(
        req.params.id
      );

    if (!savedAddress) {
      return res.status(404).json({
        message:
          "Address not found",
      });
    }

    user.savedAddresses.forEach(
      (address) => {
        address.isDefault = false;
      }
    );

    savedAddress.isDefault = true;

    await user.save();

    res.json({
      message:
        "Default address updated",

      addresses:
        user.savedAddresses,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to set default address",

      error: error.message,
    });
  }
};


module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};