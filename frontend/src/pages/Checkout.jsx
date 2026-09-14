import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { user, token, isAuthenticated } = useAuth();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();

  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.address || ""
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.address) {
      setDeliveryAddress(user.address);
    }
  }, [user]);

  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="empty-checkout">
          <h1>Your cart is empty</h1>
          <p>Add some food before checking out.</p>

          <button
            onClick={() => navigate("/restaurants")}
          >
            Browse Restaurants
          </button>
        </div>
      </main>
    );
  }

  const restaurantId = cartItems[0].restaurant._id;

  const hasMultipleRestaurants = cartItems.some(
    (item) =>
      item.restaurant._id !== restaurantId
  );

  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    setError("");

    if (!deliveryAddress.trim()) {
      setError("Please enter your delivery address.");
      return;
    }

    if (hasMultipleRestaurants) {
      setError(
        "Your cart contains food from multiple restaurants. Please order from one restaurant at a time."
      );
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        restaurant: restaurantId,

        items: cartItems.map((item) => ({
          food: item.food._id,
          quantity: item.quantity,
        })),

        deliveryAddress: deliveryAddress.trim(),
      };

      await api.post("/orders", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      clearCart();

      navigate("/orders");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="checkout-page">
      <div className="checkout-header">
        <p>Order</p>
        <h1>Checkout</h1>
      </div>

      <div className="checkout-layout">

        <section className="checkout-form-section">
          <div className="checkout-card">
            <h2>Delivery Details</h2>

            <form onSubmit={handlePlaceOrder}>
              <div className="form-group">
                <label htmlFor="deliveryAddress">
                  Delivery Address
                </label>

                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={(event) =>
                    setDeliveryAddress(event.target.value)
                  }
                  placeholder="Enter your delivery address"
                  rows="4"
                  required
                />
              </div>

              {error && (
                <p className="checkout-error">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="place-order-button"
                disabled={loading}
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>
            </form>
          </div>
        </section>

        <aside className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item.food._id}
              >
                <div>
                  <strong>{item.food.name}</strong>

                  <p>
                    {item.quantity} × ₹{item.food.price}
                  </p>
                </div>

                <strong>
                  ₹{item.food.price * item.quantity}
                </strong>
              </div>
            ))}
          </div>

          <div className="checkout-divider"></div>

          <div className="checkout-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>
        </aside>

      </div>
    </main>
  );
}

export default Checkout;