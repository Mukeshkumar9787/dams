"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import FileUploader from "@/components/Common/FileUploader";
import { createProduct, deleteProduct, getCategories, getColors, getHsnCodes, getProductBySlug, getSizes, updateProduct } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { PRODUCT_URL } from "@/utils/appUrls";
import React from "react";
import { useRouter } from "next/navigation";
import { Select } from "antd";

const ProductForm = ({ params }) => {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [variant, setVariant] = React.useState("");
  const [status, setStatus] = React.useState(STATUS_TYPES.ACTIVE);
  const [images, setImages] = React.useState([]);
  const editDataRef = React.useRef({});
  const [categoryItems, setCategoryItems] = React.useState([]);
  const [categoryId, setCategoryId] = React.useState(null);
  const [hsnItems, setHsnItems] = React.useState([]);
  const [hsnId, setHsnId] = React.useState(null);
  const [colorId, setColorId] = React.useState(null);
  const [colorItems, setColorItems] = React.useState([]);
  const [sizeId, setSizeId] = React.useState(null);
  const [sizeItems, setSizeItems] = React.useState([]);
  const [mrp, setMrp] = React.useState(1);
  const [price, setPrice] = React.useState(1);
  const [stock, setStock] = React.useState(1);
  const tax = hsnItems.find(i => i.id == hsnId)?.tax || 0;
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
    const fetchColors = async () => {
      try {
        const data = await getColors({status: STATUS_TYPES.ACTIVE});
        setColorItems(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchColors();
  }, []);

  React.useEffect(() => {
    const fetchSizes = async () => {
      try {
        const data = await getSizes({status: STATUS_TYPES.ACTIVE});
        setSizeItems(data?.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSizes();
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
    let data = { title, status, categoryId, hsnId, sizeId, colorId, mrp, price, stock,variant, fileIds: [...fileIdsRef.current], deletedFileIds: [...deletedFileIdsRef.current] }
    let response:any;
    if(isNew){
      response = await createProduct(data);
    }else {
      response = await updateProduct({...data, id: editDataRef.current.id })
    }
    if(response.success){
       router.replace(PRODUCT_URL);
    }
  };
  
  const handleDelete = async (e) => {
    e.preventDefault();
    if(!window.confirm(`Do you want to delete: ${title} Product ?`)) return
    if(!isNew){
      let response = await deleteProduct({id: editDataRef.current.id})
      if(response.success){
         router.replace(PRODUCT_URL);
      }
    }
  };



  React.useEffect(() => {
    if(isNew) return;
    const fetchProduct = async () => {
      try {
        const data = await getProductBySlug(params);
        editDataRef.current = data?.data || {};
        setVariant(editDataRef.current.variant);
        setTitle(editDataRef.current.title);
        setStatus(editDataRef.current.status);
        setImages(editDataRef.current.images);
        setCategoryId(editDataRef.current.categoryId);
        setHsnId(editDataRef.current.hsnId);
        setColorId(editDataRef.current.colorId);
        setSizeId(editDataRef.current.sizeId);
        setMrp(editDataRef.current.mrp);
        setPrice(editDataRef.current.price);
        setStock(editDataRef.current.stock);
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
              {/* Product Variant */}
              <div className="mb-5">
                <label className="block mb-2.5">Product Variant</label>
                <input
                  type="text"
                  placeholder="Enter Variant"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  required
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>

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

              {/* Color / Size */}
              <div className="mb-7 flex w-full gap-5">
                <div className="w-1/2">
                  <label className="block mb-2.5">Color</label>
                  <Select value={colorId} onChange={(value) => setColorId(value)} style={{ width: 200 }} className="h-13 bg-gray">
                    {colorItems.map(item => (
                      <Select.Option key={item.id} value={item.id}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span
                            style={{
                              width: 16,
                              height: 16,
                              backgroundColor: item.code,
                              display: 'inline-block',
                              borderRadius: 4,
                              border: '1px solid #ccc'
                            }}
                          />
                          {item.title}
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </div>
                <div className="w-1/2">
                  <label className="block mb-2.5">Size</label>
                  <select
                    itemType="number"
                    value={sizeId}
                    onChange={(e) => {
                      setSizeId(e.target.value); 
                    }}
                    className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                    >
                    <option value={null}>Select</option>
                    {sizeItems.map(value => 
                      <option key={value.id} value={value.id}>{value.title}</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Hsn */}
              <div className="mb-7 flex w-full gap-5">
                <div className="w-1/2">
                  <label className="block mb-2.5">Hsn</label>
                  <select
                    itemType="number"
                    value={hsnId}
                    onChange={(e) => {
                      setHsnId(e.target.value); 
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
                  value={tax}
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
                  min={1}
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
                  min={1}
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
                  min={1}
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
