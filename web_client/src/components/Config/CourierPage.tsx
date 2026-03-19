"use client";

import React from "react";
import { getConfig, updateConfig } from "@/http/apiCalls";
import { CONFIG_KEYS } from "@/utils/constants";
import { notifySuccess } from "@/utils/notify";
import CourierList from "./Courier";
import SectionPageLayout from "./SectionPageLayout";

const CourierPage = () => {
  const [couriers, setCouriers] = React.useState([]);
  const [isSaving, setIsSaving] = React.useState(false);

  const fetchConfig = React.useCallback(async () => {
    try {
      const { success, data } = await getConfig({ configs: [CONFIG_KEYS.COURIER] });
      if (!success) return;
      setCouriers(data?.[CONFIG_KEYS.COURIER] ?? []);
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
    const response = await updateConfig({ config: { [CONFIG_KEYS.COURIER]: couriers } });
    if (response.success) {
      notifySuccess("Courier list updated.");
      fetchConfig();
    }
    setIsSaving(false);
  };

  return (
    <SectionPageLayout
      title="Manage courier and tracking providers."
      description="Maintain the courier services and tracking links used during order fulfillment."
      stats={[
        { label: "Couriers", value: couriers.length },
      ]}
      onSubmit={handleSubmit}
      isSaving={isSaving}
      saveLabel="Save Couriers"
    >
      <CourierList couriers={couriers} setCouriers={setCouriers} />
    </SectionPageLayout>
  );
};

export default CourierPage;
