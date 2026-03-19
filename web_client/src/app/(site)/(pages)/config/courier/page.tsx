import type { Metadata } from "next";
import CourierPage from "@/components/Config/CourierPage";

export const metadata: Metadata = {
  title: "Courier",
};

const Page = () => {
  return <CourierPage />;
};

export default Page;
