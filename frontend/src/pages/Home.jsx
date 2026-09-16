import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaSearch,
  FaUtensils,
  FaTruck,
  FaStar,
  FaHeart,
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt,
  FaShoppingBag,
} from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import heroFood from "../assets/home/hero-food.png";
import indianFood from "../assets/home/indian.png";
import chineseFood from "../assets/home/chinese.png";
import italianFood from "../assets/home/italian.png";
import fastFood from "../assets/home/fast-food.png";

function Home() {
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState("");

  const [restaurants, setRestaurants] = useState([]);

  const [favorites, setFavorites] = useState([]);

  const [loadingRestaurants, setLoadingRestaurants] =
    useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get("/restaurants");

        setRestaurants(
          response.data.restaurants || []
        );
      } catch (error) {
        console.error(
          "Failed to load restaurants:",
          error
        );
      } finally {
        setLoadingRestaurants(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        return;
      }

      try {
        const response = await api.get("/favorites");

        const favoriteIds =
          (response.data.favorites || []).map(
            (restaurant) => restaurant._id
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

  const handleSearch = (event) => {
    event.preventDefault();

    const search = searchTerm.trim();

    if (!search) {
      navigate("/restaurants");
      return;
    }

    navigate(
      `/restaurants?search=${encodeURIComponent(
        search
      )}`
    );
  };

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
      favorites.includes(restaurantId);

    try {
      if (alreadyFavorite) {
        await api.delete(
          `/favorites/${restaurantId}`
        );

        setFavorites(
          (currentFavorites) =>
            currentFavorites.filter(
              (id) => id !== restaurantId
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

  const cuisines = [
    {
      name: "Indian",
      image: indianFood,
      description: "Rich & flavorful",
    },
    {
      name: "Chinese",
      image: chineseFood,
      description: "Wok-fresh favorites",
    },
    {
      name: "Italian",
      image: italianFood,
      description: "Classic comfort food",
    },
    {
      name: "Fast Food",
      image: fastFood,
      description: "Quick & delicious",
    },
  ];

  return (
    <main className="home-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <span>✦</span>

            <span>
              Your favorite food, delivered
            </span>
          </div>

          <p className="hero-small-text">
            Hungry? We've got you.
          </p>

          <h1>
            Good food.
            <br />
            <span>Good mood.</span>
          </h1>

          <p className="hero-description">
            Discover delicious meals from
            your favorite local restaurants
            and have them delivered straight
            to your door.
          </p>

          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <FaSearch />

            <input
              type="text"
              placeholder="Search for food or restaurants..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
            />

            <button type="submit">
              Search
            </button>
          </form>

          <div className="hero-quick-links">

            <span>
              Popular:
            </span>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/restaurants?search=Biryani"
                )
              }
            >
              Biryani
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/restaurants?search=Pizza"
                )
              }
            >
              Pizza
            </button>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/restaurants?search=Burger"
                )
              }
            >
              Burger
            </button>

          </div>

        </div>

        {/* =========================
            HERO IMAGE
        ========================= */}

        <div className="hero-visual">

          <div className="hero-glow"></div>

          <img
            src={heroFood}
            alt="Delicious food from BiteRush"
            className="hero-food-image"
          />

          <div className="hero-image-rating">
            <FaStar />

            <div>
              <strong>
                4.8
              </strong>

              <span>
                Top Rated
              </span>
            </div>
          </div>

          <div className="hero-image-delivery">

            <span className="hero-delivery-icon">
              🚴
            </span>

            <div>
              <strong>
                Fast Delivery
              </strong>

              <span>
                30 mins
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =========================
          FEATURES
      ========================= */}

      <section className="features-section">

        <div className="feature-card">

          <div className="feature-icon">
            <FaUtensils />
          </div>

          <div>
            <h3>
              Great Food
            </h3>

            <p>
              Discover delicious food from
              local restaurants.
            </p>
          </div>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            <FaTruck />
          </div>

          <div>
            <h3>
              Fast Delivery
            </h3>

            <p>
              Get your favorite meals
              delivered quickly.
            </p>
          </div>

        </div>

        <div className="feature-card">

          <div className="feature-icon">
            <FaStar />
          </div>

          <div>
            <h3>
              Top Rated
            </h3>

            <p>
              Enjoy highly rated restaurants
              and dishes.
            </p>
          </div>

        </div>

      </section>


      {/* =========================
          CUISINES
      ========================= */}

      <section className="cuisine-section">

        <div className="section-header">

          <div>

            <p className="section-small-title">
              What are you craving?
            </p>

            <h2>
              Explore by Cuisine
            </h2>

          </div>

          <Link to="/restaurants">
            Explore all
            <FaArrowRight />
          </Link>

        </div>

        <div className="cuisine-grid">

          {cuisines.map((cuisine) => (
            <button
              type="button"
              className="cuisine-card"
              key={cuisine.name}
              onClick={() =>
                navigate(
                  `/restaurants?cuisine=${encodeURIComponent(
                    cuisine.name
                  )}`
                )
              }
            >

              <div className="cuisine-image">
                <img
                  src={cuisine.image}
                  alt={cuisine.name}
                />
              </div>

              <div className="cuisine-info">

                <h3>
                  {cuisine.name}
                </h3>

                <p>
                  {cuisine.description}
                </p>

              </div>

              <span className="cuisine-arrow">
                <FaArrowRight />
              </span>

            </button>
          ))}

        </div>

      </section>


      {/* =========================
          POPULAR RESTAURANTS
      ========================= */}

      <section className="restaurants-section">

        <div className="section-header">

          <div>

            <p className="section-small-title">
              Discover
            </p>

            <h2>
              Popular Restaurants
            </h2>

          </div>

          <Link to="/restaurants">
            View all
            <FaArrowRight />
          </Link>

        </div>

        {loadingRestaurants ? (

          <div className="home-loading">

            <div className="home-loading-spinner"></div>

            <p>
              Finding great restaurants...
            </p>

          </div>

        ) : restaurants.length === 0 ? (

          <div className="home-empty-restaurants">

            <FaUtensils />

            <h3>
              No restaurants available yet
            </h3>

            <p>
              Check back soon for delicious
              options.
            </p>

          </div>

        ) : (

          <div className="restaurant-grid">

            {restaurants
              .slice(0, 3)
              .map((restaurant) => {

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

                    <div className="restaurant-image">

                      {restaurant.image ? (
                        <img
                          src={restaurant.image}
                          alt={
                            restaurant.name
                          }
                        />
                      ) : (
                        <div className="restaurant-image-placeholder">
                          <FaUtensils />
                        </div>
                      )}

                      <div className="restaurant-image-overlay"></div>

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

                      <div className="restaurant-rating-badge">

                        <FaStar />

                        <span>
                          {restaurant.rating
                            ? restaurant.rating.toFixed(
                                1
                              )
                            : "New"}
                        </span>

                      </div>

                    </div>

                    <div className="restaurant-info">

                      <h3>
                        {restaurant.name}
                      </h3>

                      <p className="restaurant-cuisine">
                        {restaurant.cuisine ||
                          "Various Cuisine"}
                      </p>

                      <div className="restaurant-meta">

                        <span>
                          <FaClock />

                          {restaurant.deliveryTime ||
                            30}{" "}
                          min
                        </span>

                        <span>
                          <FaMapMarkerAlt />

                          {restaurant.address ||
                            "Local delivery"}
                        </span>

                      </div>

                    </div>

                  </Link>
                );
              })}

          </div>

        )}

      </section>


      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className="how-it-works-section">

        <div className="how-it-works-header">

          <p className="section-small-title">
            Simple & easy
          </p>

          <h2>
            How BiteRush Works
          </h2>

          <p>
            Great food is only a few clicks away.
          </p>

        </div>

        <div className="steps-grid">

          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              <FaSearch />
            </div>

            <h3>
              Find your food
            </h3>

            <p>
              Search for your favorite dishes
              or discover restaurants nearby.
            </p>

          </div>

          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              <FaShoppingBag />
            </div>

            <h3>
              Place your order
            </h3>

            <p>
              Choose your favorites, add them
              to your cart and checkout easily.
            </p>

          </div>

          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              <FaTruck />
            </div>

            <h3>
              Enjoy your meal
            </h3>

            <p>
              Track your order in real time
              while it makes its way to you.
            </p>

          </div>

        </div>

      </section>


      {/* =========================
          FINAL CTA
      ========================= */}

      <section className="home-cta-section">

        <div>

          <p>
            Ready when you are
          </p>

          <h2>
            Your next favorite meal
            <br />
            is waiting.
          </h2>

          <span>
            Explore local restaurants and
            order something delicious today.
          </span>

        </div>

        <Link
          to="/restaurants"
          className="home-cta-button"
        >
          Explore Restaurants
          <FaArrowRight />
        </Link>

      </section>

    </main>
  );
}

export default Home;