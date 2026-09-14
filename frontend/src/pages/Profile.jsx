import { Link } from "react-router-dom";
import { FaUser, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-login-message">
          <h1>Please login</h1>

          <p>
            You need to be logged in to view your profile.
          </p>

          <Link to="/login">
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="profile-page">

      <div className="profile-header">
        <p>Account</p>

        <h1>My Profile</h1>
      </div>


      <section className="profile-card">

        <div className="profile-avatar">
          <FaUser />
        </div>


        <div className="profile-details">

          <div className="profile-detail">
            <span>Name</span>

            <strong>
              {user.name}
            </strong>
          </div>


          <div className="profile-detail">
            <span>Email</span>

            <strong>
              {user.email}
            </strong>
          </div>


          <div className="profile-detail">
            <span>
              <FaPhone />
              Phone
            </span>

            <strong>
              {user.phone || "Not provided"}
            </strong>
          </div>


          <div className="profile-detail">
            <span>
              <FaMapMarkerAlt />
              Address
            </span>

            <strong>
              {user.address || "Not provided"}
            </strong>
          </div>


          <div className="profile-detail">
            <span>Account Type</span>

            <strong>
              {user.role}
            </strong>
          </div>

        </div>

      </section>


      <section className="profile-actions">

        <Link to="/orders">
          View My Orders
        </Link>

        <Link to="/restaurants">
          Browse Restaurants
        </Link>

      </section>

    </main>
  );
}

export default Profile;