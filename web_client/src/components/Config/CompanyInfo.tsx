import React from "react";

const CompanyInfo = ({ compInfo, setCompInfo }) => {
  const handleOnChange = (name, value) => {
    setCompInfo((prev) => ({ ...prev, [name]: value }));
  };

  const fields = [
    {
      key: "name",
      label: "Company Name",
      placeholder: "Enter Name",
      type: "text",
      required: true,
    },
    {
      key: "mobile",
      label: "Company Mobile",
      placeholder: "Enter mobile",
      type: "number",
      required: true,
    },
    {
      key: "email",
      label: "Email",
      placeholder: "Enter email",
      type: "email",
      required: true,
    },
    {
      key: "facebook",
      label: "Facebook",
      placeholder: "Enter link",
      type: "text",
      required: false,
    },
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "Enter link",
      type: "text",
      required: false,
    },
    {
      key: "twitter",
      label: "Twitter",
      placeholder: "Enter link",
      type: "text",
      required: false,
    },
    {
      key: "privacy",
      label: "Privacy Policy",
      placeholder: "Enter link",
      type: "text",
      required: false,
    },
    {
      key: "refund",
      label: "Refund Policy",
      placeholder: "Enter link",
      type: "text",
      required: false,
    },
    {
      key: "terms",
      label: "Terms & Conditions",
      placeholder: "Enter link",
      type: "text",
      required: false,
    },
    {
      key: "address",
      label: "Company Address",
      placeholder: "Enter Address",
      type: "textarea",
      required: true,
      col: 2,
    },
  ];

  return (
    <div className="mb-8 rounded-[26px] bg-white p-5 sm:p-6">
      <div className="mb-6 pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
          Company Info
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Brand and contact settings
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          These details power the footer, support contact info, and policy links across the storefront.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) => (
        <div className={field.col === 2 ? "md:col-span-2" : ""} key={field.key}>
          <label className="mb-2 block text-sm font-medium text-slate-700">{field.label}</label>

          {field.type === "textarea" ? (
            <textarea
              rows={4}
              placeholder={field.placeholder}
              value={compInfo?.[field.key] || ""}
              onChange={(e) =>
                handleOnChange(field.key, e.target.value)
              }
              required={field.required}
              className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500"
            />
          ) : (
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={compInfo?.[field.key] || ""}
              onChange={(e) =>
                handleOnChange(field.key, e.target.value)
              }
              required={field.required}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500"
            />
          )}
        </div>
      ))}
      </div>
    </div>
  );
};

export default CompanyInfo;
