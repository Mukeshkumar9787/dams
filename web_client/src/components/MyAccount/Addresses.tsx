import React, { useEffect, useState } from "react";
import { Button, Modal } from "antd";
import { createAddress, deleteAddress, getAddress, updateAddress } from "@/http/apiCalls";

const initialAddress = {
  name: "",
  mobile: "",
  address: "",
  city: "",
  pincode: "",
  country: "",
  state: "",
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [formValues, setFormValues] = useState(initialAddress);
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isEditing = Boolean(editingId);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getAddress();
      if (!response?.success) return;
      setAddresses(response.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormValues(initialAddress);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormValues({
      name: item.name || "",
      mobile: item.mobile || "",
      address: item.address || "",
      city: item.city || "",
      pincode: item.pincode || "",
      country: item.country || "",
      state: item.state || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormValues(initialAddress);
  };

  const handleInputChange = (field) => (e) => {
    setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = isEditing
        ? await updateAddress(editingId, formValues)
        : await createAddress(formValues);
      if (!response?.success) return;
      await fetchAddresses();
      closeModal();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      const response = await deleteAddress(id);
      if (!response?.success) return;
      await fetchAddresses();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full bg-white rounded-xl shadow-1 p-4 sm:p-7.5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-lg text-dark">Saved Addresses</h3>
        <Button type="primary" className="bg-blue" onClick={openAddModal}>
          Add New Address
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-dark-4">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p className="text-sm text-dark-4">No addresses found.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((item) => (
            <div key={item.id} className="rounded-md border border-gray-3 bg-gray-1 p-4">
              <p className="font-medium text-dark">{item.name}</p>
              <p className="text-sm text-dark-4">{item.mobile}</p>
              <p className="text-sm text-dark-4">{item.address}</p>
              <p className="text-sm text-dark-4">{`${item.city}, ${item.state}, ${item.country} - ${item.pincode}`}</p>
              <div className="mt-3 flex items-center justify-end gap-4">
                <button type="button" onClick={() => openEditModal(item)} className="text-sm text-blue hover:underline">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                  className={`text-sm ${deletingId === item.id ? "text-gray-4" : "text-red hover:underline"}`}
                >
                  {deletingId === item.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        title={isEditing ? "Edit Address" : "Add New Address"}
        open={isModalOpen}
        centered
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
      >
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              required
              value={formValues.name}
              onChange={handleInputChange("name")}
              placeholder="Name"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue/20"
            />
            <input
              type="text"
              required
              value={formValues.mobile}
              onChange={handleInputChange("mobile")}
              placeholder="Mobile"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <div className="mb-4">
            <textarea
              required
              rows={2}
              value={formValues.address}
              onChange={handleInputChange("address")}
              placeholder="Address"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              required
              value={formValues.city}
              onChange={handleInputChange("city")}
              placeholder="City"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue/20"
            />
            <input
              type="text"
              required
              value={formValues.pincode}
              onChange={handleInputChange("pincode")}
              placeholder="Pincode"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <input
              type="text"
              required
              value={formValues.country}
              onChange={handleInputChange("country")}
              placeholder="Country"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue/20"
            />
            <input
              type="text"
              required
              value={formValues.state}
              onChange={handleInputChange("state")}
              placeholder="State"
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-4 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={closeModal} className="px-4 py-2 rounded-md border border-gray-3 text-dark-4">
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-5 py-2 rounded-md text-white ${saving ? "bg-gray-4" : "bg-blue"}`}
            >
              {saving ? "Saving..." : isEditing ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Addresses;
