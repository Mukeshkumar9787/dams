import type { Metadata } from "next";
import ShippingInfoPage from "@/components/Config/ShippingInfoPage";

export const metadata: Metadata = {
  title: "Shipping Info",
};

const Page = () => {
  return <ShippingInfoPage />;
};

export default Page;
