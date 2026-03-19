import type { Metadata } from "next";
import CompanyInfoPage from "@/components/Config/CompanyInfoPage";

export const metadata: Metadata = {
  title: "Company Info",
};

const Page = () => {
  return <CompanyInfoPage />;
};

export default Page;
