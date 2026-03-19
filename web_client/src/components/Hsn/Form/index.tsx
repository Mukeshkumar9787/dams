"use client";

import AdminOverview from "@/components/Common/AdminOverview";
import { createHsn, deleteHsn, getHsnByCode, updateHsn } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { HSN_URL } from "@/utils/appUrls";
import React from "react";
import { useRouter } from "next/navigation";
import { confirmAction } from "@/utils/notify";

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
    const isConfirmed = await confirmAction({
      title: "Delete HSN?",
      content: `This will delete HSN "${code}".`,
      okText: "Delete",
    });
    if(!isConfirmed) return;
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
      <section className="page-section bg-gray-2/60">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <AdminOverview
            eyebrow="Tax Admin"
            title={isNew ? "Create a new HSN record." : "Edit HSN details."}
            description="Manage HSN code metadata and tax rates used during catalog setup and order calculation."
          />
          <div className="form-card max-w-[570px] w-full mx-auto">

            <div className="text-center mb-8">
              <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                {isNew ? "Create Hsn" : "Hsn Details"} 
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Hsn Name */}
              <div className="mb-5">
                <label className="form-label">Hsn Code</label>
                <input
                  type="text"
                  placeholder="Enter Hsn"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="mb-5">
                <label className="form-label">Tax</label>
                <input
                  type="number"
                  placeholder="Enter Tax"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              {/* Status */}
              <div className="mb-7">
                <label className="form-label">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-input"
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
                className="btn-primary w-3/4"
              >
                Save Hsn
              </button>
              {!isNew &&
                  <button
                  type="button"
                  onClick={handleDelete}
                  className="btn-danger ml-3 w-1/4"
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
