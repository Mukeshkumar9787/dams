import React, { useEffect, useState } from "react";
import countryList from "../../data/countries.json";
import { getLoggedInUserData } from "@/utils/helper";
import { ADDRESS_TYPES } from "@/utils/constants";
import { Button } from "antd";

const Address = ({
  type = ADDRESS_TYPES.SHIP,
  isDiffBillAddress = false,
  setIsDiffBillAddress = null,
  checkoutValues,
  setCheckoutValues,
}) => {
  const [userData, setUserData] = useState(null);
  const isShip = type === ADDRESS_TYPES.SHIP;
  const countryField = isShip ? "country" : "billingCountry";
  const stateField = isShip ? "state" : "billingState";
  const selectedCountry = checkoutValues?.[countryField] || "";

  const stateList = selectedCountry
    ? countryList.find((i) => i.name === selectedCountry)?.states || []
    : [];

  useEffect(() => {
    if (!localStorage.getItem("token")) return;

    const fetchUser = async () => {
      const userDataDetails = await getLoggedInUserData();
      if (userDataDetails) {
        setUserData(userDataDetails);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!userData) return;

    setCheckoutValues((prev) => {
      const next = { ...prev };
      if (isShip) {
        if (!next.name) next.name = userData?.name || "";
        if (!next.mobile) next.mobile = userData?.mobile || "";
      } else {
        if (!next.billingName) next.billingName = userData?.name || "";
        if (!next.billingMobile) next.billingMobile = userData?.mobile || "";
      }
      return next;
    });
  }, [userData, isShip, setCheckoutValues]);

  const handleInputChange = (field) => (e) => {
    setCheckoutValues((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCountryChange = (e) => {
    const countryValue = e.target.value;
    setCheckoutValues((prev) => ({
      ...prev,
      [countryField]: countryValue,
      [stateField]: "",
    }));
  };

  const getShippingHeading = () => {
    if (!isDiffBillAddress) return "Shipping & Billing";
    return "Shipping";
  };

  return (
    <div id="addressForm" className="mt-3">
      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <h2 className="font-medium text-xl text-dark mb-3">
          {isShip ? getShippingHeading() : "Billing"} Address
        </h2>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label className="block mb-2.5">
              Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name={isShip ? "name" : "billingName"}
              value={checkoutValues?.[isShip ? "name" : "billingName"] || ""}
              onChange={handleInputChange(isShip ? "name" : "billingName")}
              placeholder="Enter name"
              required
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full">
            <label className="block mb-2.5">
              Mobile <span className="text-red">*</span>
            </label>
            <input
              type="number"
              name={isShip ? "mobile" : "billingMobile"}
              value={checkoutValues?.[isShip ? "mobile" : "billingMobile"] || ""}
              onChange={handleInputChange(isShip ? "mobile" : "billingMobile")}
              placeholder="Enter mobile"
              required
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="mb-5">
          <label className="block mb-2.5">
            Address <span className="text-red">*</span>
          </label>
          <textarea
            name={isShip ? "address" : "billingAddress"}
            rows={2}
            value={checkoutValues?.[isShip ? "address" : "billingAddress"] || ""}
            onChange={handleInputChange(isShip ? "address" : "billingAddress")}
            placeholder="Enter Address"
            required
            className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label className="block mb-2.5">
              City <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name={isShip ? "city" : "billingCity"}
              value={checkoutValues?.[isShip ? "city" : "billingCity"] || ""}
              onChange={handleInputChange(isShip ? "city" : "billingCity")}
              placeholder="Enter city"
              required
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full">
            <label className="block mb-2.5">
              Pincode <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name={isShip ? "pincode" : "billingPincode"}
              value={checkoutValues?.[isShip ? "pincode" : "billingPincode"] || ""}
              onChange={handleInputChange(isShip ? "pincode" : "billingPincode")}
              placeholder="Enter pincode"
              required
              className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label className="block mb-2.5">
              Country <span className="text-red">*</span>
            </label>
            <select
              name={isShip ? "country" : "billingCountry"}
              onChange={handleCountryChange}
              value={checkoutValues?.[countryField] || ""}
              required
              className="w-full bg-gray-1 rounded-md border border-gray-3 py-3 pl-5 pr-9 outline-none focus:ring-2 focus:ring-blue/20"
            >
              <option value="">Select Country</option>
              {countryList.map((country) => (
                <option key={country.name} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block mb-2.5">
              State <span className="text-red">*</span>
            </label>
            <select
              onChange={handleInputChange(stateField)}
              value={checkoutValues?.[stateField] || ""}
              name={isShip ? "state" : "billingState"}
              required
              className="w-full bg-gray-1 rounded-md border border-gray-3 py-3 pl-5 pr-9 outline-none focus:ring-2 focus:ring-blue/20"
            >
              <option value="">Select State</option>
              {stateList.map((state) => (
                <option key={state.name} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isShip
          ?
          (<div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5 items-center justify-center">
            { (!isDiffBillAddress) && 
              <div className="w-full">
                <label className="block mb-2.5">
                  GST no.
                </label>
                <input
                  type="text"
                  name={'gstNo'}
                  value={checkoutValues?.gstNo || ""}
                  onChange={handleInputChange("gstNo")}
                  placeholder="Enter GST no."
                  className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
                />
              </div>
            }
            <div className="w-full">
              <Button type="link" onClick={() => { setIsDiffBillAddress(prev => !prev) }}>
                Is Different Billing Address ?
                <input className="ml-3" type="checkbox" checked={isDiffBillAddress} readOnly />
              </Button>
            </div>
          </div>)
          :
          (<div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5 items-center justify-center">
            <div className="w-full">
              <label className="block mb-2.5">
                GST no.
              </label>
              <input
                type="text"
                name={'gstNo'}
                value={checkoutValues?.gstNo || ""}
                onChange={handleInputChange("gstNo")}
                placeholder="Enter GST no."
                className="rounded-md border border-gray-3 bg-gray-1 w-full py-2.5 px-5 outline-none focus:ring-2 focus:ring-blue/20"
              />
            </div>
            <div className="w-full"></div>
          </div>)
        }
        
      </div>
    </div>
  );
};

export default Address;
