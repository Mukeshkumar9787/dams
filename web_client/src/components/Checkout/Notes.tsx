import React from "react";

const Notes = ({ checkoutValues, setCheckoutValues }) => {

  return (
    <div id="addressForm" className="mt-3">
      <div className="form-card p-4 sm:p-8.5">
        <div className="mb-5">
          <label className="form-label">
            GST no.
          </label>
          <input
            type="text"
            name="gstNo"
            value={checkoutValues?.gstNo || ""}
            onChange={(e) => setCheckoutValues((prev) => ({ ...prev, gstNo: e.target.value }))}
            placeholder="Enter GST no."
            className="form-input"
          />
        </div>
        <div className="mb-5">
          <label className="form-label">
            Other Additional Notes
          </label>
          <textarea
            name="notes"
            rows={2}
            value={checkoutValues?.notes || ""}
            onChange={(e) => setCheckoutValues((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Enter Notes"
            className="form-input"
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;
