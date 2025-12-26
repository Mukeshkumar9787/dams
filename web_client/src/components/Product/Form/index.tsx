"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import FileUploader from "@/components/Common/FileUploader";
import { createProduct, deleteProduct, getCategories, getProductBySlug, updateProduct } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { CATEGORY_URL } from "@/utils/appUrls";
import React from "react";
import { useRouter } from "next/navigation";

const ProductForm = ({ params }) => {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState(STATUS_TYPES.ACTIVE);
  const [image, setImage] = React.useState([]);
  const editDataRef = React.useRef({ title: '', status: STATUS_TYPES.ACTIVE, id: '', img: null, fileId: '' });
  const [categoryItems, setCategoryItems] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState(null);
  
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories({status: STATUS_TYPES.ACTIVE});
        setCategoryItems(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  let isNew = params.slug === 'new';


  const handleSubmit = async (e) => {
    e.preventDefault();
    let response:any;
    if(isNew){
      response = await createProduct({title, status, fileIds: image.id ? [image.id] : []})
    }else {
      let fileIds = [];
      let deleteFileIds = [];
      if(editDataRef.current.fileId !== image.id){
        fileIds.push(image.id);
        deleteFileIds.push(editDataRef.current.fileId);
      }
      response = await updateProduct({title, status, fileIds, deleteFileIds, id: editDataRef.current.id })
    }
    if(response.success){
       router.replace(CATEGORY_URL);
    }
  };
  
  const handleDelete = async (e) => {
    e.preventDefault();
    if(!window.confirm(`Do you want to delete: ${title} Product ?`)) return
    if(!isNew){
      let response = await deleteProduct({id: editDataRef.current.id})
      if(response.success){
         router.replace(CATEGORY_URL);
      }
    }
  };



  React.useEffect(() => {
    if(isNew) return;
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(params);
        editDataRef.current = data?.data || {};
        setTitle(editDataRef.current.title);
        setStatus(editDataRef.current.status);
        setImage({id: editDataRef.current.fileId, path: editDataRef.current.img});
      } catch (err) {
        console.error(err);
      }
    };

    fetchProduct();
    }, []);
  

  return (
    <>
      <Breadcrumb title={"Product"} pages={["Product /", params.slug]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">

            <div className="text-center mb-8">
              <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                {isNew ? "Create Product" : "Product Details"} 
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Product Name */}
              <div className="mb-5">
                <label className="block mb-2.5">Product Name</label>
                <input
                  type="text"
                  placeholder="Enter Product name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>

              {/* Category */}
              <div className="mb-7">
                <label className="block mb-2.5">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                >
                  {categoryItems.map(value => 
                    <option key={value.id} value={value.id}>{value.title}</option>
                  )}
                </select>
              </div>

              {/* Product Image */}
              <div className="mb-5">
                <label className="block mb-2.5">Product Image</label>
                <FileUploader files={image} setFiles={setImage} multiSelect />
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
                Save Product
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

export default ProductForm;
