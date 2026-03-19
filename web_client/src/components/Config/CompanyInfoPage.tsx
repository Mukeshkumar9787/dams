"use client";

import React from "react";
import { getConfig, updateConfig } from "@/http/apiCalls";
import { CONFIG_KEYS } from "@/utils/constants";
import { notifySuccess } from "@/utils/notify";
import CompanyInfo from "./CompanyInfo";
import SectionPageLayout from "./SectionPageLayout";

const CompanyInfoPage = () => {
  const [compInfo, setCompInfo] = React.useState({});
  const [isSaving, setIsSaving] = React.useState(false);

  const fetchConfig = React.useCallback(async () => {
    try {
      const { success, data } = await getConfig({ configs: [CONFIG_KEYS.COMP_INFO] });
      if (!success) return;
      setCompInfo(data?.[CONFIG_KEYS.COMP_INFO] ?? {});
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
    const response = await updateConfig({ config: { [CONFIG_KEYS.COMP_INFO]: compInfo } });
    if (response.success) {
      notifySuccess("Company info updated.");
      fetchConfig();
    }
    setIsSaving(false);
  };

  return (
    <SectionPageLayout
      title="Manage company identity and contact settings."
      description="Update the business details, support channels, and policy links used throughout the storefront."
      stats={[
        { label: "Company", value: compInfo?.name || "Not set" },
        { label: "Email", value: compInfo?.email || "Not set" },
        { label: "Mobile", value: compInfo?.mobile || "Not set" },
      ]}
      onSubmit={handleSubmit}
      isSaving={isSaving}
      saveLabel="Save Company Info"
    >
      <CompanyInfo compInfo={compInfo} setCompInfo={setCompInfo} />
    </SectionPageLayout>
  );
};

export default CompanyInfoPage;
