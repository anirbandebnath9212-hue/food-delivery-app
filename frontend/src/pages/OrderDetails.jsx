import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function OrderDetails() {
  const { id } = useParams();

  const { token, isAuthenticated } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  // Review state
  const [review, setReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] =
    useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] =
    useState("");

  const orderStatuses = [
    {
      value: "placed",
      label: "Placed",
    },
    {
      value: "confirmed",
      label: "Confirmed",
    },
    {
      value: "preparing",
      label: "Preparing",
    },
    {
      value: "out_for_delivery",
      label: "Out for Delivery",
    },
    {
      value: "delivered",
      label: "Delivered",
    },
  ];

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(response.data.order);
      setError("");
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


  /* =========================
     FETCH ORDER
  ========================= */

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [id, token, isAuthenticated]);


  /* =========================
     FETCH EXISTING REVIEW
  ========================= */

  useEffect(() => {
    const fetchReview = async () => {
      if (
        !isAuthenticated ||
        !token ||
        !id
      ) {
        return;
      }

      try {
        const response = await api.get(
          `/reviews/order/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.review) {
          setReview(response.data.review);
          setRating(
            response.data.review.rating
          );
          setComment(
            response.data.review.comment || ""
          );
        }
      } catch (error) {
        console.error(
          "Failed to load review:",
          error
        );
      }
    };

    fetchReview();
  }, [id, token, isAuthenticated]);


  /* =========================
     SOCKET.IO
  ========================= */

  useEffect(() => {
    if (
      !isAuthenticated ||
      !token ||
      !id
    ) {
      return;
    }

    const socket =
      io("http://localhost:5000");

    socket.on("connect", () => {
      console.log(
        "Connected to BiteRush real-time server"
      );

      socket.emit(
        "joinOrderRoom",
        id
      );
    });

    socket.on(
      "orderStatusUpdated",
      (data) => {
        if (data.orderId !== id) {
          return;
        }

        setOrder((currentOrder) => {
          if (!currentOrder) {
            return currentOrder;
          }

          return {
            ...currentOrder,
            orderStatus: data.status,
          };
        });
      }
    );

    socket.on("disconnect", () => {
      console.log(
        "Disconnected from BiteRush real-time server"
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [id, token, isAuthenticated]);


  /* =========================
     CANCEL ORDER
  ========================= */

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    setCancelling(true);
    setError("");

    try {
      const response = await api.put(
        `/orders/${id}/cancel`,
        {},
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
          "Failed to cancel order."
      );
    } finally {
      setCancelling(false);
    }
  };


  /* =========================
     SUBMIT REVIEW
  ========================= */

  const handleSubmitReview = async () => {
    setReviewError("");
    setReviewSuccess("");

    if (rating < 1) {
      setReviewError(
        "Please select a rating."
      );
      return;
    }

    setSubmittingReview(true);

    try {
      const response = await api.post(
        "/reviews",
        {
          order: id,
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReview(response.data.review);

      setReviewSuccess(
        "Thank you! Your review has been submitted."
      );
    } catch (error) {
      console.error(error);

      setReviewError(
        error.response?.data?.message ||
          "Failed to submit review."
      );
    } finally {
      setSubmittingReview(false);
    }
  };


  /* =========================
     LOGIN
  ========================= */

  if (!isAuthenticated) {
    return (
      <main className="order-details-message">
        <h1>Please login</h1>

        <p>
          You need to be logged in to view this order.
        </p>

        <Link to="/login">
          Login
        </Link>
      </main>
    );
  }


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="order-details-message">
        <h1>Loading order...</h1>
      </main>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error && !order) {
    return (
      <main className="order-details-message">
        <h1>{error}</h1>

        <Link to="/orders">
          Back to Orders
        </Link>
      </main>
    );
  }


  if (!order) {
    return (
      <main className="order-details-message">
        <h1>Order not found</h1>

        <Link to="/orders">
          Back to Orders
        </Link>
      </main>
    );
  }


  /* =========================
     STATUS
  ========================= */

  const currentStatusIndex =
    orderStatuses.findIndex(
      (status) =>
        status.value ===
        order.orderStatus
    );

  const isCancelled =
    order.orderStatus ===
    "cancelled";

  const canCancel =
    order.orderStatus === "placed" ||
    order.orderStatus === "confirmed";


  /* =========================
     PAYMENT
  ========================= */

  const paymentMethod =
    order.paymentMethod ===
    "cash_on_delivery"
      ? "Cash on Delivery"
      : "Online Payment";

  const paymentStatus =
    order.paymentStatus ||
    "pending";


  return (
    <main className="order-details-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="order-details-header">

        <Link
          to="/orders"
          className="back-orders-link"
        >
          ← Back to Orders
        </Link>

        <p>
          Order
        </p>

        <h1>
          #
          {order._id
            .slice(-6)
            .toUpperCase()}
        </h1>

        <span>
          {order.createdAt
            ? new Date(
                order.createdAt
              ).toLocaleString()
            : ""}
        </span>

      </div>


      {error && (
        <p className="orders-message">
          {error}
        </p>
      )}


      {/* =========================
          ORDER STATUS
      ========================= */}

      <section className="order-status-card">

        <div className="order-status-heading">

          <div>

            <p>
              Current Status
            </p>

            <h2>
              {order.orderStatus.replace(
                /_/g,
                " "
              )}
            </h2>

          </div>


          {canCancel && (
            <button
              type="button"
              className="cancel-order-button"
              onClick={
                handleCancelOrder
              }
              disabled={cancelling}
            >
              {cancelling
                ? "Cancelling..."
                : "Cancel Order"}
            </button>
          )}

        </div>


        {isCancelled ? (

          <div className="cancelled-order-message">
            This order has been cancelled.
          </div>

        ) : (

          <div className="order-progress">

            {orderStatuses.map(
              (status, index) => {

                const isActive =
                  index <=
                  currentStatusIndex;

                return (
                  <div
                    className={`progress-step ${
                      isActive
                        ? "active"
                        : ""
                    }`}
                    key={status.value}
                  >

                    <div className="progress-circle">
                      {index + 1}
                    </div>

                    <span>
                      {status.label}
                    </span>

                  </div>
                );
              }
            )}

          </div>

        )}

      </section>


      {/* =========================
          REVIEW
      ========================= */}

      {order.orderStatus ===
        "delivered" && (
        <section className="review-card">

          <div className="review-header">

            <p>
              Your Experience
            </p>

            <h2>
              Rate Your Order
            </h2>

          </div>


          {review ? (

            <div className="review-submitted">

              <div className="review-stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <span
                      key={star}
                      className={
                        star <= review.rating
                          ? "selected"
                          : ""
                      }
                    >
                      ★
                    </span>
                  )
                )}

              </div>

              <p className="review-comment">
                {review.comment ||
                  "No comment added."}
              </p>

              <p className="review-success">
                Your review has been submitted.
              </p>

            </div>

          ) : (

            <div className="review-form">

              <p>
                How was your experience?
              </p>


              <div className="rating-selector">

                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      type="button"
                      key={star}
                      className={
                        star <= rating
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        setRating(star)
                      }
                    >
                      ★
                    </button>
                  )
                )}

              </div>


              <textarea
                value={comment}
                onChange={(event) =>
                  setComment(
                    event.target.value
                  )
                }
                placeholder="Tell us about your experience..."
                maxLength={500}
                rows={4}
              />


              {reviewError && (
                <p className="review-error">
                  {reviewError}
                </p>
              )}


              {reviewSuccess && (
                <p className="review-success">
                  {reviewSuccess}
                </p>
              )}


              <button
                type="button"
                className="submit-review-button"
                onClick={
                  handleSubmitReview
                }
                disabled={submittingReview}
              >
                {submittingReview
                  ? "Submitting..."
                  : "Submit Review"}
              </button>

            </div>

          )}

        </section>
      )}


      {/* =========================
          ORDER CONTENT
      ========================= */}

      <div className="order-details-layout">

        <div className="order-details-main">

          {/* RESTAURANT */}

          <section className="order-details-card">

            <h2>
              Restaurant
            </h2>

            <div className="details-restaurant">

              <strong>
                {order.restaurant?.name ||
                  "Restaurant"}
              </strong>

              {order.restaurant?.cuisine && (
                <p>
                  {order.restaurant.cuisine}
                </p>
              )}

              {order.restaurant?.address && (
                <p>
                  {order.restaurant.address}
                </p>
              )}

            </div>

          </section>


          {/* ITEMS */}

          <section className="order-details-card">

            <h2>
              Order Items
            </h2>

            <div className="details-items">

              {order.items.map(
                (item, index) => (

                  <div
                    className="details-item"
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

          </section>


          {/* DELIVERY */}

          <section className="order-details-card">

            <h2>
              Delivery Details
            </h2>

            <div>

              <p className="details-address">
                {order.deliveryAddress}
              </p>

            </div>

          </section>

        </div>


        {/* =========================
            SUMMARY
        ========================= */}

        <aside className="order-details-summary">

          <h2>
            Order Summary
          </h2>


          <div className="details-summary-row">

            <span>
              Items
            </span>

            <strong>
              {order.items.reduce(
                (total, item) =>
                  total +
                  item.quantity,
                0
              )}
            </strong>

          </div>


          <div className="details-summary-row">

            <span>
              Payment Method
            </span>

            <strong>
              {paymentMethod}
            </strong>

          </div>


          <div className="details-summary-divider"></div>


          <div className="details-summary-total">

            <span>
              Total
            </span>

            <strong>
              ₹{order.totalPrice}
            </strong>

          </div>


          <div className="payment-status">

            <span>
              Payment Status
            </span>

            <strong>
              {paymentStatus.replace(
                /_/g,
                " "
              )}
            </strong>

          </div>

        </aside>

      </div>

    </main>
  );
}

export default OrderDetails;