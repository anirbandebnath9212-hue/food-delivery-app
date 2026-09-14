import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Register() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/register",
        formData
      );

      const { token, user } = response.data;

      login(user, token);

      navigate("/");
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">

      <div className="auth-card">

        <div className="auth-header">

          <p>
            Get started
          </p>

          <h1>
            Create your BiteRush account
          </h1>

          <span>
            Create an account and start ordering delicious food.
          </span>

        </div>


        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">

            <label htmlFor="name">
              Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="email">
              Email
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="password">
              Password
            </label>

            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="phone">
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />

          </div>


          <div className="form-group">

            <label htmlFor="address">
              Address
            </label>

            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter your delivery address"
            />

          </div>


          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}


          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading
              ? "Creating account..."
              : "Create Account"}
          </button>

        </form>


        <p className="auth-footer">
          Already have an account?{" "}

          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </main>
  );
}

export default Register;