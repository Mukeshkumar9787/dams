import React from "react";
import { Metadata } from "next";
import AdminOrders from "@/components/AdminOrders";
export const metadata: Metadata = {
  title: "Orders List",
};

const OrdersList = () => {
  return (
    <>
      <AdminOrders />
    </>
  );
};

export default OrdersList;
