import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function RestaurantSetup() {
  const navigate = useNavigate();

  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    cuisine: "",
    deliveryTime: 30,
  });

  const [image, setImage] = useState(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (!selectedImage) {
      return;
    }

    setImage(selectedImage);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const restaurantData = new FormData();

      restaurantData.append(
        "name",
        formData.name
      );

      restaurantData.append(
        "description",
        formData.description
      );

      restaurantData.append(
        "address",
        formData.address
      );

      restaurantData.append(
        "phone",
        formData.phone
      );

      restaurantData.append(
        "cuisine",
        formData.cuisine
      );

      restaurantData.append(
        "deliveryTime",
        formData.deliveryTime
      );

      if (image) {
        restaurantData.append(
          "image",
          image
        );
      }

      await api.post(
        "/restaurants",
        restaurantData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/restaurant-dashboard");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to create restaurant."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <p>
            Restaurant Setup
          </p>

          <h1>
            Create your restaurant
          </h1>

          <span>
            Add your restaurant details to start
            receiving orders on BiteRush.
          </span>

        </div>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="restaurant-name">
              Restaurant Name
            </label>

            <input
              id="restaurant-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="BiteRush Kitchen"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="restaurant-description">
              Description
            </label>

            <textarea
              id="restaurant-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tell customers about your restaurant..."
              rows="3"
            />

          </div>

          <div className="form-group">

            <label htmlFor="restaurant-address">
              Address
            </label>

            <input
              id="restaurant-address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter restaurant address"
              required
            />

          </div>

          <div className="form-group">

            <label htmlFor="restaurant-phone">
              Phone
            </label>

            <input
              id="restaurant-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Restaurant phone number"
            />

          </div>

          <div className="form-group">

            <label htmlFor="restaurant-cuisine">
              Cuisine
            </label>

            <input
              id="restaurant-cuisine"
              type="text"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
              placeholder="Indian, Chinese, Italian..."
            />

          </div>

          <div className="form-group">

            <label htmlFor="restaurant-delivery-time">
              Delivery Time
            </label>

            <input
              id="restaurant-delivery-time"
              type="number"
              name="deliveryTime"
              value={formData.deliveryTime}
              onChange={handleChange}
              min="1"
              placeholder="30"
            />

          </div>

          <div className="form-group">

            <label htmlFor="restaurant-image">
              Restaurant Image
            </label>

            <input
              id="restaurant-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />

            {image && (
              <small>
                Selected: {image.name}
              </small>
            )}

          </div>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating restaurant..."
              : "Create Restaurant"}
          </button>

        </form>

      </div>

    </main>
  );
}

export default RestaurantSetup;