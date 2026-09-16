import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Orders() {
  const { token, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [activeFilter, setActiveFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  /* =========================
     FETCH ORDERS
  ========================= */

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

        setOrders(
          response.data.orders || []
        );
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


  /* =========================
     FILTER ORDERS
  ========================= */

  const filteredOrders =
    orders.filter((order) => {
      if (activeFilter === "all") {
        return true;
      }

      if (activeFilter === "active") {
        return [
          "placed",
          "confirmed",
          "preparing",
          "out_for_delivery",
        ].includes(order.orderStatus);
      }

      if (activeFilter === "delivered") {
        return order.orderStatus ===
          "delivered";
      }

      if (activeFilter === "cancelled") {
        return order.orderStatus ===
          "cancelled";
      }

      return true;
    });


  /* =========================
     FILTER COUNTS
  ========================= */

  const activeOrderCount =
    orders.filter((order) =>
      [
        "placed",
        "confirmed",
        "preparing",
        "out_for_delivery",
      ].includes(order.orderStatus)
    ).length;

  const deliveredOrderCount =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "delivered"
    ).length;

  const cancelledOrderCount =
    orders.filter(
      (order) =>
        order.orderStatus ===
        "cancelled"
    ).length;


  /* =========================
     LOGIN
  ========================= */

  if (!isAuthenticated) {
    return (
      <main className="orders-page">

        <div className="orders-login-message">

          <h1>
            Please login
          </h1>

          <p>
            You need to be logged in to view
            your orders.
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
      <main className="orders-page">

        <div className="orders-message">

          <h1>
            Loading orders...
          </h1>

        </div>

      </main>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <main className="orders-page">

        <div className="orders-message">

          <h1>
            {error}
          </h1>

        </div>

      </main>
    );
  }


  return (
    <main className="orders-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="orders-header">

        <p>
          Account
        </p>

        <h1>
          My Orders
        </h1>

        <span>
          Track your previous and current
          orders.
        </span>

      </div>


      {/* =========================
          FILTERS
      ========================= */}

      {orders.length > 0 && (
        <div className="orders-filters">

          <button
            type="button"
            className={
              activeFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("all")
            }
          >
            <span>
              All Orders
            </span>

            <strong>
              {orders.length}
            </strong>
          </button>


          <button
            type="button"
            className={
              activeFilter === "active"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("active")
            }
          >
            <span>
              Active
            </span>

            <strong>
              {activeOrderCount}
            </strong>
          </button>


          <button
            type="button"
            className={
              activeFilter === "delivered"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("delivered")
            }
          >
            <span>
              Delivered
            </span>

            <strong>
              {deliveredOrderCount}
            </strong>
          </button>


          <button
            type="button"
            className={
              activeFilter === "cancelled"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveFilter("cancelled")
            }
          >
            <span>
              Cancelled
            </span>

            <strong>
              {cancelledOrderCount}
            </strong>
          </button>

        </div>
      )}


      {/* =========================
          NO ORDERS
      ========================= */}

      {orders.length === 0 ? (

        <div className="empty-orders">

          <h2>
            No orders yet
          </h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link to="/restaurants">
            Browse Restaurants
          </Link>

        </div>

      ) : filteredOrders.length === 0 ? (

        /* =========================
           NO FILTER RESULTS
        ========================= */

        <div className="empty-orders">

          <h2>
            No {activeFilter} orders
          </h2>

          <p>
            There are no orders in this
            category yet.
          </p>

          <button
            type="button"
            className="orders-reset-filter"
            onClick={() =>
              setActiveFilter("all")
            }
          >
            View All Orders
          </button>

        </div>

      ) : (

        /* =========================
           ORDER LIST
        ========================= */

        <section className="orders-list">

          <div className="orders-result-count">
            Showing{" "}
            <strong>
              {filteredOrders.length}
            </strong>{" "}
            {filteredOrders.length === 1
              ? "order"
              : "orders"}
          </div>


          {filteredOrders.map(
            (order) => (

              <Link
                to={`/orders/${order._id}`}
                className="order-card"
                key={order._id}
              >

                {/* =========================
                    ORDER HEADER
                ========================= */}

                <div className="order-card-header">

                  <div>

                    <p>
                      Order
                    </p>

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


                {/* =========================
                    RESTAURANT
                ========================= */}

                <div className="order-restaurant">

                  <strong>
                    {order.restaurant?.name ||
                      "Restaurant"}
                  </strong>

                  <span>
                    {order.restaurant?.address ||
                      ""}
                  </span>

                </div>


                {/* =========================
                    ITEMS
                ========================= */}

                <div className="order-items">

                  {order.items.map(
                    (item, index) => (

                      <div
                        className="order-item"
                        key={
                          item.food?._id ||
                          item.food ||
                          index
                        }
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

                    )
                  )}

                </div>


                {/* =========================
                    FOOTER
                ========================= */}

                <div className="order-card-footer">

                  <div>

                    <span>
                      Total
                    </span>

                    <strong>
                      ₹{order.totalPrice}
                    </strong>

                  </div>


                  <div>

                    <span>
                      Payment
                    </span>

                    <strong>
                      {order.paymentStatus}
                    </strong>

                  </div>

                </div>


                {/* =========================
                    VIEW DETAILS
                ========================= */}

                <div className="order-view-details">

                  View Order Details →

                </div>

              </Link>

            )
          )}

        </section>

      )}

    </main>
  );
}

export default Orders;