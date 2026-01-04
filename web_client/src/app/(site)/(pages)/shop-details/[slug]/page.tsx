import React from "react";
import ShopDetails from "@/components/ShopDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Details Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Details Page for NextCommerce Template",
  // other metadata
};

const ShopDetailsPage = async({params}) => {
  return (
    <main>
      <ShopDetails params={ await params} />
    </main>
  );
};

export default ShopDetailsPage;
