import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Restaurants() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [restaurants, setRestaurants] =
    useState([]);

  const [foods, setFoods] =
    useState([]);

  const [searchTerm, setSearchTerm] =
    useState(
      searchParams.get("search") || ""
    );

  const [cuisineFilter, setCuisineFilter] =
    useState("All");

  const [ratingFilter, setRatingFilter] =
    useState("All");

  const [deliveryFilter, setDeliveryFilter] =
    useState("All");

  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  /* =========================
     FETCH RESTAURANTS + FOODS
  ========================= */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          restaurantResponse,
          foodResponse,
        ] = await Promise.all([
          api.get("/restaurants"),
          api.get("/foods"),
        ]);

        setRestaurants(
          restaurantResponse.data.restaurants || []
        );

        setFoods(
          foodResponse.data.foods || []
        );
      } catch (error) {
        console.error(error);

        setError(
          "Failed to load restaurants"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  /* =========================
     FETCH FAVORITES
  ========================= */

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        return;
      }

      try {
        const response =
          await api.get("/favorites");

        const favoriteIds =
          (response.data.favorites || []).map(
            (restaurant) =>
              restaurant._id
          );

        setFavorites(favoriteIds);
      } catch (error) {
        console.error(
          "Failed to load favorites:",
          error
        );
      }
    };

    fetchFavorites();
  }, [isAuthenticated]);


  /* =========================
     FILTER RESTAURANTS
  ========================= */

  const filteredRestaurants =
    restaurants.filter((restaurant) => {

      const restaurantFoods =
        foods.filter(
          (food) =>
            food.restaurant ===
              restaurant._id ||
            food.restaurant?._id ===
              restaurant._id
        );


      /* SEARCH */

      const search =
        searchTerm
          .trim()
          .toLowerCase();

      const matchesSearch =
        !search ||
        restaurant.name
          ?.toLowerCase()
          .includes(search) ||
        restaurant.cuisine
          ?.toLowerCase()
          .includes(search) ||
        restaurant.address
          ?.toLowerCase()
          .includes(search) ||
        restaurantFoods.some(
          (food) =>
            food.name
              ?.toLowerCase()
              .includes(search) ||
            food.description
              ?.toLowerCase()
              .includes(search) ||
            food.category
              ?.toLowerCase()
              .includes(search)
        );


      /* CUISINE */

      const matchesCuisine =
        cuisineFilter === "All" ||
        restaurant.cuisine
          ?.toLowerCase() ===
          cuisineFilter.toLowerCase();


      /* RATING */

      const matchesRating =
        ratingFilter === "All" ||
        (ratingFilter === "4+" &&
          restaurant.rating >= 4) ||
        (ratingFilter === "4.5+" &&
          restaurant.rating >= 4.5);


      /* DELIVERY */

      const matchesDelivery =
        deliveryFilter === "All" ||
        (deliveryFilter ===
          "Under 30" &&
          restaurant.deliveryTime <= 30) ||
        (deliveryFilter ===
          "Under 20" &&
          restaurant.deliveryTime <= 20);


      return (
        matchesSearch &&
        matchesCuisine &&
        matchesRating &&
        matchesDelivery
      );
    });


  /* =========================
     RESET FILTERS
  ========================= */

  const resetFilters = () => {
    setSearchTerm("");
    setCuisineFilter("All");
    setRatingFilter("All");
    setDeliveryFilter("All");

    navigate("/restaurants");
  };


  /* =========================
     TOGGLE FAVORITE
  ========================= */

  const handleFavorite = async (
    event,
    restaurantId
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const alreadyFavorite =
      favorites.includes(
        restaurantId
      );

    try {
      if (alreadyFavorite) {
        await api.delete(
          `/favorites/${restaurantId}`
        );

        setFavorites(
          (currentFavorites) =>
            currentFavorites.filter(
              (id) =>
                id !== restaurantId
            )
        );
      } else {
        await api.post(
          `/favorites/${restaurantId}`
        );

        setFavorites(
          (currentFavorites) => [
            ...currentFavorites,
            restaurantId,
          ]
        );
      }
    } catch (error) {
      console.error(
        "Failed to update favorite:",
        error
      );
    }
  };


  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="restaurants-page">
        <h1>Loading restaurants...</h1>
      </main>
    );
  }


  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <main className="restaurants-page">
        <h1>{error}</h1>
      </main>
    );
  }


  return (
    <main className="restaurants-page">

      {/* =========================
          HEADER
      ========================= */}

      <section className="restaurants-header">

        <p>
          Discover
        </p>

        <h1>
          Restaurants
        </h1>

        <p>
          Find the perfect food for your
          next meal.
        </p>

      </section>


      {/* =========================
          SEARCH + FILTERS
      ========================= */}

      <section className="restaurant-filters">

        <div className="restaurant-search">

          <input
            type="text"
            placeholder="Search restaurants or food..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

        </div>


        <div className="filter-group">

          <select
            value={cuisineFilter}
            onChange={(event) =>
              setCuisineFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Cuisines
            </option>

            <option value="Indian">
              Indian
            </option>

            <option value="Chinese">
              Chinese
            </option>

            <option value="Italian">
              Italian
            </option>

            <option value="Fast Food">
              Fast Food
            </option>
          </select>


          <select
            value={ratingFilter}
            onChange={(event) =>
              setRatingFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              All Ratings
            </option>

            <option value="4+">
              4+ Stars
            </option>

            <option value="4.5+">
              4.5+ Stars
            </option>
          </select>


          <select
            value={deliveryFilter}
            onChange={(event) =>
              setDeliveryFilter(
                event.target.value
              )
            }
          >
            <option value="All">
              Any Delivery Time
            </option>

            <option value="Under 30">
              Under 30 min
            </option>

            <option value="Under 20">
              Under 20 min
            </option>
          </select>


          <button
            type="button"
            onClick={resetFilters}
          >
            Reset Filters
          </button>

        </div>

      </section>


      {/* =========================
          RESULT COUNT
      ========================= */}

      <div className="restaurants-result-count">

        <p>
          {filteredRestaurants.length}{" "}
          restaurant
          {filteredRestaurants.length !== 1
            ? "s"
            : ""}{" "}
          found
        </p>

      </div>


      {/* =========================
          RESTAURANT GRID
      ========================= */}

      {filteredRestaurants.length === 0 ? (

        <div className="no-restaurants">

          <h2>
            No restaurants found
          </h2>

          <p>
            Try changing your search or
            filters.
          </p>

        </div>

      ) : (

        <div className="restaurant-grid">

          {filteredRestaurants.map(
            (restaurant) => {

              const isFavorite =
                favorites.includes(
                  restaurant._id
                );

              return (
                <Link
                  to={`/restaurants/${restaurant._id}`}
                  className="restaurant-card"
                  key={restaurant._id}
                >

                  {/* =========================
                      IMAGE
                  ========================= */}

                  <div className="restaurant-image">

                    {restaurant.image ? (
                      <img
                        src={restaurant.image}
                        alt={
                          restaurant.name
                        }
                      />
                    ) : (
                      <span>
                        Restaurant Image
                      </span>
                    )}


                    <button
                      type="button"
                      className={`restaurant-favorite-button ${
                        isFavorite
                          ? "active"
                          : ""
                      }`}
                      onClick={(event) =>
                        handleFavorite(
                          event,
                          restaurant._id
                        )
                      }
                      title={
                        isFavorite
                          ? "Remove from favorites"
                          : "Add to favorites"
                      }
                    >
                      <FaHeart />
                    </button>

                  </div>


                  {/* =========================
                      INFO
                  ========================= */}

                  <div className="restaurant-info">

                    <h3>
                      {restaurant.name}
                    </h3>

                    <p>
                      {restaurant.cuisine ||
                        "Various Cuisine"}
                      {" • "}
                      {restaurant.deliveryTime} min
                    </p>

                    <span>
                      ★ {restaurant.rating}
                    </span>

                  </div>

                </Link>
              );
            }
          )}

        </div>

      )}

    </main>
  );
}

export default Restaurants;