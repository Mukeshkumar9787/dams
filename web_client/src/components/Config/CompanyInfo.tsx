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
      type: "text",
      required: true,
    },
    {
      key: "facebook",
      label: "Facebook",
      placeholder: "Enter link",
      type: "text",
      required: true,
    },
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "Enter link",
      type: "text",
      required: true,
    },
    {
      key: "twitter",
      label: "Twitter",
      placeholder: "Enter link",
      type: "text",
      required: true,
    },
    {
      key: "privacy",
      label: "Privacy Policy",
      placeholder: "Enter link",
      type: "text",
      required: true,
    },
    {
      key: "refund",
      label: "Refund Policy",
      placeholder: "Enter link",
      type: "text",
      required: true,
    },
    {
      key: "terms",
      label: "Terms & Conditions",
      placeholder: "Enter link",
      type: "text",
      required: true,
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
    <>
      <div className="text-center mb-8">
        <h2 className="font-semibold text-xl sm:text-2xl text-dark">
          Company Info
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-2">
      {fields.map((field) => (
        <div className={`mb-5 col-span-${field.col || 1}`} key={field.key}>
          <label className="block mb-2.5">{field.label}</label>

          {field.type === "textarea" ? (
            <textarea
              rows={4}
              placeholder={field.placeholder}
              value={compInfo?.[field.key] || ""}
              onChange={(e) =>
                handleOnChange(field.key, e.target.value)
              }
              required={field.required}
              className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
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
              className="rounded-lg border border-gray-3 bg-gray-1 w-full py-3 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          )}
        </div>
      ))}
      </div>
    </>
  );
};

export default CompanyInfo;
