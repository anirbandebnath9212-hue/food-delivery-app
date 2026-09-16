import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import api from "../services/api";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const urlSearch =
    searchParams.get("search") || "";

  const [searchTerm, setSearchTerm] =
    useState(urlSearch);

  const [cuisineFilter, setCuisineFilter] =
    useState("all");

  const [ratingFilter, setRatingFilter] =
    useState("all");

  const [deliveryFilter, setDeliveryFilter] =
    useState("all");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =========================
     FETCH RESTAURANTS
  ========================= */

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response =
          await api.get("/restaurants");

        setRestaurants(
          response.data.restaurants
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

    fetchRestaurants();
  }, []);

  /* =========================
     SYNC URL SEARCH
  ========================= */

  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  /* =========================
     FILTER RESTAURANTS
  ========================= */

  const filteredRestaurants =
    restaurants.filter((restaurant) => {
      const search =
        searchTerm.toLowerCase();

      const restaurantName =
        restaurant.name?.toLowerCase() || "";

      const cuisine =
        restaurant.cuisine?.toLowerCase() || "";

      const address =
        restaurant.address?.toLowerCase() || "";

      const rating =
        Number(restaurant.rating) || 0;

      const deliveryTime =
        Number(restaurant.deliveryTime) || 0;

      /* Search */

      const matchesSearch =
        restaurantName.includes(search) ||
        cuisine.includes(search) ||
        address.includes(search);

      /* Cuisine */

      const matchesCuisine =
        cuisineFilter === "all" ||
        cuisine.includes(
          cuisineFilter.toLowerCase()
        );

      /* Rating */

      const matchesRating =
        ratingFilter === "all" ||
        rating >= Number(ratingFilter);

      /* Delivery Time */

      let matchesDelivery = true;

      if (deliveryFilter === "20") {
        matchesDelivery =
          deliveryTime <= 20;
      }

      if (deliveryFilter === "30") {
        matchesDelivery =
          deliveryTime <= 30;
      }

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesRating &&
        matchesDelivery
      );
    });

  /* =========================
     HANDLE SEARCH
  ========================= */

  const handleSearch = (event) => {
    const value = event.target.value;

    setSearchTerm(value);

    const search = value.trim();

    if (search) {
      setSearchParams({
        search,
      });
    } else {
      setSearchParams({});
    }
  };

  /* =========================
     RESET FILTERS
  ========================= */

  const resetFilters = () => {
    setCuisineFilter("all");
    setRatingFilter("all");
    setDeliveryFilter("all");
  };

  /* =========================
     LOADING
  ========================= */

  if (loading) {
    return (
      <main className="restaurants-page">
        <h1>
          Loading restaurants...
        </h1>
      </main>
    );
  }

  /* =========================
     ERROR
  ========================= */

  if (error) {
    return (
      <main className="restaurants-page">
        <h1>
          {error}
        </h1>
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
          Explore
        </p>

        <h1>
          Restaurants
        </h1>

        <span>
          Discover delicious food from local
          restaurants.
        </span>

        {/* =========================
            SEARCH
        ========================= */}

        <div className="restaurant-search">

          <input
            type="text"
            placeholder="Search restaurants, cuisine or location..."
            value={searchTerm}
            onChange={handleSearch}
          />

        </div>

        {/* =========================
            CUISINE FILTER
        ========================= */}

        <div className="restaurant-filters">

          <button
            type="button"
            className={
              cuisineFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setCuisineFilter("all")
            }
          >
            All
          </button>

          <button
            type="button"
            className={
              cuisineFilter === "indian"
                ? "active"
                : ""
            }
            onClick={() =>
              setCuisineFilter("indian")
            }
          >
            Indian
          </button>

          <button
            type="button"
            className={
              cuisineFilter === "chinese"
                ? "active"
                : ""
            }
            onClick={() =>
              setCuisineFilter("chinese")
            }
          >
            Chinese
          </button>

          <button
            type="button"
            className={
              cuisineFilter === "italian"
                ? "active"
                : ""
            }
            onClick={() =>
              setCuisineFilter("italian")
            }
          >
            Italian
          </button>

          <button
            type="button"
            className={
              cuisineFilter === "fast food"
                ? "active"
                : ""
            }
            onClick={() =>
              setCuisineFilter("fast food")
            }
          >
            Fast Food
          </button>

        </div>

        {/* =========================
            RATING FILTER
        ========================= */}

        <div className="restaurant-filters">

          <button
            type="button"
            className={
              ratingFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setRatingFilter("all")
            }
          >
            All Ratings
          </button>

          <button
            type="button"
            className={
              ratingFilter === "4"
                ? "active"
                : ""
            }
            onClick={() =>
              setRatingFilter("4")
            }
          >
            ★ 4+
          </button>

          <button
            type="button"
            className={
              ratingFilter === "4.5"
                ? "active"
                : ""
            }
            onClick={() =>
              setRatingFilter("4.5")
            }
          >
            ★ 4.5+
          </button>

        </div>

        {/* =========================
            DELIVERY FILTER
        ========================= */}

        <div className="restaurant-filters">

          <button
            type="button"
            className={
              deliveryFilter === "all"
                ? "active"
                : ""
            }
            onClick={() =>
              setDeliveryFilter("all")
            }
          >
            All Delivery Times
          </button>

          <button
            type="button"
            className={
              deliveryFilter === "30"
                ? "active"
                : ""
            }
            onClick={() =>
              setDeliveryFilter("30")
            }
          >
            Under 30 min
          </button>

          <button
            type="button"
            className={
              deliveryFilter === "20"
                ? "active"
                : ""
            }
            onClick={() =>
              setDeliveryFilter("20")
            }
          >
            Under 20 min
          </button>

          <button
            type="button"
            onClick={resetFilters}
          >
            Reset Filters
          </button>

        </div>

      </section>

      {/* =========================
          RESTAURANT COUNT
      ========================= */}

      <section className="restaurant-results-info">

        <p>
          Showing{" "}
          <strong>
            {filteredRestaurants.length}
          </strong>{" "}
          restaurant
          {filteredRestaurants.length !== 1
            ? "s"
            : ""}
        </p>

      </section>

      {/* =========================
          RESTAURANT LIST
      ========================= */}

      <section className="restaurants-list">

        {filteredRestaurants.length === 0 ? (
          <p>
            No restaurants found.
          </p>
        ) : (
          filteredRestaurants.map(
            (restaurant) => (
              <Link
                to={`/restaurants/${restaurant._id}`}
                className="restaurant-card"
                key={restaurant._id}
              >

                <div className="restaurant-image">

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

                  <p>
                    {restaurant.address}
                  </p>

                  <span>
                    ★ {restaurant.rating}
                  </span>

                </div>

              </Link>
            )
          )
        )}

      </section>

    </main>
  );
}

export default Restaurants;