import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get("/restaurants");

        setRestaurants(response.data.restaurants);
      } catch (error) {
        console.error(error);

        setError("Failed to load restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) {
    return (
      <main className="restaurants-page">
        <h1>Loading restaurants...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="restaurants-page">
        <h1>{error}</h1>
      </main>
    );
  }

  return (
    <main className="restaurants-page">

      <section className="restaurants-header">
        <p>Explore</p>

        <h1>Restaurants</h1>

        <span>
          Discover delicious food from local restaurants.
        </span>
      </section>


      <section className="restaurants-list">

        {restaurants.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          restaurants.map((restaurant) => (
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
                  <span>Restaurant Image</span>
                )}
              </div>

              <div className="restaurant-info">

                <h3>
                  {restaurant.name}
                </h3>

                <p>
                  {restaurant.cuisine || "Various Cuisine"}
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
          ))
        )}

      </section>

    </main>
  );
}

export default Restaurants;