"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import FileUploader from "@/components/Common/FileUploader";
import { createCategory, deleteCategory, getCategoryBySlug, updateCategory } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { CATEGORY_URL } from "@/utils/appUrls";
import React from "react";
import { useRouter } from "next/navigation";

const CategoryForm = ({ params }) => {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState(STATUS_TYPES.ACTIVE);
  const [image, setImage] = React.useState(null);
  const editDataRef = React.useRef({ title: '', status: STATUS_TYPES.ACTIVE, id: '', img: null, fileId: '' });
  const fileIdsRef = React.useRef(new Set());
  const deletedFileIdsRef = React.useRef(new Set());

  let isNew = params.slug === 'new';


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!image){
      window.alert("Select a file ...!");
      return;
    }
    let response:any;
    if(isNew){
      response = await createCategory({title, status, fileIds: [...fileIdsRef.current], deleteFileIds: [...deletedFileIdsRef.current]})
    }else {
      let fileIds = [];
      let deleteFileIds = [];
      if(editDataRef.current.fileId !== image.id){
        fileIds.push(image.id);
        deleteFileIds.push(editDataRef.current.fileId);
      }
      response = await updateCategory({title, status, fileIds: [...fileIdsRef.current], deleteFileIds: [...deletedFileIdsRef.current], id: editDataRef.current.id })
    }
    if(response.success){
       router.replace(CATEGORY_URL);
    }
  };
  
  const handleDelete = async (e) => {
    e.preventDefault();
    if(!window.confirm(`Do you want to delete: ${title} category ?`)) return
    if(!isNew){
      let response = await deleteCategory({id: editDataRef.current.id})
      if(response.success){
         router.replace(CATEGORY_URL);
      }
    }
  };



  React.useEffect(() => {
    if(isNew) return;
    const fetchCategory = async () => {
      try {
        const data = await getCategoryBySlug(params);
        editDataRef.current = data?.data || {};
        setTitle(editDataRef.current.title);
        setStatus(editDataRef.current.status);
        setImage({id: editDataRef.current.fileId, path: editDataRef.current.img});
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategory();
    }, []);
  

  return (
    <>
      <Breadcrumb title={"Category"} pages={["Category /", params.slug]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">

            <div className="text-center mb-8">
              <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                {isNew ? "Create Category" : "Category Details"} 
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
                <FileUploader files={image} setFiles={setImage} fileIdsRef={fileIdsRef} deletedFileIdsRef={deletedFileIdsRef} />
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
              <div className="w-full flex">
              <button
                type="submit"
                className="w-3/4 flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg transition"
              >
                Save Category
              </button>
              {!isNew &&
                  <button
                  type="button"
                  onClick={handleDelete}
                  className="ml-3 w-1/4 font-medium text-white bg-red py-3 px-6 rounded-lg transition"
                  >
                  Delete
                  </button>
              }
              </div>
            </form>

          </div>
        </div>
      </section>
    </>
  );
};

export default CategoryForm;
