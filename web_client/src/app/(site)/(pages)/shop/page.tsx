import React, { Suspense } from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";

import { Metadata } from "next";
import { PROJECT_DETAILS } from "@/utils/constants";

export const metadata: Metadata = {
  title: `Shop | ${PROJECT_DETAILS.name}`,
  description:
    "Browse the SMK catalog with featured collections, filters, and curated offers.",
};

const ShopWithSidebarPage = () => {
  return (
    <main>
      <Suspense fallback={null}>
        <ShopWithSidebar />
      </Suspense>
    </main>
  );
};

export default ShopWithSidebarPage;
