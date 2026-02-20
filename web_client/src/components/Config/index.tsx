"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { getConfig, updateConfig } from "@/http/apiCalls";
import { CONFIG_KEYS } from "@/utils/constants";
import React, { useState } from "react";
import Ship from "./Ship";
import CompanyInfo from "./CompanyInfo";

const ConfigForm = () => {
  const [compInfo, setCompInfo] = useState({});
  const [shipInfo, setShipInfo] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateConfig({config: { [CONFIG_KEYS.COMP_INFO]: compInfo, [CONFIG_KEYS.SHIPPING]: shipInfo }});
    if (response.success) {
      window.alert("Updated Successfully");
      fetchConfig();
    }
  };

  const fetchConfig = React.useCallback(async () => {
  try {
    const { success, data } = await getConfig();

    if (!success) return;

    setCompInfo(data?.[CONFIG_KEYS.COMP_INFO] ?? {});
    setShipInfo(data?.[CONFIG_KEYS.SHIPPING] ?? {});
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

      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[1000px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <form onSubmit={handleSubmit}>
              <CompanyInfo compInfo={compInfo} setCompInfo={setCompInfo} />
              <Ship shipInfo={shipInfo} setShipInfo={setShipInfo} />
              <div className="w-full flex justify-end mt-4">
                <button
                  type="submit"
                  className="w-1/2 flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg transition"
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
