"use client";

import AdminOverview from "@/components/Common/AdminOverview";
import { createColor, deleteColor, getColorBySlug, updateColor } from "@/http/apiCalls";
import { STATUS_TYPES } from "@/utils/constants";
import { COLOR_URL } from "@/utils/appUrls";
import React from "react";
import { useRouter } from "next/navigation";
import { confirmAction } from "@/utils/notify";

const ColorForm = ({ params }) => {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [code, setCode] = React.useState("");
  const [status, setStatus] = React.useState(STATUS_TYPES.ACTIVE);
  const editDataRef = React.useRef({ title: '', status: STATUS_TYPES.ACTIVE, id: '', code: ''});

  let isNew = params.slug === 'new';


  const handleSubmit = async (e) => {
    e.preventDefault();
    let response:any;
    if(isNew){
      response = await createColor({ title,code, status })
    }else {
      response = await updateColor({ title, code, status, id: editDataRef.current.id })
    }
    if(response.success){
       router.replace(COLOR_URL);
    }
  };
  
  const handleDelete = async (e) => {
    e.preventDefault();
    const isConfirmed = await confirmAction({
      title: "Delete color?",
      content: `This will delete "${title}" color.`,
      okText: "Delete",
    });
    if(!isConfirmed) return
    if(!isNew){
      let response = await deleteColor({id: editDataRef.current.id})
      if(response.success){
         router.replace(COLOR_URL);
      }
    }
  };



  React.useEffect(() => {
    if(isNew) return;
    const fetchColor = async () => {
      try {
        const data = await getColorBySlug({slug: params.slug});
        editDataRef.current = data?.data || {};
        setTitle(editDataRef.current.title);
        setCode(editDataRef.current.code);
        setStatus(editDataRef.current.status);
      } catch (err) {
        console.error(err);
      }
    };

    fetchColor();
    }, []);
  

  return (
    <>
      <section className="page-section bg-gray-2/60">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <AdminOverview
            eyebrow="Catalog Admin"
            title={isNew ? "Create a new color." : "Edit color details."}
            description="Define display names, swatches, and active status for color options used across the product catalog."
          />
          <div className="form-card max-w-[570px] w-full mx-auto">

            <div className="text-center mb-8">
              <h2 className="font-semibold text-xl sm:text-2xl text-dark">
                {isNew ? "Create Color" : "Color Details"} 
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Color Name */}
              <div className="mb-5">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  placeholder="Enter Color"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input"
                />
              </div>

              <div className="mb-5">
                <label className="form-label">Code</label>
                <div>
                  <input
                    type="color"
                    placeholder="Enter Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    className="form-input"
                  />
                  <div key={code} className={`w-10 h-10`} style={{backgroundColor: code}}>
                  </div>
                </div>
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
                Save Color
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

export default ColorForm;
