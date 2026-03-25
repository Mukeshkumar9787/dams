import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";

import { Metadata } from "next";
import { PROJECT_DETAILS } from "@/utils/constants";

export const metadata: Metadata = {
  title: `Shop | ${PROJECT_DETAILS.name}`,
  description:
    "Browse the DAMS catalog with featured collections, filters, and curated offers.",
};

const ShopWithSidebarPage = () => {
  return (
    <main>
      <ShopWithSidebar />
    </main>
  );
};

export default ShopWithSidebarPage;
