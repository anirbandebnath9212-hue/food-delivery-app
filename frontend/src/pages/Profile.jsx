import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus, FaCheck } from "react-icons/fa";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [addresses, setAddresses] = useState([]);

  const [loadingAddresses, setLoadingAddresses] =
    useState(true);

  const [showAddressForm, setShowAddressForm] =
    useState(false);

  const [editingAddressId, setEditingAddressId] =
    useState(null);

  const [addressForm, setAddressForm] = useState({
    label: "",
    address: "",
  });

  const [savingAddress, setSavingAddress] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  /* =========================
     LOAD SAVED ADDRESSES
  ========================= */

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);

        const response = await api.get(
          "/addresses"
        );

        setAddresses(
          response.data.addresses || []
        );
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.message ||
            "Failed to load saved addresses"
        );
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, []);


  /* =========================
     ADDRESS INPUT
  ========================= */

  const handleAddressChange = (event) => {
    setAddressForm({
      ...addressForm,
      [event.target.name]: event.target.value,
    });
  };


  /* =========================
     OPEN ADD FORM
  ========================= */

  const handleAddAddress = () => {
    setEditingAddressId(null);

    setAddressForm({
      label: "",
      address: "",
    });

    setShowAddressForm(true);

    setMessage("");
    setError("");
  };


  /* =========================
     OPEN EDIT FORM
  ========================= */

  const handleEditAddress = (savedAddress) => {
    setEditingAddressId(savedAddress._id);

    setAddressForm({
      label: savedAddress.label,
      address: savedAddress.address,
    });

    setShowAddressForm(true);

    setMessage("");
    setError("");
  };


  /* =========================
     CANCEL ADDRESS FORM
  ========================= */

  const handleCancelAddressForm = () => {
    setShowAddressForm(false);

    setEditingAddressId(null);

    setAddressForm({
      label: "",
      address: "",
    });
  };


  /* =========================
     SAVE ADDRESS
  ========================= */

  const handleSaveAddress = async (event) => {
    event.preventDefault();

    if (
      !addressForm.label.trim() ||
      !addressForm.address.trim()
    ) {
      setError(
        "Please enter both a label and address"
      );

      return;
    }

    try {
      setSavingAddress(true);

      setMessage("");
      setError("");

      let response;

      if (editingAddressId) {
        response = await api.put(
          `/addresses/${editingAddressId}`,
          {
            label: addressForm.label,
            address: addressForm.address,
          }
        );
      } else {
        response = await api.post(
          "/addresses",
          {
            label: addressForm.label,
            address: addressForm.address,
          }
        );
      }

      setAddresses(
        response.data.addresses || []
      );

      setShowAddressForm(false);

      setEditingAddressId(null);

      setAddressForm({
        label: "",
        address: "",
      });

      setMessage(
        editingAddressId
          ? "Address updated successfully"
          : "Address added successfully"
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to save address"
      );
    } finally {
      setSavingAddress(false);
    }
  };


  /* =========================
     DELETE ADDRESS
  ========================= */

  const handleDeleteAddress = async (
    addressId
  ) => {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!shouldDelete) {
      return;
    }

    try {
      setMessage("");
      setError("");

      const response = await api.delete(
        `/addresses/${addressId}`
      );

      setAddresses(
        response.data.addresses || []
      );

      setMessage(
        "Address deleted successfully"
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to delete address"
      );
    }
  };


  /* =========================
     SET DEFAULT ADDRESS
  ========================= */

  const handleSetDefault = async (
    addressId
  ) => {
    try {
      setMessage("");
      setError("");

      const response = await api.put(
        `/addresses/${addressId}/default`
      );

      setAddresses(
        response.data.addresses || []
      );

      setMessage(
        "Default address updated"
      );
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to update default address"
      );
    }
  };


  return (
    <div className="profile-page">

      {/* =========================
          PROFILE HEADER
      ========================= */}

      <div className="profile-header">
        <h1>My Profile</h1>

        <p>
          Manage your account and delivery
          information.
        </p>
      </div>


      {/* =========================
          PROFILE INFORMATION
      ========================= */}

      <div className="profile-card">

        <h2>Profile Information</h2>

        <div className="profile-info-grid">

          <div className="profile-info-item">
            <span>Name</span>
            <strong>
              {profile.name || "Not available"}
            </strong>
          </div>

          <div className="profile-info-item">
            <span>Email</span>
            <strong>
              {profile.email || "Not available"}
            </strong>
          </div>

          <div className="profile-info-item">
            <span>Phone</span>
            <strong>
              {profile.phone || "Not added"}
            </strong>
          </div>

          <div className="profile-info-item">
            <span>Address</span>
            <strong>
              {profile.address || "Not added"}
            </strong>
          </div>

        </div>

      </div>


      {/* =========================
          SAVED ADDRESSES
      ========================= */}

      <div className="profile-card saved-addresses-card">

        <div className="saved-addresses-header">

          <div>
            <h2>Saved Addresses</h2>

            <p>
              Save your frequently used delivery
              addresses for faster checkout.
            </p>
          </div>

          {!showAddressForm && (
            <button
              className="add-address-button"
              onClick={handleAddAddress}
            >
              <FaPlus />
              Add Address
            </button>
          )}

        </div>


        {/* =========================
            MESSAGE
        ========================= */}

        {message && (
          <div className="profile-success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="profile-error-message">
            {error}
          </div>
        )}


        {/* =========================
            ADDRESS FORM
        ========================= */}

        {showAddressForm && (
          <form
            className="address-form"
            onSubmit={handleSaveAddress}
          >

            <h3>
              {editingAddressId
                ? "Edit Address"
                : "Add New Address"}
            </h3>


            <div className="address-form-group">

              <label htmlFor="label">
                Address Label
              </label>

              <input
                id="label"
                name="label"
                type="text"
                placeholder="Home, Work, etc."
                value={addressForm.label}
                onChange={handleAddressChange}
              />

            </div>


            <div className="address-form-group">

              <label htmlFor="address">
                Full Address
              </label>

              <textarea
                id="address"
                name="address"
                rows="4"
                placeholder="Enter your complete delivery address"
                value={addressForm.address}
                onChange={handleAddressChange}
              />

            </div>


            <div className="address-form-actions">

              <button
                type="button"
                className="cancel-address-button"
                onClick={handleCancelAddressForm}
                disabled={savingAddress}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-address-button"
                disabled={savingAddress}
              >
                {savingAddress
                  ? "Saving..."
                  : editingAddressId
                  ? "Update Address"
                  : "Save Address"}
              </button>

            </div>

          </form>
        )}


        {/* =========================
            ADDRESS LIST
        ========================= */}

        {loadingAddresses ? (
          <div className="addresses-loading">
            Loading saved addresses...
          </div>
        ) : addresses.length === 0 ? (
          <div className="empty-addresses">

            <h3>
              No saved addresses
            </h3>

            <p>
              Add an address to make checkout
              faster and easier.
            </p>

            {!showAddressForm && (
              <button
                className="add-address-button"
                onClick={handleAddAddress}
              >
                <FaPlus />
                Add Your First Address
              </button>
            )}

          </div>
        ) : (
          <div className="saved-address-list">

            {addresses.map((savedAddress) => (
              <div
                key={savedAddress._id}
                className={`saved-address-item ${
                  savedAddress.isDefault
                    ? "default-address"
                    : ""
                }`}
              >

                <div className="saved-address-content">

                  <div className="saved-address-title">

                    <h3>
                      {savedAddress.label}
                    </h3>

                    {savedAddress.isDefault && (
                      <span className="default-address-badge">
                        <FaCheck />
                        Default
                      </span>
                    )}

                  </div>

                  <p>
                    {savedAddress.address}
                  </p>

                </div>


                <div className="saved-address-actions">

                  {!savedAddress.isDefault && (
                    <button
                      className="set-default-button"
                      onClick={() =>
                        handleSetDefault(
                          savedAddress._id
                        )
                      }
                    >
                      <FaCheck />
                      Set Default
                    </button>
                  )}

                  <button
                    className="edit-address-button"
                    onClick={() =>
                      handleEditAddress(
                        savedAddress
                      )
                    }
                  >
                    <FaEdit />
                    Edit
                  </button>

                  <button
                    className="delete-address-button"
                    onClick={() =>
                      handleDeleteAddress(
                        savedAddress._id
                      )
                    }
                  >
                    <FaTrash />
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default Profile;