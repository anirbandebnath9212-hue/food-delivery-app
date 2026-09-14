import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function OrderDetails() {
  const { id } = useParams();

  const { token, isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          `/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrder(response.data.order);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load order."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="order-details-page">
        <div className="order-details-message">
          <h1>Please login</h1>

          <p>
            You need to be logged in to view this order.
          </p>

          <Link to="/login">
            Login
          </Link>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="order-details-page">
        <div className="order-details-message">
          <h1>Loading order...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="order-details-page">
        <div className="order-details-message">
          <h1>{error}</h1>

          <Link to="/orders">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="order-details-page">
        <div className="order-details-message">
          <h1>Order not found</h1>

          <Link to="/orders">
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  const statusSteps = [
    "placed",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
  ];

  const currentStatusIndex =
    statusSteps.indexOf(order.orderStatus);

  return (
    <main className="order-details-page">
      <div className="order-details-header">
        <Link
          to="/orders"
          className="back-orders-link"
        >
          ← Back to Orders
        </Link>

        <p>Order Details</p>

        <h1>
          #{order._id.slice(-6).toUpperCase()}
        </h1>

        <span>
          {new Date(order.createdAt).toLocaleString()}
        </span>
      </div>

      <section className="order-status-card">
        <div className="order-status-heading">
          <div>
            <p>Order Status</p>

            <h2>
              {order.orderStatus.replace(
                /_/g,
                " "
              )}
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

        {order.orderStatus === "cancelled" ? (
          <div className="cancelled-order-message">
            This order has been cancelled.
          </div>
        ) : (
          <div className="order-progress">
            {statusSteps.map((status, index) => (
              <div
                className={`progress-step ${
                  index <= currentStatusIndex
                    ? "active"
                    : ""
                }`}
                key={status}
              >
                <div className="progress-circle">
                  {index + 1}
                </div>

                <span>
                  {status.replace(/_/g, " ")}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="order-details-layout">
        <section className="order-details-main">

          <div className="order-details-card">
            <h2>Restaurant</h2>

            <div className="details-restaurant">
              <strong>
                {order.restaurant?.name}
              </strong>

              <p>
                {order.restaurant?.address}
              </p>

              {order.restaurant?.phone && (
                <p>
                  {order.restaurant.phone}
                </p>
              )}
            </div>
          </div>

          <div className="order-details-card">
            <h2>Items</h2>

            <div className="details-items">
              {order.items.map((item) => (
                <div
                  className="details-item"
                  key={item.food}
                >
                  <div>
                    <strong>{item.name}</strong>

                    <p>
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>
                </div>
              ))}
            </div>
          </div>

          <div className="order-details-card">
            <h2>Delivery Address</h2>

            <p className="details-address">
              {order.deliveryAddress}
            </p>
          </div>

        </section>

        <aside className="order-details-summary">
          <h2>Order Summary</h2>

          <div className="details-summary-row">
            <span>Items</span>

            <strong>
              {order.items.reduce(
                (total, item) =>
                  total + item.quantity,
                0
              )}
            </strong>
          </div>

          <div className="details-summary-row">
            <span>Subtotal</span>

            <strong>
              ₹{order.totalPrice}
            </strong>
          </div>

          <div className="details-summary-row">
            <span>Delivery Fee</span>

            <strong>₹0</strong>
          </div>

          <div className="details-summary-divider"></div>

          <div className="details-summary-total">
            <span>Total</span>

            <strong>
              ₹{order.totalPrice}
            </strong>
          </div>

          <div className="payment-status">
            <span>Payment</span>

            <strong>
              {order.paymentStatus}
            </strong>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default OrderDetails;