import React from "react";
import { Metadata } from "next";
import OrderDetails from "@/components/Orders/OrderDetails";

export const metadata: Metadata = {
  title: "Orders",
};

const OrdersPage = async ({params}) => {
  return (
    <main>
      <OrderDetails params={await params} />
    </main>
  );
};

export default OrdersPage;
