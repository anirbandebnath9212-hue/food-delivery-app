import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUtensils,
  FaTruck,
  FaStar,
} from "react-icons/fa";

function Home() {
  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">

          <p className="hero-small-text">
            Hungry? We've got you.
          </p>

          <h1>
            Delicious food,
            <br />
            delivered fast.
          </h1>

          <p className="hero-description">
            Discover delicious meals from your favorite
            restaurants and get them delivered to your door.
          </p>

          <div className="search-box">
            <FaSearch />

            <input
              type="text"
              placeholder="Search for food or restaurants..."
            />

            <button>
              Search
            </button>
          </div>

        </div>
      </section>


      {/* Features */}
      <section className="features-section">

        <div className="feature-card">
          <FaUtensils />

          <h3>
            Great Food
          </h3>

          <p>
            Discover delicious food from local restaurants.
          </p>
        </div>


        <div className="feature-card">
          <FaTruck />

          <h3>
            Fast Delivery
          </h3>

          <p>
            Get your favorite meals delivered quickly.
          </p>
        </div>


        <div className="feature-card">
          <FaStar />

          <h3>
            Top Rated
          </h3>

          <p>
            Enjoy highly rated restaurants and dishes.
          </p>
        </div>

      </section>


      {/* Popular Restaurants */}
      <section className="restaurants-section">

        <div className="section-header">

          <div>
            <p className="section-small-title">
              Explore
            </p>

            <h2>
              Popular Restaurants
            </h2>
          </div>

          <Link to="/restaurants">
            View all
          </Link>

        </div>


        <div className="restaurant-grid">

          <div className="restaurant-card">

            <div className="restaurant-image">
              Food Image
            </div>

            <div className="restaurant-info">

              <h3>
                BiteRush Kitchen
              </h3>

              <p>
                Indian • 30 min
              </p>

              <span>
                ★ 4.5
              </span>

            </div>

          </div>


          <div className="restaurant-card">

            <div className="restaurant-image">
              Food Image
            </div>

            <div className="restaurant-info">

              <h3>
                Spice Garden
              </h3>

              <p>
                Indian • 25 min
              </p>

              <span>
                ★ 4.6
              </span>

            </div>

          </div>


          <div className="restaurant-card">

            <div className="restaurant-image">
              Food Image
            </div>

            <div className="restaurant-info">

              <h3>
                Urban Bites
              </h3>

              <p>
                Fast Food • 20 min
              </p>

              <span>
                ★ 4.4
              </span>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Home;