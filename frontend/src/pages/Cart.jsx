import { Link } from "react-router-dom";
import {
  FaMinus,
  FaPlus,
  FaTrash,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <div className="empty-cart">
          <h1>Your cart is empty</h1>

          <p>
            Add some delicious food to your cart and
            come back here.
          </p>

          <Link
            to="/restaurants"
            className="browse-restaurants-button"
          >
            Browse Restaurants
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">

      <div className="cart-header">
        <p>Order</p>

        <h1>Your Cart</h1>
      </div>


      <div className="cart-layout">

        {/* Cart Items */}

        <section className="cart-items">

          {cartItems.map((item) => (
            <div
              className="cart-item"
              key={item.food._id}
            >

              <div className="cart-item-image">

                {item.food.image ? (
                  <img
                    src={item.food.image}
                    alt={item.food.name}
                  />
                ) : (
                  <span>Food Image</span>
                )}

              </div>


              <div className="cart-item-info">

                <h3>
                  {item.food.name}
                </h3>

                <p>
                  {item.restaurant.name}
                </p>

                <strong>
                  ₹{item.food.price}
                </strong>


                <div className="quantity-controls">

                  <button
                    onClick={() =>
                      decreaseQuantity(item.food._id)
                    }
                  >
                    <FaMinus />
                  </button>

                  <span>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      increaseQuantity(item.food._id)
                    }
                  >
                    <FaPlus />
                  </button>

                </div>

              </div>


              <div className="cart-item-right">

                <strong>
                  ₹{item.food.price * item.quantity}
                </strong>

                <button
                  className="remove-item-button"
                  onClick={() =>
                    removeFromCart(item.food._id)
                  }
                >
                  <FaTrash />
                </button>

              </div>

            </div>
          ))}

        </section>


        {/* Order Summary */}

        <aside className="cart-summary">

          <h2>
            Order Summary
          </h2>

          <div className="summary-row">
            <span>
              Subtotal
            </span>

            <strong>
              ₹{cartTotal}
            </strong>
          </div>

          <div className="summary-row">
            <span>
              Delivery Fee
            </span>

            <strong>
              ₹0
            </strong>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-total">
            <span>
              Total
            </span>

            <strong>
              ₹{cartTotal}
            </strong>
          </div>


         <Link
  to="/checkout"
  className="checkout-button"
>
  Proceed to Checkout
</Link>

        </aside>

      </div>

    </main>
  );
}

export default Cart;