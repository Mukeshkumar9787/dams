"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import FileUploader from "@/components/Common/FileUploader";
import { createProduct, deleteProduct, getCategories, getHsnCodes, getProductBySlug, updateProduct } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { CATEGORY_URL } from "@/utils/appUrls";
import React from "react";
import { useRouter } from "next/navigation";

const ProductForm = ({ params }) => {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState(STATUS_TYPES.ACTIVE);
  const [images, setImages] = React.useState([]);
  const editDataRef = React.useRef({ title: '', status: STATUS_TYPES.ACTIVE, id: '', images: [] });
  const [categoryItems, setCategoryItems] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState(null);
  const [hsnItems, setHsnItems] = React.useState([]);
  const [hsnId, setHsnId] = React.useState(null);
  const [mrp, setMrp] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [stock, setStock] = React.useState(0);
  const tax = React.useRef(0);
  const fileIdsRef = React.useRef(new Set());
  const deletedFileIdsRef = React.useRef(new Set());
  
  
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

  React.useEffect(() => {
    const fetchHsn = async () => {
      try {
        const data = await getHsnCodes({status: STATUS_TYPES.ACTIVE});
        setHsnItems(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHsn();
  }, []);

  let isNew = params.slug === 'new';


  const handleSubmit = async (e) => {
    e.preventDefault();
    if(images.length === 0){
      window.alert("Select a file ...!");
      return;
    }
    let response:any;
    if(isNew){
      response = await createProduct({title, status, fileIds: [...fileIdsRef.current], deletedFileIds: [...deletedFileIdsRef.current]})
    }else {
      response = await updateProduct({title, status, fileIds: [...fileIdsRef.current], deletedFileIds: [...deletedFileIdsRef.current], id: editDataRef.current.id })
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
        setImages(editDataRef.current.images);
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
                  required
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                >
                  <option value={null}>Select</option>
                  {categoryItems.map(value => 
                    <option key={value.id} value={value.id}>{value.title}</option>
                  )}
                </select>
              </div>

              {/* Hsn */}
              <div className="mb-7 flex w-full gap-5">
                <div className="w-1/2">
                  <label className="block mb-2.5">Hsn</label>
                  <select
                    value={hsnId}
                    onChange={(e) => {
                      setHsnId(e.target.value); 
                      tax.current = hsnItems.find(i => i.id === parseInt(e.target.value))?.tax || 0
                    }}
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                    >
                    <option value={null}>Select</option>
                    {hsnItems.map(value => 
                      <option key={value.id} value={value.id}>{value.code}</option>
                    )}
                  </select>
                </div>
                <div className="w-1/2">
                <label className="block mb-2.5">Tax</label>
                <input
                  type="text"
                  placeholder="Enter Tax"
                  value={tax.current}
                  disabled
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>
              </div>

              <div className="mb-7 flex w-full gap-5">
                <div className="w-1/2">
                  <label className="block mb-2.5">Mrp</label>
                  <input
                  type="number"
                  placeholder="Enter MRP"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  required
                  min={0}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block mb-2.5">Price</label>
                  <input
                  type="number"
                  placeholder="Enter Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min={0}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                  />
                </div>
              </div>

              <div className="mb-7">
                  <label className="block mb-2.5">Stock</label>
                  <input
                  type="number"
                  placeholder="Enter stock"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                  min={0}
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                  />
              </div>



              {/* Product Image */}
              <div className="mb-5">
                <label className="block mb-2.5">Product Image</label>
                <FileUploader files={images} setFiles={setImages} multiSelect fileIdsRef={fileIdsRef} deletedFileIdsRef={deletedFileIdsRef} />
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
