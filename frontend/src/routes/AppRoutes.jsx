import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "../components/Navbar";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Restaurants from "../pages/Restaurants";
import RestaurantDetails from "../pages/RestaurantDetails";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Profile from "../pages/Profile";
import Checkout from "../pages/Checkout";
import OrderDetails from "../pages/OrderDetails";
import RestaurantDashboard from "../pages/RestaurantDashboard";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/restaurants"
          element={<Restaurants />}
        />

        <Route
          path="/restaurants/:id"
          element={<RestaurantDetails />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Protected Routes */}

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
  path="/restaurant-dashboard"
  element={
    <ProtectedRoute role="restaurant">
      <RestaurantDashboard />
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;