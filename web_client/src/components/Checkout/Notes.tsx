import React from "react";

const Notes = ({ checkoutValues, setCheckoutValues }) => {

  return (
    <div id="addressForm" className="mt-3">
      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="mb-5">
          <label className="block mb-2.5">
            GST no.
          </label>
          <input
            type="text"
            name="gstNo"
            value={checkoutValues?.gstNo || ""}
            onChange={(e) => setCheckoutValues((prev) => ({ ...prev, gstNo: e.target.value }))}
            placeholder="Enter GST no."
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>
        <div className="mb-5">
          <label className="block mb-2.5">
            Other Additional Notes
          </label>
          <textarea
            name="notes"
            rows={2}
            value={checkoutValues?.notes || ""}
            onChange={(e) => setCheckoutValues((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Enter Notes"
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;
