"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { createHsn, deleteHsn, getHsnByCode, updateHsn } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { HSN_URL } from "@/utils/appUrls";
import React from "react";
import { useRouter } from "next/navigation";

const HsnForm = ({ params }) => {
  const router = useRouter();
  const [code, setCode] = React.useState("");
  const [tax, setTax] = React.useState("");
  const [status, setStatus] = React.useState(STATUS_TYPES.ACTIVE);
  const editDataRef = React.useRef({ code: '', status: STATUS_TYPES.ACTIVE, id: '', tax: ''});

  let isNew = params.slug === 'new';


  const handleSubmit = async (e) => {
    e.preventDefault();
    let response:any;
    if(isNew){
      response = await createHsn({ code, status, tax })
    }else {
      response = await updateHsn({ code, status, id: editDataRef.current.id, tax })
    }
    if(response.success){
       router.replace(HSN_URL);
    }
  };
  
  const handleDelete = async (e) => {
    e.preventDefault();
    if(!window.confirm(`Do you want to delete: ${code} Hsn ?`)) return
    if(!isNew){
      let response = await deleteHsn({id: editDataRef.current.id})
      if(response.success){
         router.replace(HSN_URL);
      }
    }
  };



  React.useEffect(() => {
    if(isNew) return;
    const fetchHsn = async () => {
      try {
        const data = await getHsnByCode({code: params.slug});
        editDataRef.current = data?.data || {};
        setCode(editDataRef.current.code);
        setTax(editDataRef.current.tax);
        setStatus(editDataRef.current.status);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHsn();
    }, []);
  

  return (
    <>
      <Breadcrumb title={"Hsn"} pages={["Hsn /", params.slug]} />

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">

            <div className="text-center mb-8">
              <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                {isNew ? "Create Hsn" : "Hsn Details"} 
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Hsn Name */}
              <div className="mb-5">
                <label className="block mb-2.5">Hsn Code</label>
                <input
                  type="text"
                  placeholder="Enter Hsn"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2.5">Tax</label>
                <input
                  type="number"
                  placeholder="Enter Tax"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  required
                  className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
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
                Save Hsn
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

export default HsnForm;
