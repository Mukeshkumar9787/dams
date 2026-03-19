"use client";

import React from "react";
import { getConfig, updateConfig } from "@/http/apiCalls";
import { CONFIG_KEYS } from "@/utils/constants";
import { notifySuccess } from "@/utils/notify";
import Ship from "./Ship";
import SectionPageLayout from "./SectionPageLayout";

const ShippingInfoPage = () => {
  const [shipInfo, setShipInfo] = React.useState({});
  const [isSaving, setIsSaving] = React.useState(false);

  const fetchConfig = React.useCallback(async () => {
    try {
      const { success, data } = await getConfig({ configs: [CONFIG_KEYS.SHIPPING] });
      if (!success) return;
      setShipInfo(data?.[CONFIG_KEYS.SHIPPING] ?? {});
    } catch (error) {
      console.error(error);
    }
  }, []);

  React.useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const response = await updateConfig({ config: { [CONFIG_KEYS.SHIPPING]: shipInfo } });
    if (response.success) {
      notifySuccess("Shipping info updated.");
      fetchConfig();
    }
    setIsSaving(false);
  };

  return (
    <SectionPageLayout
      title="Manage shipping rules and delivery pricing."
      description="Control default shipping cost and region-wise overrides for countries and states."
      stats={[
        { label: "Default", value: shipInfo?.amount || 0 },
        { label: "Countries", value: (shipInfo?.countries || []).length },
        {
          label: "States",
          value: (shipInfo?.countries || []).reduce((sum: number, country: any) => sum + (country?.states || []).length, 0),
        },
      ]}
      onSubmit={handleSubmit}
      isSaving={isSaving}
      saveLabel="Save Shipping Info"
    >
      <Ship shipInfo={shipInfo} setShipInfo={setShipInfo} />
    </SectionPageLayout>
  );
};

export default ShippingInfoPage;
