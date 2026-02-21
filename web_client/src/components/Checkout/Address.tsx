import React, { useEffect, useState } from "react";
import countryList from "../../data/countries.json";
import { getLoggedInUserData } from "@/utils/helper";
import { ADDRESS_TYPES } from "@/utils/constants";
import { Button } from "antd";

const Address = ({ type = ADDRESS_TYPES.SHIP, isDiffBillAddress = false, setIsDiffBillAddress = null, setShippingInfo=null }) => {
  const [userData, setUserData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);


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
  const isShip = type === ADDRESS_TYPES.SHIP;

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    if(isShip){
      setShippingInfo({country: e.target.value, state: ''});
    };
  }

  const handleStateChange = (e) => {
    if(isShip){
      setShippingInfo(prev => ({ ...prev, state: e.target.value }));
    }
  }

  return (
    <div id="addressForm" className="mt-3">
      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <h2 className="font-medium text-xl text-dark mb-3">
          {isShip ? "Shipping" : "Billing"} Address
        </h2>

        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label className="block mb-2.5">
              Name <span className="text-red">*</span>
            </label>
            <input
              type="text"
              name={isShip ? "name": "billingName"}
              defaultValue={userData?.name || ""}
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
              name={isShip ? "mobile": "billingMobile"}
              defaultValue={userData?.mobile || ""}
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
            name={isShip ? "address": "billingAddress"}
            rows={2}
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
              name={isShip ? "city": "billingCity"}
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
              name={isShip ? "pincode": "billingPincode"}
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
              name={isShip ? "country": "billingCountry"}
              onChange={handleCountryChange}
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
              onChange={handleStateChange}
              name={isShip ? "state": "billingState"}
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
          &&
            <Button type="link" onClick={()=> {setIsDiffBillAddress(prev => !prev)}}>
              Is Different Billing Address ?
              <input className="ml-3" type="checkbox" checked={isDiffBillAddress} />
            </Button>
          }
      </div>
    </div>
  );
};

export default Address;
