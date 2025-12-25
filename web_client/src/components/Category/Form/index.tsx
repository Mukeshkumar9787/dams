"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import FileUploader from "@/components/Common/FileUploader";
import { createCategory } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { CATEGORY_URL } from "@/utils/appUrls";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CategoryForm = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState(STATUS_TYPES.ACTIVE);
  const [image, setImage] = useState(null);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createCategory({title, status, fileIds: image.id ? [image.id] : []})
    if(response.success){
       router.replace(CATEGORY_URL);
    }
  };

  return (
    <>
      <Breadcrumb title={"Category"} pages={["Category"]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">

            <div className="text-center mb-8">
              <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                Create Category
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Category Name */}
              <div className="mb-5">
                <label className="block mb-2.5">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>

              {/* Category Image */}
              <div className="mb-5">
                <label className="block mb-2.5">Category Image</label>
                <FileUploader files={image} setFiles={setImage} />
              </div>

              {/* Status */}
              <div className="mb-7">
                <label className="block mb-2.5">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                >
                  {Object.values(STATUS_TYPES).map(value => 
                    <option key={value} value={value}>{value}</option>
                  )}
                </select>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg hover:bg-blue transition"
              >
                Save Category
              </button>
            </form>

          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryForm;
