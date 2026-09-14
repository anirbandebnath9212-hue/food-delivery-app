import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function RestaurantDetails() {
  const { id } = useParams();

  const { addToCart } = useCart();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const restaurantResponse = await api.get(
          `/restaurants/${id}`
        );

        const foodsResponse = await api.get(
          `/foods/restaurant/${id}`
        );

        setRestaurant(
          restaurantResponse.data.restaurant
        );

        setFoods(foodsResponse.data.foods);
      } catch (error) {
        console.error(error);

        setError("Failed to load restaurant");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [id]);

  if (loading) {
    return (
      <main className="restaurant-details-page">
        <h1>Loading...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="restaurant-details-page">
        <h1>{error}</h1>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="restaurant-details-page">
        <h1>Restaurant not found</h1>
      </main>
    );
  }

  return (
    <main className="restaurant-details-page">

      <section className="restaurant-details-header">

        <div className="restaurant-details-image">
          {restaurant.image ? (
            <img
              src={restaurant.image}
              alt={restaurant.name}
            />
          ) : (
            <span>Restaurant Image</span>
          )}
        </div>

        <div className="restaurant-details-info">

          <p>
            {restaurant.cuisine || "Various Cuisine"}
          </p>

          <h1>
            {restaurant.name}
          </h1>

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
          <p>No food items available.</p>
        ) : (
          <div className="food-grid">

            {foods.map((food) => (
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
                    <span>Food Image</span>
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
                    className="add-to-cart-button"
                    onClick={() =>
                      addToCart(food, restaurant)
                    }
                    disabled={!food.isAvailable}
                  >
                    {food.isAvailable
                      ? "Add to Cart"
                      : "Unavailable"}
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </section>

    </main>
  );
}

export default RestaurantDetails;