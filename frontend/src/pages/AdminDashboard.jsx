import { useEffect, useState } from "react";

import {
  FaUsers,
  FaStore,
  FaClipboardList,
  FaRupeeSign,
} from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const {
    user: currentUser,
    token,
  } = useAuth();

  const [stats, setStats] =
    useState(null);

  const [users, setUsers] =
    useState([]);

  const [restaurants, setRestaurants] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingUserId, setUpdatingUserId] =
    useState(null);

  const [
    updatingRestaurantId,
    setUpdatingRestaurantId,
  ] = useState(null);

  const fetchAdminData = async () => {
    try {
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        statsResponse,
        usersResponse,
        restaurantsResponse,
        ordersResponse,
      ] = await Promise.all([
        api.get("/admin/dashboard", {
          headers,
        }),

        api.get("/admin/users", {
          headers,
        }),

        api.get("/admin/restaurants", {
          headers,
        }),

        api.get("/admin/orders", {
          headers,
        }),
      ]);

      setStats(
        statsResponse.data.stats
      );

      setUsers(
        usersResponse.data.users
      );

      setRestaurants(
        restaurantsResponse.data.restaurants
      );

      setOrders(
        ordersResponse.data.orders
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAdminData();
    }
  }, [token]);

  const handleUserStatusChange =
    async (user) => {
      const newStatus =
        user.isActive === false;

      const action = newStatus
        ? "activate"
        : "deactivate";

      const confirmed =
        window.confirm(
          `Are you sure you want to ${action} ${user.name}?`
        );

      if (!confirmed) {
        return;
      }

      setUpdatingUserId(user._id);
      setError("");

      try {
        const response =
          await api.put(
            `/admin/users/${user._id}/status`,
            {
              isActive: newStatus,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setUsers((currentUsers) =>
          currentUsers.map(
            (currentUser) =>
              currentUser._id ===
              user._id
                ? {
                    ...currentUser,
                    isActive:
                      response.data
                        .user.isActive,
                  }
                : currentUser
          )
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to update user."
        );
      } finally {
        setUpdatingUserId(null);
      }
    };

  const handleRestaurantStatusChange =
    async (restaurant) => {
      const newStatus =
        restaurant.isOpen === false;

      const action = newStatus
        ? "open"
        : "close";

      const confirmed =
        window.confirm(
          `Are you sure you want to ${action} ${restaurant.name}?`
        );

      if (!confirmed) {
        return;
      }

      setUpdatingRestaurantId(
        restaurant._id
      );

      setError("");

      try {
        const response =
          await api.put(
            `/admin/restaurants/${restaurant._id}/status`,
            {
              isOpen: newStatus,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setRestaurants(
          (currentRestaurants) =>
            currentRestaurants.map(
              (currentRestaurant) =>
                currentRestaurant._id ===
                restaurant._id
                  ? {
                      ...currentRestaurant,
                      isOpen:
                        response.data
                          .restaurant
                          .isOpen,
                    }
                  : currentRestaurant
            )
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to update restaurant."
        );
      } finally {
        setUpdatingRestaurantId(
          null
        );
      }
    };

  if (loading) {
    return (
      <main className="admin-page">
        <div className="admin-message">
          <h1>
            Loading dashboard...
          </h1>
        </div>
      </main>
    );
  }

  if (error && !stats) {
    return (
      <main className="admin-page">
        <div className="admin-message">
          <h1>
            Admin Dashboard
          </h1>

          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <p>Administration</p>

          <h1>
            Admin Dashboard
          </h1>
        </div>
      </div>

      {error && (
        <p className="admin-error">
          {error}
        </p>
      )}

      {/* STATISTICS */}

      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaUsers />
          </div>

          <div>
            <span>
              Total Users
            </span>

            <strong>
              {stats?.totalUsers || 0}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaStore />
          </div>

          <div>
            <span>
              Restaurants
            </span>

            <strong>
              {stats?.totalRestaurants ||
                0}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaClipboardList />
          </div>

          <div>
            <span>
              Total Orders
            </span>

            <strong>
              {stats?.totalOrders || 0}
            </strong>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon">
            <FaRupeeSign />
          </div>

          <div>
            <span>
              Revenue
            </span>

            <strong>
              ₹{stats?.totalRevenue || 0}
            </strong>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}

      <section className="admin-overview-card">
        <h2>Overview</h2>

        <div className="admin-overview-grid">
          <div>
            <span>
              Customers
            </span>

            <strong>
              {stats?.totalCustomers || 0}
            </strong>
          </div>

          <div>
            <span>
              Restaurant Owners
            </span>

            <strong>
              {stats?.totalRestaurantOwners ||
                0}
            </strong>
          </div>

          <div>
            <span>
              Active Orders
            </span>

            <strong>
              {stats?.pendingOrders || 0}
            </strong>
          </div>

          <div>
            <span>
              Delivered Orders
            </span>

            <strong>
              {stats?.deliveredOrders || 0}
            </strong>
          </div>
        </div>
      </section>

      {/* USERS */}

      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <p>Accounts</p>

            <h2>Users</h2>
          </div>

          <span>
            {users.length} users
          </span>
        </div>

        {users.length === 0 ? (
          <p className="admin-empty">
            No users found.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => {
                  const isActive =
                    user.isActive !== false;

                  const isCurrentUser =
                    user._id ===
                      currentUser?.id ||
                    user._id ===
                      currentUser?._id;

                  return (
                    <tr key={user._id}>
                      <td>
                        <strong>
                          {user.name}
                        </strong>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>
                        {user.phone ||
                          "Not provided"}
                      </td>

                      <td>
                        <span
                          className={`admin-role-badge ${user.role}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge ${
                            isActive
                              ? "open"
                              : "closed"
                          }`}
                        >
                          {isActive
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>

                      <td>
                        {isCurrentUser ? (
                          <span className="admin-self-label">
                            You
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="admin-user-action"
                            onClick={() =>
                              handleUserStatusChange(
                                user
                              )
                            }
                            disabled={
                              updatingUserId ===
                              user._id
                            }
                          >
                            {updatingUserId ===
                            user._id
                              ? "Updating..."
                              : isActive
                              ? "Deactivate"
                              : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* RESTAURANTS */}

      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <p>Business</p>

            <h2>
              Restaurants
            </h2>
          </div>

          <span>
            {restaurants.length} restaurants
          </span>
        </div>

        {restaurants.length === 0 ? (
          <p className="admin-empty">
            No restaurants found.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>
                    Restaurant
                  </th>

                  <th>
                    Cuisine
                  </th>

                  <th>
                    Owner
                  </th>

                  <th>
                    Rating
                  </th>

                  <th>
                    Status
                  </th>

                  <th>
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {restaurants.map(
                  (restaurant) => (
                    <tr
                      key={
                        restaurant._id
                      }
                    >
                      <td>
                        <strong>
                          {
                            restaurant.name
                          }
                        </strong>
                      </td>

                      <td>
                        {restaurant.cuisine ||
                          "Various"}
                      </td>

                      <td>
                        {restaurant.owner
                          ?.name ||
                          "Unknown"}
                      </td>

                      <td>
                        ★{" "}
                        {
                          restaurant.rating
                        }
                      </td>

                      <td>
                        <span
                          className={`admin-status-badge ${
                            restaurant.isOpen
                              ? "open"
                              : "closed"
                          }`}
                        >
                          {restaurant.isOpen
                            ? "Open"
                            : "Closed"}
                        </span>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-user-action"
                          onClick={() =>
                            handleRestaurantStatusChange(
                              restaurant
                            )
                          }
                          disabled={
                            updatingRestaurantId ===
                            restaurant._id
                          }
                        >
                          {updatingRestaurantId ===
                          restaurant._id
                            ? "Updating..."
                            : restaurant.isOpen
                            ? "Close"
                            : "Open"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ORDERS */}

      <section className="admin-section">
        <div className="admin-section-header">
          <div>
            <p>Transactions</p>

            <h2>Orders</h2>
          </div>

          <span>
            {orders.length} orders
          </span>
        </div>

        {orders.length === 0 ? (
          <p className="admin-empty">
            No orders found.
          </p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>
                      <strong>
                        #
                        {order._id
                          .slice(-6)
                          .toUpperCase()}
                      </strong>
                    </td>

                    <td>
                      {order.customer
                        ?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      {order.restaurant
                        ?.name ||
                        "Unknown"}
                    </td>

                    <td>
                      ₹
                      {order.totalPrice}
                    </td>

                    <td>
                      <span className="admin-payment">
                        {order.paymentStatus ||
                          "pending"}
                      </span>
                    </td>

                    <td>
                      <span className="admin-order-status">
                        {order.orderStatus.replace(
                          /_/g,
                          " "
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;