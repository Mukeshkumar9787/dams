import React from "react";

const Notes = () => {

  return (
    <div id="addressForm" className="mt-3">
      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="mb-5">
          <label className="block mb-2.5">
            Other Notes <span className="text-red">*</span>
          </label>
          <textarea
            name="notes"
            rows={2}
            placeholder="Enter Notes"
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Notes;
