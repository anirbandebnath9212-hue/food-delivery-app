import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function RestaurantDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isFavorite, setIsFavorite] = useState(false);
  const [foodFavorites, setFoodFavorites] =
    useState([]);

  const [favoriteLoading, setFavoriteLoading] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] =
    useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH RESTAURANT + FOODS
  ========================= */

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const restaurantResponse =
          await api.get(`/restaurants/${id}`);

        const foodsResponse =
          await api.get(
            `/foods/restaurant/${id}`
          );

        setRestaurant(
          restaurantResponse.data.restaurant
        );

        setFoods(
          foodsResponse.data.foods || []
        );
      } catch (error) {
        console.error(error);

        setError(
          "Failed to load restaurant"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);


  /* =========================
     FETCH REVIEWS
  ========================= */

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(
          `/reviews/restaurant/${id}`
        );

        setReviews(
          response.data.reviews || []
        );
      } catch (error) {
        console.error(
          "Failed to load reviews:",
          error
        );
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [id]);


  /* =========================
     CHECK RESTAURANT FAVORITE
  ========================= */

  useEffect(() => {
    const checkRestaurantFavorite =
      async () => {
        if (!isAuthenticated) {
          setIsFavorite(false);
          return;
        }

        try {
          const response =
            await api.get(
              `/favorites/${id}`
            );

          setIsFavorite(
            response.data.isFavorite
          );
        } catch (error) {
          console.error(
            "Failed to check restaurant favorite:",
            error
          );
        }
      };

    checkRestaurantFavorite();
  }, [id, isAuthenticated]);


  /* =========================
     FETCH FAVORITE FOODS
  ========================= */

  useEffect(() => {
    const fetchFavoriteFoods =
      async () => {
        if (!isAuthenticated) {
          setFoodFavorites([]);
          return;
        }

        try {
          const response =
            await api.get(
              "/food-favorites"
            );

          const favoriteFoodIds =
            (
              response.data
                .favoriteFoods || []
            ).map(
              (food) => food._id
            );

          setFoodFavorites(
            favoriteFoodIds
          );
        } catch (error) {
          console.error(
            "Failed to load favorite foods:",
            error
          );
        }
      };

    fetchFavoriteFoods();
  }, [isAuthenticated]);


  /* =========================
     TOGGLE RESTAURANT FAVORITE
  ========================= */

  const handleFavorite = async () => {
    if (!isAuthenticated) {
      return;
    }

    try {
      setFavoriteLoading(true);

      if (isFavorite) {
        await api.delete(
          `/favorites/${id}`
        );

        setIsFavorite(false);
      } else {
        await api.post(
          `/favorites/${id}`
        );

        setIsFavorite(true);
      }
    } catch (error) {
      console.error(
        "Failed to update favorite:",
        error
      );
    } finally {
      setFavoriteLoading(false);
    }
  };


  /* =========================
     TOGGLE FOOD FAVORITE
  ========================= */

  const handleFoodFavorite = async (
    event,
    foodId
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      return;
    }

    const alreadyFavorite =
      foodFavorites.includes(
        foodId
      );

    try {
      if (alreadyFavorite) {
        await api.delete(
          `/food-favorites/${foodId}`
        );

        setFoodFavorites(
          (currentFavorites) =>
            currentFavorites.filter(
              (id) =>
                id !== foodId
            )
        );
      } else {
        await api.post(
          `/food-favorites/${foodId}`
        );

        setFoodFavorites(
          (currentFavorites) => [
            ...currentFavorites,
            foodId,
          ]
        );
      }
    } catch (error) {
      console.error(
        "Failed to update food favorite:",
        error
      );
    }
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="restaurant-details-page">
        <h1>Loading...</h1>
      </main>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <main className="restaurant-details-page">
        <h1>{error}</h1>
      </main>
    );
  }


  /* =========================
     NOT FOUND
  ========================= */

  if (!restaurant) {
    return (
      <main className="restaurant-details-page">
        <h1>Restaurant not found</h1>
      </main>
    );
  }


  return (
    <main className="restaurant-details-page">

      {/* =========================
          RESTAURANT HEADER
      ========================= */}

      <section className="restaurant-details-header">

        <div className="restaurant-details-image">

          {restaurant.image ? (
            <img
              src={restaurant.image}
              alt={restaurant.name}
            />
          ) : (
            <span>
              Restaurant Image
            </span>
          )}

        </div>


        <div className="restaurant-details-info">

          <div className="restaurant-details-title-row">

            <div>

              <p>
                {restaurant.cuisine ||
                  "Various Cuisine"}
              </p>

              <h1>
                {restaurant.name}
              </h1>

            </div>


            {isAuthenticated && (
              <button
                type="button"
                className={`favorite-button ${
                  isFavorite
                    ? "active"
                    : ""
                }`}
                onClick={handleFavorite}
                disabled={favoriteLoading}
                title={
                  isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <FaHeart />
              </button>
            )}

          </div>


          <p>
            {restaurant.description}
          </p>


          <div className="restaurant-meta">

            <span>
              ★ {restaurant.rating}
            </span>

            <span>
              {restaurant.deliveryTime} min
            </span>

            <span>
              {restaurant.address}
            </span>

          </div>

        </div>

      </section>


      {/* =========================
          FOOD MENU
      ========================= */}

      <section className="food-section">

        <div className="food-section-header">

          <p>
            Menu
          </p>

          <h2>
            Popular Dishes
          </h2>

        </div>


        {foods.length === 0 ? (

          <p>
            No food items available.
          </p>

        ) : (

          <div className="food-grid">

            {foods.map((food) => {

              const isFoodFavorite =
                foodFavorites.includes(
                  food._id
                );

              return (
                <div
                  className="food-card"
                  key={food._id}
                >

                  <div className="food-image">

                    {food.image ? (
                      <img
                        src={food.image}
                        alt={food.name}
                      />
                    ) : (
                      <span>
                        Food Image
                      </span>
                    )}


                    {/* FOOD FAVORITE */}

                    {isAuthenticated && (
                      <button
                        type="button"
                        className={`food-favorite-button ${
                          isFoodFavorite
                            ? "active"
                            : ""
                        }`}
                        onClick={(event) =>
                          handleFoodFavorite(
                            event,
                            food._id
                          )
                        }
                        title={
                          isFoodFavorite
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <FaHeart />
                      </button>
                    )}

                  </div>


                  <div className="food-info">

                    <div className="food-title-row">

                      <h3>
                        {food.name}
                      </h3>

                      <strong>
                        ₹{food.price}
                      </strong>

                    </div>


                    <p>
                      {food.description}
                    </p>


                    <span className="food-category">
                      {food.category}
                    </span>


                    <button
                      type="button"
                      className="add-to-cart-button"
                      onClick={() =>
                        addToCart(
                          food,
                          restaurant
                        )
                      }
                      disabled={
                        !food.isAvailable
                      }
                    >
                      {food.isAvailable
                        ? "Add to Cart"
                        : "Unavailable"}
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>


      {/* =========================
          CUSTOMER REVIEWS
      ========================= */}

      <section className="reviews-section">

        <div className="reviews-section-header">

          <div>

            <p>
              Customer Feedback
            </p>

            <h2>
              Reviews
            </h2>

          </div>


          <div className="reviews-rating-summary">

            <strong>
              ★ {restaurant.rating}
            </strong>

            <span>
              {reviews.length} review
              {reviews.length !== 1
                ? "s"
                : ""}
            </span>

          </div>

        </div>


        {reviewsLoading ? (

          <p>
            Loading reviews...
          </p>

        ) : reviews.length === 0 ? (

          <div className="no-reviews">

            <h3>
              No reviews yet
            </h3>

            <p>
              Be the first customer to review
              this restaurant.
            </p>

          </div>

        ) : (

          <div className="reviews-list">

            {reviews.map((review) => (

              <div
                className="review-item"
                key={review._id}
              >

                <div className="review-item-header">

                  <div>

                    <strong>
                      {review.customer?.name ||
                        "Customer"}
                    </strong>

                    <div className="review-stars">

                      {[1, 2, 3, 4, 5].map(
                        (star) => (

                          <span
                            key={star}
                            className={
                              star <=
                              review.rating
                                ? "selected"
                                : ""
                            }
                          >
                            ★
                          </span>

                        )
                      )}

                    </div>

                  </div>


                  <span className="review-date">

                    {review.createdAt
                      ? new Date(
                          review.createdAt
                        ).toLocaleDateString()
                      : ""}

                  </span>

                </div>


                {review.comment && (

                  <p className="review-comment">
                    {review.comment}
                  </p>

                )}

              </div>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default RestaurantDetails;