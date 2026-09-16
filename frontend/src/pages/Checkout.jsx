import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck, FaMapMarkerAlt } from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Checkout() {
  const navigate = useNavigate();

  const { user, token, isAuthenticated } =
    useAuth();

  const {
    cartItems,
    cartTotal,
    clearCart,
  } = useCart();


  /* =========================
     DELIVERY ADDRESS
  ========================= */

  const [deliveryAddress, setDeliveryAddress] =
    useState(user?.address || "");

  const [savedAddresses, setSavedAddresses] =
    useState([]);

  const [selectedAddressId, setSelectedAddressId] =
    useState(null);

  const [loadingAddresses, setLoadingAddresses] =
    useState(true);


  /* =========================
     PAYMENT
  ========================= */

  const [paymentMethod, setPaymentMethod] =
    useState("cash_on_delivery");


  /* =========================
     GENERAL STATE
  ========================= */

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  /* =========================
     AUTH CHECK
  ========================= */

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);


  /* =========================
     LOAD USER ADDRESS
  ========================= */

  useEffect(() => {
    if (user?.address) {
      setDeliveryAddress(user.address);
    }
  }, [user]);


  /* =========================
     LOAD SAVED ADDRESSES
  ========================= */

  useEffect(() => {
    const fetchSavedAddresses = async () => {
      if (!isAuthenticated) {
        setLoadingAddresses(false);
        return;
      }

      try {
        setLoadingAddresses(true);

        const response = await api.get(
          "/addresses"
        );

        const addresses =
          response.data.addresses || [];

        setSavedAddresses(addresses);


        /* =========================
           SELECT DEFAULT ADDRESS
        ========================= */

        const defaultAddress =
          addresses.find(
            (address) => address.isDefault
          );

        if (defaultAddress) {
          setSelectedAddressId(
            defaultAddress._id
          );

          setDeliveryAddress(
            defaultAddress.address
          );
        } else if (addresses.length > 0) {
          setSelectedAddressId(
            addresses[0]._id
          );

          setDeliveryAddress(
            addresses[0].address
          );
        }

      } catch (error) {
        console.error(error);

        /*
          We don't show an error here because
          the user can still manually enter
          an address.
        */
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchSavedAddresses();
  }, [isAuthenticated]);


  /* =========================
     SELECT SAVED ADDRESS
  ========================= */

  const handleSelectAddress = (
    savedAddress
  ) => {
    setSelectedAddressId(
      savedAddress._id
    );

    setDeliveryAddress(
      savedAddress.address
    );

    setError("");
  };


  /* =========================
     MANUAL ADDRESS CHANGE
  ========================= */

  const handleDeliveryAddressChange = (
    event
  ) => {
    setDeliveryAddress(
      event.target.value
    );

    /*
      If the user manually changes the
      address, remove the selected saved
      address highlight.
    */

    setSelectedAddressId(null);
  };


  /* =========================
     EMPTY CART
  ========================= */

  if (!isAuthenticated) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">

        <div className="empty-checkout">

          <h1>
            Your cart is empty
          </h1>

          <p>
            Add some food before checking out.
          </p>

          <button
            onClick={() =>
              navigate("/restaurants")
            }
          >
            Browse Restaurants
          </button>

        </div>

      </main>
    );
  }


  /* =========================
     RESTAURANT CHECK
  ========================= */

  const restaurantId =
    cartItems[0].restaurant._id;

  const hasMultipleRestaurants =
    cartItems.some(
      (item) =>
        item.restaurant._id !==
        restaurantId
    );


  /* =========================
     PLACE ORDER
  ========================= */

  const handlePlaceOrder = async (
    event
  ) => {
    event.preventDefault();

    setError("");


    /* ADDRESS VALIDATION */

    if (!deliveryAddress.trim()) {
      setError(
        "Please enter your delivery address."
      );

      return;
    }


    /* RESTAURANT VALIDATION */

    if (hasMultipleRestaurants) {
      setError(
        "Your cart contains food from multiple restaurants. Please order from one restaurant at a time."
      );

      return;
    }


    /* PAYMENT VALIDATION */

    if (paymentMethod === "online") {
      setError(
        "Online payment is not available yet. Please select Cash on Delivery."
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

        deliveryAddress:
          deliveryAddress.trim(),

        paymentMethod,
      };


      await api.post(
        "/orders",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


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

      {/* =========================
          CHECKOUT HEADER
      ========================= */}

      <div className="checkout-header">

        <p>
          Order
        </p>

        <h1>
          Checkout
        </h1>

      </div>


      <div className="checkout-layout">


        {/* =========================
            CHECKOUT FORM
        ========================= */}

        <section className="checkout-form-section">

          <div className="checkout-card">

            <h2>
              Delivery Details
            </h2>


            <form
              onSubmit={handlePlaceOrder}
            >


              {/* =========================
                  SAVED ADDRESSES
              ========================= */}

              <div className="checkout-saved-addresses">

                <div className="checkout-address-heading">

                  <div>
                    <h3>
                      Saved Addresses
                    </h3>

                    <p>
                      Select an address for delivery.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="manage-addresses-button"
                    onClick={() =>
                      navigate("/profile")
                    }
                  >
                    Manage Addresses
                  </button>

                </div>


                {loadingAddresses ? (
                  <div className="checkout-address-loading">
                    Loading saved addresses...
                  </div>
                ) : savedAddresses.length === 0 ? (
                  <div className="checkout-no-addresses">

                    <FaMapMarkerAlt />

                    <div>
                      <strong>
                        No saved addresses
                      </strong>

                      <p>
                        You can enter your delivery
                        address below.
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="checkout-address-list">

                    {savedAddresses.map(
                      (savedAddress) => (
                        <button
                          type="button"
                          key={savedAddress._id}
                          className={`checkout-address-option ${
                            selectedAddressId ===
                            savedAddress._id
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleSelectAddress(
                              savedAddress
                            )
                          }
                        >

                          <div className="checkout-address-icon">
                            <FaMapMarkerAlt />
                          </div>


                          <div className="checkout-address-content">

                            <div className="checkout-address-title">

                              <strong>
                                {savedAddress.label}
                              </strong>

                              {savedAddress.isDefault && (
                                <span className="checkout-default-badge">
                                  Default
                                </span>
                              )}

                            </div>

                            <p>
                              {savedAddress.address}
                            </p>

                          </div>


                          {selectedAddressId ===
                            savedAddress._id && (
                            <div className="checkout-address-check">
                              <FaCheck />
                            </div>
                          )}

                        </button>
                      )
                    )}

                  </div>
                )}

              </div>


              {/* =========================
                  DELIVERY ADDRESS
              ========================= */}

              <div className="form-group">

                <label htmlFor="deliveryAddress">
                  Delivery Address
                </label>

                <textarea
                  id="deliveryAddress"
                  value={deliveryAddress}
                  onChange={
                    handleDeliveryAddressChange
                  }
                  placeholder="Enter your delivery address"
                  rows="4"
                  required
                />

                <p className="checkout-address-hint">
                  You can edit the address above
                  or select one of your saved addresses.
                </p>

              </div>


              {/* =========================
                  PAYMENT METHOD
              ========================= */}

              <div className="payment-method-section">

                <h3>
                  Payment Method
                </h3>


                <label className="payment-option">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash_on_delivery"
                    checked={
                      paymentMethod ===
                      "cash_on_delivery"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <div>

                    <strong>
                      Cash on Delivery
                    </strong>

                    <p>
                      Pay when your order arrives.
                    </p>

                  </div>

                </label>


                <label className="payment-option">

                  <input
                    type="radio"
                    name="paymentMethod"
                    value="online"
                    checked={
                      paymentMethod ===
                      "online"
                    }
                    onChange={(event) =>
                      setPaymentMethod(
                        event.target.value
                      )
                    }
                  />

                  <div>

                    <strong>
                      Online Payment
                    </strong>

                    <p>
                      Razorpay payment will be
                      available soon.
                    </p>

                  </div>

                </label>

              </div>


              {/* =========================
                  ONLINE PAYMENT MESSAGE
              ========================= */}

              {paymentMethod ===
                "online" && (
                <p className="checkout-error">
                  Online payment is not available
                  yet. Please select Cash on Delivery.
                </p>
              )}


              {/* =========================
                  ERROR
              ========================= */}

              {error && (
                <p className="checkout-error">
                  {error}
                </p>
              )}


              {/* =========================
                  PLACE ORDER
              ========================= */}

              <button
                type="submit"
                className="place-order-button"
                disabled={
                  loading ||
                  paymentMethod === "online"
                }
              >
                {loading
                  ? "Placing Order..."
                  : "Place Order"}
              </button>

            </form>

          </div>

        </section>


        {/* =========================
            ORDER SUMMARY
        ========================= */}

        <aside className="checkout-summary">

          <h2>
            Order Summary
          </h2>


          <div className="checkout-items">

            {cartItems.map((item) => (
              <div
                className="checkout-item"
                key={item.food._id}
              >

                <div>

                  <strong>
                    {item.food.name}
                  </strong>

                  <p>
                    {item.quantity} × ₹
                    {item.food.price}
                  </p>

                </div>

                <strong>
                  ₹
                  {item.food.price *
                    item.quantity}
                </strong>

              </div>
            ))}

          </div>


          <div className="checkout-divider"></div>


          <div className="checkout-total">

            <span>
              Total
            </span>

            <strong>
              ₹{cartTotal}
            </strong>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default Checkout;