import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaTrash,
  FaUtensils,
} from "react-icons/fa";

import api from "../services/api";

function Favorites() {
  const [restaurants, setRestaurants] =
    useState([]);

  const [foods, setFoods] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [removingRestaurantId, setRemovingRestaurantId] =
    useState(null);

  const [removingFoodId, setRemovingFoodId] =
    useState(null);


  /* =========================
     FETCH FAVORITES
  ========================= */

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const [
          restaurantResponse,
          foodResponse,
        ] = await Promise.all([
          api.get("/favorites"),
          api.get("/food-favorites"),
        ]);

        setRestaurants(
          restaurantResponse.data.favorites || []
        );

        setFoods(
          foodResponse.data.favoriteFoods || []
        );
      } catch (error) {
        console.error(
          "Failed to load favorites:",
          error
        );

        setError(
          "Failed to load favorites"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);


  /* =========================
     REMOVE RESTAURANT
  ========================= */

  const handleRemoveRestaurant = async (
    restaurantId
  ) => {
    try {
      setRemovingRestaurantId(
        restaurantId
      );

      await api.delete(
        `/favorites/${restaurantId}`
      );

      setRestaurants(
        (currentRestaurants) =>
          currentRestaurants.filter(
            (restaurant) =>
              restaurant._id !==
              restaurantId
          )
      );
    } catch (error) {
      console.error(
        "Failed to remove restaurant favorite:",
        error
      );
    } finally {
      setRemovingRestaurantId(null);
    }
  };


  /* =========================
     REMOVE FOOD
  ========================= */

  const handleRemoveFood = async (
    foodId
  ) => {
    try {
      setRemovingFoodId(foodId);

      await api.delete(
        `/food-favorites/${foodId}`
      );

      setFoods(
        (currentFoods) =>
          currentFoods.filter(
            (food) =>
              food._id !== foodId
          )
      );
    } catch (error) {
      console.error(
        "Failed to remove food favorite:",
        error
      );
    } finally {
      setRemovingFoodId(null);
    }
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="favorites-page">

        <div className="favorites-header">

          <div>
            <p>
              Your Collection
            </p>

            <h1>
              Favorites
            </h1>
          </div>

        </div>

        <p>
          Loading favorites...
        </p>

      </main>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <main className="favorites-page">

        <div className="favorites-header">

          <div>
            <p>
              Your Collection
            </p>

            <h1>
              Favorites
            </h1>
          </div>

        </div>

        <p>
          {error}
        </p>

      </main>
    );
  }


  const totalFavorites =
    restaurants.length +
    foods.length;


  return (
    <main className="favorites-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="favorites-header">

        <div>

          <p>
            Your Collection
          </p>

          <h1>
            Favorites
          </h1>

        </div>


        <div className="favorites-count">

          <FaHeart />

          <span>
            {totalFavorites} saved
          </span>

        </div>

      </div>


      {/* =========================
          EMPTY STATE
      ========================= */}

      {totalFavorites === 0 ? (

        <div className="empty-favorites">

          <div className="empty-favorites-icon">
            <FaHeart />
          </div>

          <h2>
            No favorites yet
          </h2>

          <p>
            Save your favorite restaurants
            and dishes and find them here
            anytime.
          </p>

          <Link
            to="/restaurants"
            className="browse-favorites-button"
          >
            Explore Restaurants
          </Link>

        </div>

      ) : (

        <>

          {/* =========================
              FAVORITE RESTAURANTS
          ========================= */}

          {restaurants.length > 0 && (

            <section className="favorites-section">

              <div className="favorites-section-header">

                <div>

                  <p>
                    Places you love
                  </p>

                  <h2>
                    Favorite Restaurants
                  </h2>

                </div>

                <span>
                  {restaurants.length}
                </span>

              </div>


              <div className="favorites-grid">

                {restaurants.map(
                  (restaurant) => (

                    <div
                      className="favorite-card"
                      key={restaurant._id}
                    >

                      <Link
                        to={`/restaurants/${restaurant._id}`}
                        className="favorite-card-link"
                      >

                        <div className="favorite-card-image">

                          {restaurant.image ? (
                            <img
                              src={
                                restaurant.image
                              }
                              alt={
                                restaurant.name
                              }
                            />
                          ) : (
                            <span>
                              Restaurant Image
                            </span>
                          )}

                        </div>


                        <div className="favorite-card-info">

                          <div className="favorite-card-title">

                            <h3>
                              {restaurant.name}
                            </h3>

                            <span>
                              ★{" "}
                              {restaurant.rating}
                            </span>

                          </div>


                          <p>
                            {restaurant.cuisine ||
                              "Various Cuisine"}
                          </p>


                          <div className="favorite-card-meta">

                            <span>
                              {
                                restaurant.deliveryTime
                              }{" "}
                              min
                            </span>

                            <span>
                              {
                                restaurant.address
                              }
                            </span>

                          </div>

                        </div>

                      </Link>


                      <button
                        type="button"
                        className="remove-favorite-button"
                        onClick={() =>
                          handleRemoveRestaurant(
                            restaurant._id
                          )
                        }
                        disabled={
                          removingRestaurantId ===
                          restaurant._id
                        }
                        title="Remove from favorites"
                      >
                        <FaTrash />
                      </button>

                    </div>

                  )
                )}

              </div>

            </section>

          )}


          {/* =========================
              FAVORITE FOODS
          ========================= */}

          {foods.length > 0 && (

            <section className="favorites-section">

              <div className="favorites-section-header">

                <div>

                  <p>
                    Dishes you love
                  </p>

                  <h2>
                    Favorite Foods
                  </h2>

                </div>

                <span>
                  {foods.length}
                </span>

              </div>


              <div className="favorite-food-grid">

                {foods.map((food) => (

                  <div
                    className="favorite-food-card"
                    key={food._id}
                  >

                    <Link
                      to={
                        food.restaurant?._id
                          ? `/restaurants/${food.restaurant._id}`
                          : "/restaurants"
                      }
                      className="favorite-food-link"
                    >

                      <div className="favorite-food-image">

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

                      </div>


                      <div className="favorite-food-info">

                        <div className="favorite-food-title">

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


                        <span className="favorite-food-category">

                          <FaUtensils />

                          {food.category ||
                            "Food"}

                        </span>


                        {food.restaurant && (

                          <span className="favorite-food-restaurant">

                            {food.restaurant.name}

                          </span>

                        )}

                      </div>

                    </Link>


                    <button
                      type="button"
                      className="remove-favorite-button"
                      onClick={() =>
                        handleRemoveFood(
                          food._id
                        )
                      }
                      disabled={
                        removingFoodId ===
                        food._id
                      }
                      title="Remove from favorites"
                    >
                      <FaTrash />
                    </button>

                  </div>

                ))}

              </div>

            </section>

          )}

        </>

      )}

    </main>
  );
}

export default Favorites;