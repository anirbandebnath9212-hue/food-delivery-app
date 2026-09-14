import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { token, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(
          "/orders/my-orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setOrders(response.data.orders);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load orders."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="orders-page">
        <div className="orders-login-message">
          <h1>Please login</h1>

          <p>
            You need to be logged in to view your orders.
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
      <main className="orders-page">
        <div className="orders-message">
          <h1>Loading orders...</h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="orders-page">
        <div className="orders-message">
          <h1>{error}</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="orders-header">
        <p>Account</p>

        <h1>My Orders</h1>

        <span>
          Track your previous and current orders.
        </span>
      </div>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h2>No orders yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link to="/restaurants">
            Browse Restaurants
          </Link>
        </div>
      ) : (
        <section className="orders-list">
          {orders.map((order) => (
            <Link
              to={`/orders/${order._id}`}
              className="order-card"
              key={order._id}
            >
              <div className="order-card-header">
                <div>
                  <p>Order</p>

                  <h2>
                    #{order._id.slice(-6).toUpperCase()}
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

              <div className="order-restaurant">
                <strong>
                  {order.restaurant?.name ||
                    "Restaurant"}
                </strong>

                <span>
                  {order.restaurant?.address || ""}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div
                    className="order-item"
                    key={item.food._id}
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

              <div className="order-card-footer">
                <div>
                  <span>Total</span>

                  <strong>
                    ₹{order.totalPrice}
                  </strong>
                </div>

                <div>
                  <span>Payment</span>

                  <strong>
                    {order.paymentStatus}
                  </strong>
                </div>
              </div>

              <div className="order-view-details">
                View Order Details →
              </div>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}

export default Orders;