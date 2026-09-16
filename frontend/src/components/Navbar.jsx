import { Link } from "react-router-dom";

import {
  FaShoppingCart,
  FaUser,
  FaClipboardList,
  FaStore,
  FaUserShield,
  FaHeart,
} from "react-icons/fa";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const { cartCount } = useCart();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-logo"
        >
          BiteRush
        </Link>


        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          <Link to="/restaurants">
            Restaurants
          </Link>


          <Link
            to="/cart"
            className="navbar-icon"
          >
            <FaShoppingCart />

            <span>
              Cart
            </span>

            {cartCount > 0 && (
              <span className="cart-badge">
                {cartCount}
              </span>
            )}
          </Link>


          {isAuthenticated ? (
            <>

              <Link
                to="/favorites"
                className="navbar-icon"
              >
                <FaHeart />

                <span>
                  Favorites
                </span>
              </Link>


              {user?.role === "restaurant" && (
                <Link
                  to="/restaurant-dashboard"
                  className="navbar-icon"
                >
                  <FaStore />

                  <span>
                    Dashboard
                  </span>
                </Link>
              )}


              {user?.role === "admin" && (
                <Link
                  to="/admin-dashboard"
                  className="navbar-icon"
                >
                  <FaUserShield />

                  <span>
                    Admin
                  </span>
                </Link>
              )}


              <Link
                to="/orders"
                className="navbar-icon"
              >
                <FaClipboardList />

                <span>
                  Orders
                </span>
              </Link>


              <Link
                to="/profile"
                className="navbar-icon"
              >
                <FaUser />

                <span>
                  {user?.name ||
                    "Profile"}
                </span>
              </Link>


              <button
                className="logout-button"
                onClick={logout}
              >
                Logout
              </button>

            </>
          ) : (
            <>

              <Link
                to="/login"
                className="navbar-icon"
              >
                <FaUser />

                <span>
                  Login
                </span>
              </Link>

              <Link to="/register">
                Register
              </Link>

            </>
          )}

        </div>

      </div>
    </nav>
  );
}

export default Navbar;