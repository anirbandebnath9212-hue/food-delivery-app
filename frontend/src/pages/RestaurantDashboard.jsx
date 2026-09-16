import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function RestaurantDashboard() {
  const navigate = useNavigate();

  const { user, token, isAuthenticated } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [foodForm, setFoodForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });

  const [foodImage, setFoodImage] = useState(null);

  const [editingFoodId, setEditingFoodId] = useState(null);

  const [addingFood, setAddingFood] = useState(false);
  const [foodError, setFoodError] = useState("");

  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  /* =========================
     FETCH DASHBOARD
  ========================= */

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const restaurantResponse =
          await api.get("/restaurants");

        const restaurants =
          restaurantResponse.data.restaurants;

        const ownedRestaurant = restaurants.find(
          (item) =>
            String(item.owner?._id) ===
            String(user?.id || user?._id)
        );

        /* =========================
           RESTAURANT SETUP REDIRECT
        ========================= */

        if (!ownedRestaurant) {
          navigate("/restaurant-setup", {
            replace: true,
          });

          return;
        }

        setRestaurant(ownedRestaurant);

        const [ordersResponse, foodsResponse] =
          await Promise.all([
            api.get(
              `/orders/restaurant/${ownedRestaurant._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            api.get(
              `/foods/restaurant/${ownedRestaurant._id}`
            ),
          ]);

        setOrders(ordersResponse.data.orders);
        setFoods(foodsResponse.data.foods);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load restaurant dashboard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [
    token,
    isAuthenticated,
    user,
    navigate,
  ]);

  /* =========================
     FOOD FORM
  ========================= */

  const handleFoodChange = (event) => {
    setFoodForm({
      ...foodForm,
      [event.target.name]: event.target.value,
    });
  };

  /* =========================
     FOOD IMAGE
  ========================= */

  const handleFoodImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (!selectedImage) {
      return;
    }

    setFoodImage(selectedImage);
  };

  /* =========================
     ADD FOOD
  ========================= */

  const handleAddFood = async (event) => {
    event.preventDefault();

    setFoodError("");
    setAddingFood(true);

    try {
      const foodData = new FormData();

      foodData.append("name", foodForm.name);
      foodData.append(
        "description",
        foodForm.description
      );
      foodData.append(
        "price",
        Number(foodForm.price)
      );
      foodData.append(
        "category",
        foodForm.category
      );
      foodData.append(
        "restaurant",
        restaurant._id
      );

      if (foodImage) {
        foodData.append("image", foodImage);
      }

      const response = await api.post(
        "/foods",
        foodData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFoods((currentFoods) => [
        response.data.food,
        ...currentFoods,
      ]);

      setFoodForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
      });

      setFoodImage(null);

      const imageInput =
        document.getElementById("food-image");

      if (imageInput) {
        imageInput.value = "";
      }
    } catch (error) {
      console.error(error);

      setFoodError(
        error.response?.data?.message ||
          "Failed to add food."
      );
    } finally {
      setAddingFood(false);
    }
  };

  /* =========================
     START EDITING FOOD
  ========================= */

  const handleEditFood = (food) => {
    setEditingFoodId(food._id);

    setFoodForm({
      name: food.name,
      description: food.description,
      price: food.price,
      category: food.category,
      image: food.image,
    });

    setFoodImage(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     UPDATE FOOD
  ========================= */

const handleUpdateFood = async (event) => {
  event.preventDefault();

  setFoodError("");
  setAddingFood(true);

  try {
    const foodData = new FormData();

    foodData.append("name", foodForm.name);
    foodData.append(
      "description",
      foodForm.description
    );
    foodData.append(
      "price",
      Number(foodForm.price)
    );
    foodData.append(
      "category",
      foodForm.category
    );

    // Send a new image only if the owner selected one
    if (foodImage) {
      foodData.append("image", foodImage);
    }

    const response = await api.put(
      `/foods/${editingFoodId}`,
      foodData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setFoods((currentFoods) =>
      currentFoods.map((food) =>
        food._id === editingFoodId
          ? response.data.food
          : food
      )
    );

    setFoodForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });

    setFoodImage(null);
    setEditingFoodId(null);

    const imageInput =
      document.getElementById("food-image");

    if (imageInput) {
      imageInput.value = "";
    }
  } catch (error) {
    console.error(error);

    setFoodError(
      error.response?.data?.message ||
        "Failed to update food."
    );
  } finally {
    setAddingFood(false);
  }
};
  /* =========================
     DELETE FOOD
  ========================= */

  const handleDeleteFood = async (foodId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food item?"
    );

    if (!confirmed) {
      return;
    }

    setFoodError("");

    try {
      await api.delete(`/foods/${foodId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFoods((currentFoods) =>
        currentFoods.filter(
          (food) => food._id !== foodId
        )
      );
    } catch (error) {
      console.error(error);

      setFoodError(
        error.response?.data?.message ||
          "Failed to delete food."
      );
    }
  };

  /* =========================
     TOGGLE AVAILABILITY
  ========================= */

  const handleToggleAvailability = async (food) => {
    setFoodError("");

    try {
      const response = await api.put(
        `/foods/${food._id}`,
        {
          isAvailable: !food.isAvailable,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFoods((currentFoods) =>
        currentFoods.map((currentFood) =>
          currentFood._id === food._id
            ? response.data.food
            : currentFood
        )
      );
    } catch (error) {
      console.error(error);

      setFoodError(
        error.response?.data?.message ||
          "Failed to update availability."
      );
    }
  };

  /* =========================
     CANCEL EDIT
  ========================= */

  const handleCancelEdit = () => {
    setEditingFoodId(null);

    setFoodForm({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    });

    setFoodImage(null);
    setFoodError("");

    const imageInput =
      document.getElementById("food-image");

    if (imageInput) {
      imageInput.value = "";
    }
  };

  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    setUpdatingOrderId(orderId);
    setError("");

    try {
      const response = await api.put(
        `/orders/${orderId}/status`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? response.data.order
            : order
        )
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update order status."
      );
    } finally {
      setUpdatingOrderId(null);
    }
  };

  /* =========================
     AUTH CHECK
  ========================= */

  if (!isAuthenticated) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-message">
          <h1>Please login</h1>

          <p>
            You need to be logged in to access the
            restaurant dashboard.
          </p>

          <Link to="/login">
            Login
          </Link>
        </div>
      </main>
    );
  }

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-message">
          <h1>Loading dashboard...</h1>
        </div>
      </main>
    );
  }

  /* =========================
     RESTAURANT NOT FOUND
  ========================= */

  if (error && !restaurant) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-message">
          <h1>{error}</h1>

          <Link to="/">
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard-page">

      {/* =========================
          DASHBOARD HEADER
      ========================= */}

      <div className="dashboard-header">
        <div>
          <p>Restaurant Dashboard</p>

          <h1>{restaurant.name}</h1>

          <span>
            Manage your orders and menu.
          </span>
        </div>

        <div className="dashboard-stats">

          <div className="dashboard-stat">
            <strong>
              {orders.length}
            </strong>

            <span>
              Total Orders
            </span>
          </div>

          <div className="dashboard-stat">
            <strong>
              {
                orders.filter(
                  (order) =>
                    order.orderStatus !==
                      "delivered" &&
                    order.orderStatus !==
                      "cancelled"
                ).length
              }
            </strong>

            <span>
              Active Orders
            </span>
          </div>

          <div className="dashboard-stat">
            <strong>
              {foods.length}
            </strong>

            <span>
              Menu Items
            </span>
          </div>

        </div>
      </div>

      {error && (
        <p className="dashboard-error">
          {error}
        </p>
      )}

      {/* =========================
          MENU MANAGEMENT
      ========================= */}

      <section className="menu-management">

        <div className="dashboard-section-header">
          <div>
            <p>Menu</p>

            <h2>
              Manage Food
            </h2>
          </div>
        </div>

        <div className="menu-management-layout">

          {/* ADD / EDIT FOOD */}

          <div className="add-food-card">

            <h3>
              {editingFoodId
                ? "Edit Food"
                : "Add New Food"}
            </h3>

            <form
              className="food-form"
              onSubmit={
                editingFoodId
                  ? handleUpdateFood
                  : handleAddFood
              }
            >

              <div className="form-group">
                <label htmlFor="food-name">
                  Food Name
                </label>

                <input
                  id="food-name"
                  type="text"
                  name="name"
                  value={foodForm.name}
                  onChange={handleFoodChange}
                  placeholder="Chicken Biryani"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="food-description">
                  Description
                </label>

                <textarea
                  id="food-description"
                  name="description"
                  value={foodForm.description}
                  onChange={handleFoodChange}
                  placeholder="Delicious chicken biryani..."
                  rows="3"
                />
              </div>

              <div className="food-form-row">

                <div className="form-group">
                  <label htmlFor="food-price">
                    Price
                  </label>

                  <input
                    id="food-price"
                    type="number"
                    name="price"
                    value={foodForm.price}
                    onChange={handleFoodChange}
                    placeholder="250"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="food-category">
                    Category
                  </label>

                  <input
                    id="food-category"
                    type="text"
                    name="category"
                    value={foodForm.category}
                    onChange={handleFoodChange}
                    placeholder="Biryani"
                  />
                </div>

              </div>

              {/* FOOD IMAGE */}

              <div className="form-group">
                <label htmlFor="food-image">
                  Food Image
                </label>

                <input
                  id="food-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFoodImageChange}
                />

                {foodImage && (
                  <small>
                    Selected: {foodImage.name}
                  </small>
                )}

                {editingFoodId &&
                  !foodImage &&
                  foodForm.image && (
                    <small>
                      Current image will be kept.
                    </small>
                  )}
              </div>

              {foodError && (
                <p className="food-form-error">
                  {foodError}
                </p>
              )}

              <button
                type="submit"
                className="add-food-button"
                disabled={addingFood}
              >
                {addingFood
                  ? editingFoodId
                    ? "Updating..."
                    : "Adding..."
                  : editingFoodId
                    ? "Update Food"
                    : "Add Food"}
              </button>

              {editingFoodId && (
                <button
                  type="button"
                  className="menu-action-button"
                  onClick={handleCancelEdit}
                >
                  Cancel Edit
                </button>
              )}

            </form>

          </div>

          {/* CURRENT MENU */}

          <div className="current-menu-card">

            <div className="current-menu-header">
              <h3>
                Current Menu
              </h3>

              <span>
                {foods.length} items
              </span>
            </div>

            {foods.length === 0 ? (
              <div className="empty-menu">
                <p>
                  No food items yet.
                </p>
              </div>
            ) : (
              <div className="menu-list">

                {foods.map((food) => (
                  <div
                    className="menu-item"
                    key={food._id}
                  >

                    <div className="menu-item-image">
                      {food.image ? (
                        <img
                          src={food.image}
                          alt={food.name}
                        />
                      ) : (
                        <span>
                          Food
                        </span>
                      )}
                    </div>

                    <div className="menu-item-info">

                      <div className="menu-item-title">
                        <h4>
                          {food.name}
                        </h4>

                        <strong>
                          ₹{food.price}
                        </strong>
                      </div>

                      <p>
                        {food.description ||
                          "No description"}
                      </p>

                      <span>
                        {food.category ||
                          "Uncategorized"}
                      </span>

                    </div>

                    <div className="menu-item-actions">

                      <div
                        className={`menu-availability ${
                          food.isAvailable
                            ? "available"
                            : "unavailable"
                        }`}
                      >
                        {food.isAvailable
                          ? "Available"
                          : "Unavailable"}
                      </div>

                      <button
                        type="button"
                        className="menu-action-button"
                        onClick={() =>
                          handleToggleAvailability(
                            food
                          )
                        }
                      >
                        {food.isAvailable
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <button
                        type="button"
                        className="menu-action-button"
                        onClick={() =>
                          handleEditFood(food)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="menu-action-button delete"
                        onClick={() =>
                          handleDeleteFood(
                            food._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =========================
          CUSTOMER ORDERS
      ========================= */}

      <section className="dashboard-orders-section">

        <div className="dashboard-section-header">
          <div>
            <p>Orders</p>

            <h2>
              Customer Orders
            </h2>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="empty-dashboard">
            <h2>
              No orders yet
            </h2>

            <p>
              New customer orders will
              appear here.
            </p>
          </div>
        ) : (
          <section className="dashboard-orders">

            {orders.map((order) => (
              <div
                className="dashboard-order-card"
                key={order._id}
              >

                <div className="dashboard-order-header">

                  <div>
                    <p>Order</p>

                    <h2>
                      #
                      {order._id
                        .slice(-6)
                        .toUpperCase()}
                    </h2>
                  </div>

                  <span
                    className={`order-status ${order.orderStatus}`}
                  >
                    {order.orderStatus.replace(
                      /_/g,
                      " "
                    )}
                  </span>

                </div>

                <div className="customer-details">

                  <h3>
                    {order.customer?.name ||
                      "Customer"}
                  </h3>

                  <p>
                    {order.customer?.email}
                  </p>

                  {order.customer?.phone && (
                    <p>
                      {order.customer.phone}
                    </p>
                  )}

                </div>

                <div className="dashboard-order-items">

                  {order.items.map((item) => (
                    <div
                      className="dashboard-order-item"
                      key={item.food._id}
                    >
                      <div>
                        <strong>
                          {item.name}
                        </strong>

                        <p>
                          {item.quantity} × ₹
                          {item.price}
                        </p>
                      </div>

                      <strong>
                        ₹
                        {item.price *
                          item.quantity}
                      </strong>
                    </div>
                  ))}

                </div>

                <div className="dashboard-order-info">

                  <div>
                    <span>
                      Delivery Address
                    </span>

                    <strong>
                      {order.deliveryAddress}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{order.totalPrice}
                    </strong>
                  </div>

                </div>

                <div className="status-actions">

                  <span>
                    Update Status
                  </span>

                  <div className="status-buttons">

                    {order.orderStatus ===
                      "placed" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            "confirmed"
                          )
                        }
                        disabled={
                          updatingOrderId ===
                          order._id
                        }
                      >
                        Confirm Order
                      </button>
                    )}

                    {order.orderStatus ===
                      "confirmed" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            "preparing"
                          )
                        }
                        disabled={
                          updatingOrderId ===
                          order._id
                        }
                      >
                        Start Preparing
                      </button>
                    )}

                    {order.orderStatus ===
                      "preparing" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            "out_for_delivery"
                          )
                        }
                        disabled={
                          updatingOrderId ===
                          order._id
                        }
                      >
                        Out for Delivery
                      </button>
                    )}

                    {order.orderStatus ===
                      "out_for_delivery" && (
                      <button
                        onClick={() =>
                          updateOrderStatus(
                            order._id,
                            "delivered"
                          )
                        }
                        disabled={
                          updatingOrderId ===
                          order._id
                        }
                      >
                        Mark Delivered
                      </button>
                    )}

                    {updatingOrderId ===
                      order._id && (
                      <span className="updating-text">
                        Updating...
                      </span>
                    )}

                  </div>

                </div>

              </div>
            ))}

          </section>
        )}

      </section>

    </main>
  );
}

export default RestaurantDashboard;