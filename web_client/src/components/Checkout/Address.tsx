import React, { useEffect, useState } from "react";
import countryList from "../../data/countries.json";
import { getLoggedInUserData } from "@/utils/helper";
import { ADDRESS_TYPES } from "@/utils/constants";
import { Button, Modal, message } from "antd";

const initialAddressValues = {
  name: "",
  mobile: "",
  address: "",
  city: "",
  pincode: "",
  country: "",
  state: "",
};

const addressFieldLabels = {
  name: "Name",
  mobile: "Mobile",
  address: "Address",
  city: "City",
  pincode: "Pincode",
  country: "Country",
  state: "State",
};

const Address = ({
  type = ADDRESS_TYPES.SHIP,
  isDiffBillAddress = false,
  setIsDiffBillAddress = null,
  checkoutValues,
  setCheckoutValues,
  savedAddresses = [],
  onAddAddress = null,
  onUpdateAddress = null,
  onDeleteAddress = null,
  onRefreshAddresses = null,
}) => {
  const [userData, setUserData] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [selectedSavedAddressId, setSelectedSavedAddressId] = useState(null);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [modalValues, setModalValues] = useState(initialAddressValues);

  const isShip = type === ADDRESS_TYPES.SHIP;
  const isEditMode = Boolean(editingAddressId);
  const modalStateList = modalValues.country
    ? countryList.find((i) => i.name === modalValues.country)?.states || []
    : [];

  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    const fetchUser = async () => {
      const userDataDetails = await getLoggedInUserData();
      if (userDataDetails) {
        setUserData(userDataDetails);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userData) return;
    setCheckoutValues((prev) => {
      const next = { ...prev };
      if (isShip) {
        if (!next.name) next.name = userData?.name || "";
        if (!next.mobile) next.mobile = userData?.mobile || "";
      } else {
        if (!next.billingName) next.billingName = userData?.name || "";
        if (!next.billingMobile) next.billingMobile = userData?.mobile || "";
      }
      return next;
    });
  }, [userData, isShip, setCheckoutValues]);

  const applySavedAddress = (selectedAddressId) => {
    const selectedAddress = savedAddresses.find((item) => item.id === selectedAddressId);
    if (!selectedAddress) return;

    setCheckoutValues((prev) => ({
      ...prev,
      [isShip ? "name" : "billingName"]: selectedAddress.name || "",
      [isShip ? "mobile" : "billingMobile"]: selectedAddress.mobile || "",
      [isShip ? "address" : "billingAddress"]: selectedAddress.address || "",
      [isShip ? "city" : "billingCity"]: selectedAddress.city || "",
      [isShip ? "pincode" : "billingPincode"]: selectedAddress.pincode || "",
      [isShip ? "country" : "billingCountry"]: selectedAddress.country || "",
      [isShip ? "state" : "billingState"]: selectedAddress.state || "",
    }));
    setFieldErrors({});
  };

  useEffect(() => {
    if (!savedAddresses.length) {
      setSelectedSavedAddressId(null);
      return;
    }

    const preferredId = selectedSavedAddressId && savedAddresses.some((i) => i.id === selectedSavedAddressId)
      ? selectedSavedAddressId
      : savedAddresses[0].id;

    setSelectedSavedAddressId(preferredId);
    applySavedAddress(preferredId);
  }, [isShip, savedAddresses]);

  useEffect(() => {
    if (savedAddresses.length) return;
    setModalValues((prev) => ({
      ...prev,
      name: prev.name || checkoutValues?.[isShip ? "name" : "billingName"] || userData?.name || "",
      mobile: prev.mobile || checkoutValues?.[isShip ? "mobile" : "billingMobile"] || userData?.mobile || "",
    }));
  }, [savedAddresses.length, isShip, checkoutValues, userData]);

  const getShippingHeading = () => {
    if (!isDiffBillAddress) return "Shipping & Billing";
    return "Shipping";
  };

  const openAddModal = () => {
    setEditingAddressId(null);
    setModalValues({
      name: checkoutValues?.[isShip ? "name" : "billingName"] || userData?.name || "",
      mobile: checkoutValues?.[isShip ? "mobile" : "billingMobile"] || userData?.mobile || "",
      address: "",
      city: "",
      pincode: "",
      country: "",
      state: "",
    });
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingAddressId(item.id);
    setModalValues({
      name: item.name || "",
      mobile: item.mobile || "",
      address: item.address || "",
      city: item.city || "",
      pincode: item.pincode || "",
      country: item.country || "",
      state: item.state || "",
    });
    setFieldErrors({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddressId(null);
    setModalValues(initialAddressValues);
    setFieldErrors({});
  };

  const handleModalInputChange = (field) => (e) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
    setModalValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleModalCountryChange = (e) => {
    const country = e.target.value;
    setFieldErrors((prev) => ({ ...prev, country: "", state: "" }));
    setModalValues((prev) => ({ ...prev, country, state: "" }));
  };

  const validateAddressValues = (values) => {
    const nextErrors = {};
    Object.keys(addressFieldLabels).forEach((field) => {
      if (!values?.[field]?.toString().trim()) {
        nextErrors[field] = `Please enter ${addressFieldLabels[field]}.`;
      }
    });
    return nextErrors;
  };

  const renderFieldError = (field) => (
    fieldErrors[field] ? <p className="mt-1 text-xs text-red">{fieldErrors[field]}</p> : null
  );

  const handleSaveAddress = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    const nextErrors = validateAddressValues(modalValues);
    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      return;
    }

    try {
      setSavingAddress(true);
      const response = isEditMode
        ? await onUpdateAddress?.(editingAddressId, modalValues)
        : await onAddAddress?.(modalValues);

      if (!response?.success) {
        message.error(response?.message || "Failed to save address.");
        return;
      }

      await onRefreshAddresses?.();

      const savedId = response?.data?.id || editingAddressId;
      if (savedId) {
        setSelectedSavedAddressId(savedId);
        applySavedAddress(savedId);
      }

      closeModal();
      message.success(isEditMode ? "Address updated." : "Address saved.");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!onDeleteAddress) return;
    try {
      setDeletingAddressId(addressId);
      const response = await onDeleteAddress(addressId);
      if (!response?.success) {
        message.error(response?.message || "Failed to delete address.");
        return;
      }
      await onRefreshAddresses?.();
      if (selectedSavedAddressId === addressId) {
        setSelectedSavedAddressId(null);
      }
      message.success("Address deleted.");
    } finally {
      setDeletingAddressId(null);
    }
  };

  return (
    <div id="addressForm" className="mt-3">
      <div className="form-card p-4 sm:p-8.5">
        <h2 className="font-medium text-xl text-dark mb-3">
          {isShip ? getShippingHeading() : "Billing"} Address
        </h2>

        {!!savedAddresses.length && (
          <div className="mb-5">
            <div className="grid grid-cols-1 gap-3">
              {savedAddresses.map((item) => {
                const isSelected = selectedSavedAddressId === item.id;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      setSelectedSavedAddressId(item.id);
                      applySavedAddress(item.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedSavedAddressId(item.id);
                        applySavedAddress(item.id);
                      }
                    }}
                    className={`w-full text-left rounded-md border p-4 transition ${
                      isSelected
                        ? "border-blue bg-blue/5"
                        : "border-gray-3 bg-gray-1 hover:border-blue/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-dark">{item.name}</p>
                        <p className="text-sm text-dark-4">{item.mobile}</p>
                        <p className="text-sm text-dark-4">
                          {`${item.address}, ${item.city}, ${item.state}, ${item.country} - ${item.pincode}`}
                        </p>
                      </div>
                      <span
                        className={`mt-1 h-4 w-4 rounded-full border ${
                          isSelected ? "border-blue bg-blue" : "border-gray-4 bg-white"
                        }`}
                      />
                    </div>
                    <div className="mt-3 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(item);
                        }}
                        className="text-xs font-medium text-blue hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteAddress(item.id);
                        }}
                        disabled={deletingAddressId === item.id}
                        className={`text-xs font-medium ${
                          deletingAddressId === item.id ? "text-gray-4" : "text-red hover:underline"
                        }`}
                      >
                        {deletingAddressId === item.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-end mb-5">
          {savedAddresses.length > 0 && (
            <button
              type="button"
              onClick={openAddModal}
              className="btn-primary py-2.5 text-sm"
            >
              Add New Address
            </button>
          )}
        </div>

        {!savedAddresses.length && (
          <div>
            <h3 className="font-medium text-lg text-dark mb-4">New Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  required
                  value={modalValues.name}
                  onChange={handleModalInputChange("name")}
                  placeholder="Name"
                  className="form-input"
                />
                {renderFieldError("name")}
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={modalValues.mobile}
                  onChange={handleModalInputChange("mobile")}
                  placeholder="Mobile"
                  className="form-input"
                />
                {renderFieldError("mobile")}
              </div>
            </div>
            <div className="mb-4">
              <textarea
                required
                rows={2}
                value={modalValues.address}
                onChange={handleModalInputChange("address")}
                placeholder="Address"
                className="form-input"
              />
              {renderFieldError("address")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <input
                  type="text"
                  required
                  value={modalValues.city}
                  onChange={handleModalInputChange("city")}
                  placeholder="City"
                  className="form-input"
                />
                {renderFieldError("city")}
              </div>
              <div>
                <input
                  type="text"
                  required
                  value={modalValues.pincode}
                  onChange={handleModalInputChange("pincode")}
                  placeholder="Pincode"
                  className="form-input"
                />
                {renderFieldError("pincode")}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <select
                  required
                  value={modalValues.country}
                  onChange={handleModalCountryChange}
                  className="form-input"
                >
                  <option value="">Select Country</option>
                  {countryList.map((country) => (
                    <option key={country.name} value={country.name}>
                      {country.name}
                    </option>
                  ))}
                </select>
                {renderFieldError("country")}
              </div>
              <div>
                <select
                  required
                  value={modalValues.state}
                  onChange={handleModalInputChange("state")}
                  className="form-input"
                >
                  <option value="">Select State</option>
                  {modalStateList.map((state) => (
                    <option key={state.name} value={state.name}>
                      {state.name}
                    </option>
                  ))}
                </select>
                {renderFieldError("state")}
              </div>
            </div>
            <div className="mb-5 flex justify-end">
              <button
                type="button"
                onClick={handleSaveAddress}
                disabled={savingAddress}
                className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium text-white ${
                  savingAddress ? "bg-gray-4" : "bg-blue hover:bg-blue-dark"
                }`}
              >
                {savingAddress ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        )}

        {isShip && (
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-2 items-center justify-center">
            <div className="w-full">
              <Button type="link" onClick={() => { setIsDiffBillAddress((prev) => !prev); }}>
                Is Different Billing Address ?
                <input className="ml-3" type="checkbox" checked={isDiffBillAddress} readOnly />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Modal
        title={isEditMode ? "Edit Address" : "Add New Address"}
        open={isModalOpen && savedAddresses.length > 0}
        centered
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                required
                value={modalValues.name}
                onChange={handleModalInputChange("name")}
                placeholder="Name"
                className="form-input"
              />
              {renderFieldError("name")}
            </div>
            <div>
              <input
                type="text"
                required
                value={modalValues.mobile}
                onChange={handleModalInputChange("mobile")}
                placeholder="Mobile"
                className="form-input"
              />
              {renderFieldError("mobile")}
            </div>
          </div>
          <div className="mb-4">
            <textarea
              required
              rows={2}
              value={modalValues.address}
              onChange={handleModalInputChange("address")}
              placeholder="Address"
              className="form-input"
            />
            {renderFieldError("address")}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <input
                type="text"
                required
                value={modalValues.city}
                onChange={handleModalInputChange("city")}
                placeholder="City"
                className="form-input"
              />
              {renderFieldError("city")}
            </div>
            <div>
              <input
                type="text"
                required
                value={modalValues.pincode}
                onChange={handleModalInputChange("pincode")}
                placeholder="Pincode"
                className="form-input"
              />
              {renderFieldError("pincode")}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <select
                required
                value={modalValues.country}
                onChange={handleModalCountryChange}
                className="form-input"
              >
                <option value="">Select Country</option>
                {countryList.map((country) => (
                  <option key={country.name} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
              {renderFieldError("country")}
            </div>
            <div>
              <select
                required
                value={modalValues.state}
                onChange={handleModalInputChange("state")}
                className="form-input"
              >
                <option value="">Select State</option>
                {modalStateList.map((state) => (
                  <option key={state.name} value={state.name}>
                    {state.name}
                  </option>
                ))}
              </select>
              {renderFieldError("state")}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border border-gray-3 text-dark-4">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAddress}
              disabled={savingAddress}
              className={`px-5 py-2 rounded-lg text-white ${savingAddress ? "bg-gray-4" : "bg-blue hover:bg-blue-dark"}`}
            >
              {savingAddress ? "Saving..." : isEditMode ? "Update Address" : "Save Address"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Address;
