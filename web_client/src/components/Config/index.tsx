"use client";

import AdminOverview from "@/components/Common/AdminOverview";
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
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const response = await updateConfig({config: { [CONFIG_KEYS.COMP_INFO]: compInfo, [CONFIG_KEYS.SHIPPING]: shipInfo, [CONFIG_KEYS.COURIER]: couriers }});
    if (response.success) {
      notifySuccess("Updated successfully.");
      fetchConfig();
    }
    setIsSaving(false);
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
      <section className="page-section bg-gray-2/60">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <AdminOverview
            eyebrow="Admin Settings"
            title="Configure store identity, shipping rules, and courier links."
            description="Keep the operational basics in one place so storefront details and fulfillment settings stay aligned."
            stats={[
              { label: "Company", value: compInfo?.name || "Not set" },
              { label: "Countries", value: (shipInfo?.countries || []).length },
              { label: "Couriers", value: couriers.length },
            ]}
          />

          <div className="surface-card max-w-[1040px] w-full mx-auto overflow-hidden p-0 shadow-[0_20px_55px_rgba(15,23,42,0.08)]">
            <form onSubmit={handleSubmit} className="p-5 sm:p-7">
              <CompanyInfo compInfo={compInfo} setCompInfo={setCompInfo} />
              <Ship shipInfo={shipInfo} setShipInfo={setShipInfo} />
              <CourierList couriers={couriers} setCouriers={setCouriers} />
              <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-blue px-6 py-3 text-sm font-medium text-white transition hover:bg-blue-dark disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSaving ? "Saving..." : "Save Settings"}
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
