"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { getConfig, updateConfig } from "@/http/apiCalls";
import { CONFIG_KEYS } from "@/utils/constants";
import React, { useState } from "react";
import Ship from "./Ship";
import CompanyInfo from "./CompanyInfo";
import CourierList from "./Courier";
import { notifySuccess } from "@/utils/notify";

const ConfigForm = () => {
  const [compInfo, setCompInfo] = useState({});
  const [shipInfo, setShipInfo] = useState({});
  const [couriers, setCouriers] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateConfig({config: { [CONFIG_KEYS.COMP_INFO]: compInfo, [CONFIG_KEYS.SHIPPING]: shipInfo, [CONFIG_KEYS.COURIER]: couriers }});
    if (response.success) {
      notifySuccess("Updated successfully.");
      fetchConfig();
    }
  };

  const fetchConfig = React.useCallback(async () => {
  try {
    const { success, data } = await getConfig();

    if (!success) return;

    setCompInfo(data?.[CONFIG_KEYS.COMP_INFO] ?? {});
    setShipInfo(data?.[CONFIG_KEYS.SHIPPING] ?? {});
    setCouriers(data?.[CONFIG_KEYS.COURIER] ?? []);
  } catch (error) {
    console.error(error);
  }
}, []);

  React.useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);


  return (
    <>
      <Breadcrumb title={"Config"} pages={["Config"]} />

      <section className="page-section bg-gray-2/60">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="form-card max-w-[1000px] w-full mx-auto">
            <form onSubmit={handleSubmit}>
              <CompanyInfo compInfo={compInfo} setCompInfo={setCompInfo} />
              <Ship shipInfo={shipInfo} setShipInfo={setShipInfo} />
              <CourierList couriers={couriers} setCouriers={setCouriers} />
              <div className="w-full flex justify-end mt-4">
                <button
                  type="submit"
                  className="btn-primary w-1/2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ConfigForm;
